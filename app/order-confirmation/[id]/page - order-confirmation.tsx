"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const orderData = sessionStorage.getItem("lastOrder")
    if (orderData) {
      setOrder(JSON.parse(orderData))
    }
  }, [])

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-amber-50/60">Loading...</p>
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
            <h1 className="font-serif text-4xl font-bold mb-4">Pesanan Berhasil</h1>
            <p className="text-amber-50/60">Terima kasih telah berbelanja di Modulab</p>
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
                  <span className="text-amber-50">{order.billingInfo.address}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6">
              <h2 className="font-semibold text-amber-50 mb-4">Metode Pembayaran</h2>
              <p className="text-amber-50 capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-amber-900/20 bg-slate-900/50 p-6 mb-8">
            <h2 className="font-semibold text-amber-50 mb-4">Pesanan Anda</h2>
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
              className="block text-center bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-3 rounded-lg transition"
            >
              Lanjut Belanja
            </Link>
            <Link
              href="/"
              className="block text-center border border-amber-900/20 text-amber-50 hover:bg-amber-900/10 font-semibold py-3 rounded-lg transition"
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
