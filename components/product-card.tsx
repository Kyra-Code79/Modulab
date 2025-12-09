"use client"

import type React from "react"
import Link from "next/link" // 1. Import Link
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (e: React.MouseEvent) => {
    // Mencegah link parent ter-trigger saat tombol add to cart diklik
    e.preventDefault() 
    e.stopPropagation()
    
    addToCart(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="group rounded-xl border border-amber-900/20 bg-slate-900/50 hover:bg-slate-900/80 transition overflow-hidden flex flex-col h-full relative">
      {/* 2. Bungkus area gambar dan judul dengan Link */}
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        
        <div className="relative h-48 overflow-hidden bg-slate-800">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        
        <div className="flex flex-col flex-1 p-4">
          <p className="text-xs text-amber-400/80 mb-2 uppercase tracking-wider">{product.category}</p>
          <h3 className="font-semibold text-amber-50 text-sm mb-2 line-clamp-2 group-hover:text-amber-400 transition">
            {product.name}
          </h3>
          <p className="text-xs text-amber-50/60 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="mt-auto space-y-3">
            <p className="text-lg font-bold text-amber-400">{formatCurrency(product.price)}</p>
            
            {/* Input dan Button Add to Cart */}
            {/* Kita beri div ini event stopPropagation agar tidak ikut mengklik Link */}
            <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-2 bg-slate-800 border border-amber-900/30 rounded text-amber-50 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
}