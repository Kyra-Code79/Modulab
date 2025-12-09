"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react"

// 🔹 Nomor Admin (Format internasional tanpa +, hapus 0 di depan)
const ADMIN_WA_NUMBER = "6282273024059"

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // Ambil data order dari sessionStorage (atau bisa fetch dari API jika sudah ada backend)
    const orderData = sessionStorage.getItem("lastOrder")
    if (orderData) {
      setOrder(JSON.parse(orderData))
    }
  }, [])

  // 🔹 Fungsi Kirim ke WhatsApp
  // 🔹 Fungsi Kirim ke WhatsApp (Diperbaiki)
  const handleWhatsAppConfirm = () => {
    if (!order) return

    // 1. Buat daftar item
    const itemList = order.items
      .map((item: any) => `- ${item.name} (${item.quantity}x)`)
      .join("\n")

    // 2. Susun template pesan
    // Menggunakan emoji standar yang lebih aman
    const message = `Halo Admin Modulab, saya ingin konfirmasi pesanan baru.

📦 *ID Pesanan:* ${order.id}
👤 *Nama:* ${order.billingInfo.name}
💰 *Total:* ${formatCurrency(order.total)}
💳 *Metode Bayar:* ${order.paymentMethod.toUpperCase()}

*Detail Item:*
${itemList}

Mohon diproses, terima kasih! 🙏`

    // 3. Encode pesan secara manual agar karakter spesial aman
    const encodedMessage = encodeURIComponent(message)
    
    // 4. Buka WhatsApp
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodedMessage}`, "_blank")
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-amber-50/60">Memuat data pesanan...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
            <h1 className="font-serif text-4xl font-bold mb-4">Pesanan Berhasil!</h1>
            <p className="text-amber-50/60">Terima kasih telah berbelanja di Modulab</p>
          </div>

          {/* 🔹 TOMBOL WHATSAPP (Highlight Action) */}
          <div className="mb-8 p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-center">
            <h3 className="text-emerald-400 font-semibold mb-2">Langkah Terakhir</h3>
            <p className="text-sm text-emerald-100/70 mb-4">
              Kirim detail pesanan ini ke Admin untuk mempercepat proses pengiriman.
            </p>
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg shadow-emerald-900/20"
            >
              <MessageCircle className="w-5 h-5" />
              Konfirmasi ke WhatsApp
            </button>
          </div>

          {/* Order ID */}
          <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6 mb-8 text-center">
            <p className="text-amber-50/60 text-sm mb-2">ID Pesanan</p>
            <p className="font-serif text-2xl font-bold text-amber-400">{order.id}</p>
          </div>

          {/* Billing Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
              <h2 className="font-semibold text-amber-50 mb-4">Informasi Penagihan</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-amber-50/60">Nama:</span>{" "}
                  <span className="text-amber-50">{order.billingInfo.name}</span>
                </p>
                <p>
                  <span className="text-amber-50/60">Email:</span>{" "}
                  <span className="text-amber-50">{order.billingInfo.email}</span>
                </p>
                <p>
                  <span className="text-amber-50/60">Telepon:</span>{" "}
                  <span className="text-amber-50">{order.billingInfo.phone}</span>
                </p>
                <p>
                  <span className="text-amber-50/60">Alamat:</span>{" "}
                  <span className="text-amber-50 line-clamp-2">{order.billingInfo.address}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
              <h2 className="font-semibold text-amber-50 mb-4">Metode Pembayaran</h2>
              <p className="text-amber-50 capitalize font-medium mb-1">
                {order.paymentMethod === 'cc' ? 'Kartu Kredit' : 
                 order.paymentMethod === 'qr' ? 'QR Code (Qris)' : 
                 order.paymentMethod.toUpperCase()}
              </p>
              <p className="text-xs text-emerald-400">Lunas / Menunggu Konfirmasi</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6 mb-8">
            <h2 className="font-semibold text-amber-50 mb-4">Rincian Barang</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center pb-3 border-b border-amber-900/20 last:border-0"
                >
                  <div>
                    <p className="text-amber-50 font-medium">{item.name}</p>
                    <p className="text-amber-50/60 text-sm">
                      {item.quantity}x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-amber-400 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6 mb-8">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-50/60">Subtotal</span>
                <span className="text-amber-50">{formatCurrency(order.subtotal)}</span>
              </div>
              
              {/* Menampilkan Diskon Jika Ada */}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Diskon</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-amber-50/60">Pengiriman</span>
                <span className="text-amber-50">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-amber-900/20 pt-2 mt-2">
                <span className="text-amber-50">Total</span>
                <span className="text-amber-400">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="block text-center bg-slate-800 border border-amber-900/30 hover:bg-slate-700 text-amber-50 font-semibold py-3 rounded-lg transition"
            >
              Lanjut Belanja
            </Link>
            <Link
              href="/"
              className="block text-center text-amber-50/60 hover:text-amber-50 text-sm py-2"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}