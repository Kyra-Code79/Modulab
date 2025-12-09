"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const paymentMethods = [
  { id: "cc", name: "Credit Card / Debit Card", icon: "💳" },
  { id: "paypal", name: "Paypal", icon: "🅿️" },
  { id: "qr", name: "QR Code", icon: "📱" },
  { id: "ovo", name: "OVO", icon: "🔵" },
  { id: "dana", name: "Dana", icon: "💜" },
  { id: "gopay", name: "Gopay", icon: "🟢" },
  { id: "shopee", name: "Shopee Pay", icon: "🛍️" },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [provinces, setProvinces] = useState<{ id: string; text: string }[]>([])
  const [cities, setCities] = useState<{ id: string; text: string }[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

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

  // 🔹 Tentukan biaya pengiriman berdasarkan provinsi dan total
// let shipping = 0
// 🔹 Shipping dan Diskon
  const [shipping, setShipping] = useState(0)
  const [discount, setDiscount] = useState(0) // 🔹 diskon 10%

  // Hitung diskon otomatis tiap kali total berubah
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
      "Aceh",
      "Sumatera Utara",
      "Sumatera Barat",
      "Riau",
      "Kepulauan Riau",
      "Jambi",
      "Bengkulu",
      "Sumatera Selatan",
      "Lampung",
      "Bangka Belitung",
    ]

    const selectedProv = provinces.find((p) => p.id === formData.province)?.text?.trim().toLowerCase() || ""

    let newShipping = 0
    if (sumateraProvinces.includes(selectedProv)) {
      if (selectedProv === "Sumatera Utara") {
        newShipping = total < 50000 ? 50000 : 0
      } else {
        newShipping = total <= 100000 ? 100000 : 0
      }
    } else {
      newShipping = total <= 100000 ? 150000 : 0
    }

    setShipping(newShipping)
  }, [formData.province, total, provinces])

  // 🔹 Total akhir dengan diskon & pengiriman
  const totalWithShipping = total - discount + (shipping || 0)
  // 🔹 Fetch daftar provinsi dari The Cloud Alert API
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
        // fallback ke API Wilayah Indonesia
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

  // 🔹 Fetch daftar kota berdasarkan provinsi
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
        // fallback ke API Wilayah Indonesia
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
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.province) {
      alert("Harap isi semua informasi yang diperlukan")
      return
    }

    const orderId = `ORD-${Date.now()}`
    const orderData = {
      id: orderId,
      items,
      subtotal: total,
      discount, // 🔹 tambahkan di data order
      shipping,
      total: totalWithShipping,
      paymentMethod: formData.paymentMethod,
      billingInfo: formData,
      createdAt: new Date().toISOString(),
    }

    sessionStorage.setItem("lastOrder", JSON.stringify(orderData))
    clearCart()
    router.push(`/order-confirmation/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-amber-50/60 mb-4">Keranjang Anda kosong</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold px-6 py-2 rounded-lg hover:from-amber-500 hover:to-amber-600 transition"
            >
              Lanjutkan Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

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
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 placeholder:text-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 placeholder:text-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nomor Telepon"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 placeholder:text-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <textarea
                    name="address"
                    placeholder="Alamat"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 placeholder:text-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />

                  {/* 🔹 Province Dropdown */}
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Pilih Provinsi</option>
                    {loadingProvinces ? (
                      <option>Memuat provinsi...</option>
                    ) : (
                      provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.text}
                        </option>
                      ))
                    )}
                  </select>

                  {/* 🔹 City Dropdown */}
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.province || loadingCities}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">
                      {loadingCities
                        ? "Memuat kota..."
                        : !formData.province
                        ? "Pilih provinsi terlebih dahulu"
                        : "Pilih Kota / Kabupaten"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.text}>
                        {city.text}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Kode Pos"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-900/30 rounded-lg text-amber-50 placeholder:text-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
                <h2 className="font-semibold text-lg text-amber-50 mb-6">Metode Pembayaran</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center p-3 border border-amber-900/30 rounded-lg hover:bg-amber-900/10 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-amber-400"
                      />
                      <span className="ml-3 text-amber-50">
                        {method.icon} {method.name}
                      </span>
                    </label>
                  ))}
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
                        <p className="text-amber-50/60 text-xs">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
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

                  {/* 🔹 Tambahkan diskon */}
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
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  Buat Pesanan <ChevronRight className="w-4 h-4" />
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
