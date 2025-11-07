"use client"

import type React from "react"

import { useCart } from "@/lib/cart-context"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-amber-900/20 shadow-xl transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-900/20 px-6 py-4">
            <h2 className="font-serif text-lg font-semibold text-amber-50">Keranjang Belanja</h2>
            <button onClick={onClose} className="text-amber-50/60 hover:text-amber-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="text-amber-50/60 text-center py-8">Keranjang kosong</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-amber-900/20">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover bg-slate-800"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-medium text-amber-50 text-sm">{item.name}</p>
                        <p className="text-amber-400 font-semibold text-sm">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-amber-900/20 rounded"
                        >
                          <Minus className="w-3 h-3 text-amber-400" />
                        </button>
                        <span className="text-amber-50 text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-amber-900/20 rounded"
                        >
                          <Plus className="w-3 h-3 text-amber-400" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1 hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-amber-900/20 px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-amber-50/60">Subtotal:</span>
                <span className="font-semibold text-amber-50">{formatCurrency(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-3 rounded-lg transition text-center"
              >
                Lanjut ke Pembayaran →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
