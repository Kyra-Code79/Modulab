"use client"

import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { CartDrawer } from "./cart-drawer"
import { ShoppingCart, Menu, X } from "lucide-react"

export const Header = () => {
  const { itemCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-amber-900/20 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Modulab"
                  className="h-8 w-8 rounded-lg"
                />
              </div>
              <span className="hidden sm:inline font-serif text-xl font-semibold text-amber-50">Modulab</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex gap-8">
              <Link href="/" className="text-amber-50/80 hover:text-amber-200 transition text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="text-amber-50/80 hover:text-amber-200 transition text-sm font-medium">
                Produk
              </Link>
              <a href="#" className="text-amber-50/80 hover:text-amber-200 transition text-sm font-medium">
                Tentang Kami
              </a>
              <a href="#" className="text-amber-50/80 hover:text-amber-200 transition text-sm font-medium">
                Kontak
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-700/30 hover:bg-amber-900/20 transition"
              >
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                {itemCount > 0 && <span className="text-xs font-semibold text-amber-400">{itemCount}</span>}
              </button>

              {/* Mobile Menu */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-amber-50">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4 border-t border-amber-900/20 pt-4">
              <Link href="/" className="text-amber-50/80 hover:text-amber-200 py-2">
                Home
              </Link>
              <Link href="/products" className="text-amber-50/80 hover:text-amber-200 py-2">
                Produk
              </Link>
              <a href="/" className="text-amber-50/80 hover:text-amber-200 py-2">
                Tentang Kami
              </a>
              <a href="#" className="text-amber-50/80 hover:text-amber-200 py-2">
                Kontak
              </a>
            </nav>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
