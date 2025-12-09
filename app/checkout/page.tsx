"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ChevronRight, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

const paymentMethods = [
  { id: "cc", name: "Credit Card / Debit Card", icon: "💳", type: "card" },
  { id: "paypal", name: "Paypal", icon: "🅿️", type: "ewallet" },
  { id: "qr", name: "QR Code", icon: "📱", type: "qr" },
  { id: "ovo", name: "OVO", icon: "🔵", type: "ewallet" },
  { id: "dana", name: "Dana", icon: "💜", type: "ewallet" },
  { id: "gopay", name: "Gopay", icon: "🟢", type: "ewallet" },
  { id: "shopee", name: "Shopee Pay", icon: "🛍️", type: "ewallet" },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [provinces, setProvinces] = useState<{ id: string; text: string }[]>([])
  const [cities, setCities] = useState<{ id: string; text: string }[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Payment Status States
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    postalCode: "",
    paymentMethod: "cc",
  })

  // 🔹 Specific Payment Details State
  const [paymentDetails, setPaymentDetails] = useState({
    ccNumber: "",
    ccCvv: "",
    ccMonth: "",
    ccYear: "",
    walletPhone: "",
  })

  // 🔹 Shipping and Discount
  const [shipping, setShipping] = useState(0)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const newDiscount = total * 0.1
    setDiscount(newDiscount)
  }, [total])

  useEffect(() => {
    if (!formData.province) {
      setShipping(0)
      return
    }

    const sumateraProvinces = [
      "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
      "Jambi", "Bengkulu", "Sumatera Selatan", "Lampung", "Bangka Belitung",
    ]

    const selectedProv = provinces.find((p) => p.id === formData.province)?.text?.trim().toLowerCase() || ""

    let newShipping = 0
    if (sumateraProvinces.includes(selectedProv)) {
      if (selectedProv === "sumatera utara") { // Fixed logic for case sensitivity
        newShipping = total < 50000 ? 50000 : 0
      } else {
        newShipping = total <= 100000 ? 100000 : 0
      }
    } else {
      newShipping = total <= 100000 ? 150000 : 0
    }

    setShipping(newShipping)
  }, [formData.province, total, provinces])

  const totalWithShipping = total - discount + (shipping || 0)

  // 🔹 API Fetching (Provinces)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://alamat.thecloudalert.com/api/provinsi/get/")
        const json = await res.json()
        if (json.status === 200 && Array.isArray(json.result)) {
          setProvinces(json.result.map((p: any) => ({ id: p.id, text: p.text })))
        } else {
          throw new Error("Cloud Alert API gagal")
        }
      } catch {
        try {
          const res2 = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json")
          const data2 = await res2.json()
          setProvinces(data2.map((p: any) => ({ id: p.id, text: p.name })))
        } catch (err) {
          console.error(err)
          setError("Gagal memuat daftar provinsi.")
        }
      } finally {
        setLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // 🔹 API Fetching (Cities)
  useEffect(() => {
    if (!formData.province) {
      setCities([])
      return
    }
    const fetchCities = async () => {
      setLoadingCities(true)
      try {
        const res = await fetch(`https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${formData.province}`)
        const json = await res.json()
        if (json.status === 200 && Array.isArray(json.result)) {
          setCities(json.result.map((c: any) => ({ id: c.id, text: c.text })))
        } else {
          throw new Error("Cloud Alert gagal, fallback Emsifa")
        }
      } catch {
        try {
          const res2 = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${formData.province}.json`)
          const data2 = await res2.json()
          setCities(data2.map((c: any) => ({ id: c.id, text: c.name })))
        } catch {
          setError("Gagal memuat kota untuk provinsi ini.")
        }
      } finally {
        setLoadingCities(false)
      }
    }
    fetchCities()
  }, [formData.province])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🔹 Handle Payment Detail Inputs
  const handlePaymentDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Limit CVV to 3 digits
    if (name === "ccCvv" && value.length > 3) return
    setPaymentDetails({ ...paymentDetails, [name]: value })
  }

  const handlePlaceOrder = () => {
    // 1. Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.province) {
      alert("Harap isi semua informasi pengiriman yang diperlukan")
      return
    }

    // 2. Payment Validation
    const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod)
    if (selectedMethod?.type === "card") {
        if (!paymentDetails.ccNumber || !paymentDetails.ccCvv || !paymentDetails.ccMonth || !paymentDetails.ccYear) {
            alert("Harap lengkapi detail Kartu Kredit")
            return
        }
    } else if (selectedMethod?.type === "ewallet") {
        if (!paymentDetails.walletPhone) {
            alert("Harap isi nomor telepon E-Wallet")
            return
        }
    }

    // 3. Start Payment Simulation
    setIsProcessing(true)
    setPaymentStatus("processing")

    // Simulate Network Delay (3 seconds)
    setTimeout(() => {
        setPaymentStatus("success")
        
        const orderId = `ORD-${Date.now()}`
        const orderData = {
          id: orderId,
          items,
          subtotal: total,
          discount,
          shipping,
          total: totalWithShipping,
          paymentMethod: formData.paymentMethod,
          paymentDetails: formData.paymentMethod === 'cc' ? { cardLast4: paymentDetails.ccNumber.slice(-4) } : { walletPhone: paymentDetails.walletPhone },
          billingInfo: formData,
          createdAt: new Date().toISOString(),
        }
    
        sessionStorage.setItem("lastOrder", JSON.stringify(orderData))
        clearCart()

        // Wait a bit on success screen before redirecting
        setTimeout(() => {
            router.push(`/order-confirmation/${orderId}`)
        }, 1500)

    }, 3000)
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-amber-50/60 mb-4">Keranjang Anda kosong</p>
            <Link href="/products" className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold px-6 py-2 rounded-lg hover:from-amber-500 hover:to-amber-600 transition">
              Lanjutkan Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col relative">
      <Header />

      {/* 🔹 PAYMENT STATUS OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-900 border border-amber-900/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                {paymentStatus === "processing" ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold font-serif text-amber-50 mb-2">Memproses Pembayaran</h2>
                        <p className="text-amber-50/60">Mohon tunggu, jangan tutup halaman ini...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                        <h2 className="text-2xl font-bold font-serif text-amber-50 mb-2">Pembayaran Berhasil!</h2>
                        <p className="text-amber-50/60">Mengalihkan ke halaman konfirmasi...</p>
                    </div>
                )}
            </div>
        </div>
      )}

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Billing Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
                <h2 className="font-semibold text-lg text-amber-50 mb-6">Informasi Penagihan</h2>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <div className="space-y-4">
                  <input type="text" name="name" placeholder="Nama Lengkap" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    <input type="tel" name="phone" placeholder="Nomor Telepon" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <textarea name="address" placeholder="Alamat Lengkap" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />

                  <div className="grid grid-cols-2 gap-4">
                    <select name="province" value={formData.province} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400">
                        <option value="">Pilih Provinsi</option>
                        {loadingProvinces ? <option>Loading...</option> : provinces.map((prov) => (<option key={prov.id} value={prov.id}>{prov.text}</option>))}
                    </select>
                    <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.province || loadingCities} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400">
                        <option value="">{loadingCities ? "Loading..." : "Pilih Kota / Kab"}</option>
                        {cities.map((city) => (<option key={city.id} value={city.text}>{city.text}</option>))}
                    </select>
                  </div>
                  <input type="text" name="postalCode" placeholder="Kode Pos" value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
                <h2 className="font-semibold text-lg text-amber-50 mb-6">Metode Pembayaran</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                        <div key={method.id} className={`border rounded-lg transition overflow-hidden ${isSelected ? 'border-amber-400 bg-amber-900/10' : 'border-amber-900/30 hover:border-amber-900/50'}`}>
                            {/* Radio Header */}
                            <label className="flex items-center p-4 cursor-pointer w-full">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={isSelected}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 accent-amber-400"
                                />
                                <span className="ml-3 text-amber-50 font-medium">
                                    {method.icon} {method.name}
                                </span>
                            </label>

                            {/* 🔹 Dynamic Inputs Based on Selection */}
                            {isSelected && (
                                <div className="px-4 pb-4 pl-11 animate-in slide-in-from-top-2 duration-200">
                                    {/* 1. Credit Card Form */}
                                    {method.type === "card" && (
                                        <div className="space-y-3 bg-slate-950/50 p-4 rounded-lg border border-amber-900/20">
                                            <div>
                                                <label className="text-xs text-amber-50/60 block mb-1">Nomor Kartu</label>
                                                <input type="text" name="ccNumber" placeholder="0000 0000 0000 0000" value={paymentDetails.ccNumber} onChange={handlePaymentDetailChange} className="w-full px-3 py-2 bg-slate-800 border border-amber-900/30 rounded text-amber-50 text-sm focus:ring-1 focus:ring-amber-400 outline-none"/>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-1/4">
                                                    <label className="text-xs text-amber-50/60 block mb-1">CVV</label>
                                                    <input type="text" name="ccCvv" placeholder="123" maxLength={3} value={paymentDetails.ccCvv} onChange={handlePaymentDetailChange} className="w-full px-3 py-2 bg-slate-800 border border-amber-900/30 rounded text-amber-50 text-sm focus:ring-1 focus:ring-amber-400 outline-none"/>
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="text-xs text-amber-50/60 block mb-1">Bulan (MM)</label>
                                                    <input type="text" name="ccMonth" placeholder="MM" maxLength={2} value={paymentDetails.ccMonth} onChange={handlePaymentDetailChange} className="w-full px-3 py-2 bg-slate-800 border border-amber-900/30 rounded text-amber-50 text-sm focus:ring-1 focus:ring-amber-400 outline-none"/>
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="text-xs text-amber-50/60 block mb-1">Tahun (YY)</label>
                                                    <input type="text" name="ccYear" placeholder="YY" maxLength={2} value={paymentDetails.ccYear} onChange={handlePaymentDetailChange} className="w-full px-3 py-2 bg-slate-800 border border-amber-900/30 rounded text-amber-50 text-sm focus:ring-1 focus:ring-amber-400 outline-none"/>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. E-Wallet Form */}
                                    {method.type === "ewallet" && (
                                        <div className="bg-slate-950/50 p-4 rounded-lg border border-amber-900/20">
                                            <label className="text-xs text-amber-50/60 block mb-1">Nomor {method.name}</label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-amber-900/30 bg-slate-800 text-amber-50/60 text-sm">
                                                    +62
                                                </span>
                                                <input type="tel" name="walletPhone" placeholder="812 3456 7890" value={paymentDetails.walletPhone} onChange={handlePaymentDetailChange} className="flex-1 px-3 py-2 bg-slate-800 border border-amber-900/30 rounded-r-md text-amber-50 text-sm focus:ring-1 focus:ring-amber-400 outline-none"/>
                                            </div>
                                            <p className="text-xs text-amber-50/40 mt-2">Pastikan nomor terdaftar di aplikasi {method.name}.</p>
                                        </div>
                                    )}

                                    {/* 3. QR Code View */}
                                    {method.type === "qr" && (
                                        <div className="bg-slate-950/50 p-4 rounded-lg border border-amber-900/20 text-center">
                                            <p className="text-sm text-amber-50 mb-3">Scan QR Code di bawah untuk membayar</p>
                                            <div className="bg-white p-2 inline-block rounded-lg">
                                                {/* Using a placeholder QR Code API for demo */}
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ModulabOrder-${totalWithShipping}`} 
                                                    alt="Payment QR" 
                                                    className="w-32 h-32"
                                                />
                                            </div>
                                            <p className="text-xs text-amber-50/40 mt-3">Total yang harus dibayar: <span className="text-amber-400 font-bold">{formatCurrency(totalWithShipping)}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-amber-50 mb-6">Pesanan Anda</h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="text-amber-50 font-medium">{item.name}</p>
                        <p className="text-amber-50/60 text-xs">{item.quantity}x {formatCurrency(item.price)}</p>
                      </div>
                      <p className="text-amber-400 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-amber-900/20 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-50/60">Subtotal</span>
                    <span className="text-amber-50">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Diskon 10%</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-50/60">Pengiriman</span>
                    <span className="text-amber-50">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-amber-900/20 pt-4">
                    <span className="text-amber-50">Total</span>
                    <span className="text-amber-400">{formatCurrency(totalWithShipping)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Memproses..." : "Buat Pesanan"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}