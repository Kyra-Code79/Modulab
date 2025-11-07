// Product dan Order types untuk e-commerce
export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
  }
  createdAt: Date
}

export type PaymentMethod = "credit-card" | "paypal" | "qr-code" | "ovo" | "dana" | "gopay" | "shopeepay"
