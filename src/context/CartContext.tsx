"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string // combination of product.id and selectedSize
  product: {
    id: number
    slug: string
    title: string
    price: string
    images: {
      url: string
      formats?: {
        thumbnail?: { url: string }
        small?: { url: string }
        medium?: { url: string }
        large?: { url: string }
      }
    }[]
    catagory?: { id: number; Name: string }
  }
  selectedSize: string | null
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartItem["product"], selectedSize: string | null, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from session storage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem("shopping-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from session storage:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to session storage whenever cart changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem("shopping-cart", JSON.stringify(cart))
    }
  }, [cart, mounted])

  const addToCart = (product: CartItem["product"], selectedSize: string | null, quantity = 1) => {
    const itemId = `${product.id}-${selectedSize || "no-size"}`

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId)

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            selectedSize,
            quantity,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + Number.parseFloat(item.product.price) * item.quantity
    }, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
