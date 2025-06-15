"use client"
import Link from "next/link"
import type React from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useCart } from "../../context/CartContext"

const BASE_URL = "https://inspired-sunshine-587c5c91b5.strapiapp.com"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [directProduct, setDirectProduct] = useState<any>(null)
  const [directQuantity, setDirectQuantity] = useState(1)
  const [directSize, setDirectSize] = useState<string | null>(null)
  const [isDirectCheckout, setIsDirectCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const [activeStep, setActiveStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const productSlug = urlParams.get("product")
    const quantity = urlParams.get("quantity")
    const size = urlParams.get("size")

    if (productSlug) {
      setIsDirectCheckout(true)
      setDirectQuantity(Number.parseInt(quantity || "1"))
      setDirectSize(size)
      setLoading(true)

      // Fetch the specific product
      fetch(`${BASE_URL}/api/products?populate=*`)
        .then((res) => res.json())
        .then(({ data }) => {
          const product = data.find((p: any) => p.attributes?.slug === productSlug || p.slug === productSlug)

          if (product) {
            const prod = product.attributes ? { ...product.attributes, id: product.id } : product
            setDirectProduct(prod)
          }
        })
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setLoading(false))
    }

    setMounted(true)
  }, [])

  const getImageUrl = (image: any) => {
    if (!image) return null
    const imageUrl = image.formats?.small?.url || image.formats?.thumbnail?.url || image.url
    return imageUrl?.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`
  }

  const getCheckoutItems = () => {
    if (isDirectCheckout && directProduct) {
      return [
        {
          id: `${directProduct.id}-${directSize || "no-size"}`,
          product: directProduct,
          selectedSize: directSize,
          quantity: directQuantity,
        },
      ]
    }
    return cart
  }

  const checkoutItems = getCheckoutItems()
  const subtotal =
    isDirectCheckout && directProduct ? Number.parseFloat(directProduct.price) * directQuantity : getCartTotal()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string) => {
    // Format specific fields
    if (field === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()
    } else if (field === "expiryDate") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5)
    } else if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4)
    }

    // Update appropriate state
    if (["cardNumber", "expiryDate", "cvv", "nameOnCard"].includes(field)) {
      setPaymentInfo((prev) => ({ ...prev, [field]: value }))
    } else {
      setShippingInfo((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!shippingInfo.firstName.trim()) newErrors.firstName = "First name is required"
      if (!shippingInfo.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!shippingInfo.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
        newErrors.email = "Please enter a valid email address"
      }
      if (!shippingInfo.phone.trim()) newErrors.phone = "Phone number is required"
      if (!shippingInfo.address.trim()) newErrors.address = "Address is required"
      if (!shippingInfo.city.trim()) newErrors.city = "City is required"
      if (!shippingInfo.state.trim()) newErrors.state = "State is required"
      if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
      if (!shippingInfo.country.trim()) newErrors.country = "Country is required"
    } else if (step === 2) {
      if (!paymentInfo.cardNumber.replace(/\s/g, "")) {
        newErrors.cardNumber = "Card number is required"
      } else if (paymentInfo.cardNumber.replace(/\s/g, "").length < 13) {
        newErrors.cardNumber = "Please enter a valid card number"
      }
      if (!paymentInfo.expiryDate) {
        newErrors.expiryDate = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      }
      if (!paymentInfo.cvv) {
        newErrors.cvv = "CVV is required"
      } else if (paymentInfo.cvv.length < 3) {
        newErrors.cvv = "Please enter a valid CVV"
      }
      if (!paymentInfo.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Do nothing - form submission disabled
  }

  const renderInput = (field: string, label: string, type = "text", placeholder = "", maxLength?: number) => (
    <div
      className={
        field === "email" ||
        field === "phone" ||
        field === "address" ||
        field === "cardNumber" ||
        field === "nameOnCard"
          ? "md:col-span-2"
          : ""
      }
    >
      <label className="block text-sm font-medium text-black mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={
          field.includes("card") || field === "expiryDate" || field === "cvv" || field === "nameOnCard"
            ? paymentInfo[field as keyof PaymentInfo]
            : shippingInfo[field as keyof ShippingInfo]
        }
        onChange={(e) => handleInputChange(field, e.target.value)}
        maxLength={maxLength}
        className={`w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  )

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center py-20 text-black">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cart.length === 0 && !isDirectCheckout) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-black mb-4">Your cart is empty</h1>
              <p className="text-black mb-6">Add some items to your cart before checking out.</p>
              <Link href="/" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-black">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("firstName", "First Name")}
              {renderInput("lastName", "Last Name")}
              {renderInput("email", "Email", "email")}
              {renderInput("phone", "Phone", "tel")}
              {renderInput("address", "Address")}
              {renderInput("city", "City")}
              {renderInput("state", "State")}
              {renderInput("zipCode", "ZIP Code")}
              {renderInput("country", "Country")}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-black">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("cardNumber", "Card Number", "text", "1234 5678 9012 3456", 19)}
              {renderInput("expiryDate", "Expiry Date", "text", "MM/YY", 5)}
              {renderInput("cvv", "CVV", "text", "123", 4)}
              {renderInput("nameOnCard", "Name on Card")}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">Checkout</h1>
            <div className="mt-4 flex items-center space-x-4">
              {[1, 2].map((step, index) => {
                const stepNames = ["Shipping", "Payment"]
                return (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center ${activeStep >= step ? "text-black" : "text-black"}`}>
                      <span
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                          activeStep >= step ? "bg-black text-white border-black" : "border-gray-300"
                        }`}
                      >
                        {step}
                      </span>
                      <span className="ml-2 font-medium">{stepNames[index]}</span>
                    </div>
                    {index < 1 && (
                      <div className={`w-12 h-px ml-4 ${activeStep > step ? "bg-black" : "bg-gray-300"}`}></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent()}

                <div className="flex justify-between">
                  <div className="flex space-x-4">
                    <Link
                      href="/"
                      className="px-6 py-3 border border-gray-300 rounded-md text-black hover:bg-gray-50 transition"
                    >
                      Continue Shopping
                    </Link>
                    {activeStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        className="px-6 py-3 border border-gray-300 rounded-md text-black hover:bg-gray-50 transition"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  {activeStep < 2 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition font-semibold"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition font-semibold"
                    >
                      Place Order
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-6 text-black">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {checkoutItems.map((item) => {
                    const imageUrl = getImageUrl(item.product.images[0])

                    return (
                      <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={item.product.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-black truncate">{item.product.title}</h3>
                          <p className="text-xs text-black mt-1">{item.product.catagory?.Name}</p>
                          {item.selectedSize && <p className="text-xs text-black">Size: {item.selectedSize}</p>}

                          {!isDirectCheckout && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-black hover:bg-gray-50"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium text-black">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-black hover:bg-gray-50"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          {isDirectCheckout && <p className="text-sm text-black mt-2">Quantity: {item.quantity}</p>}
                        </div>

                        <div className="text-sm font-medium text-black">
                          ${(Number.parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">
                      Subtotal ({isDirectCheckout ? directQuantity : getCartItemsCount()} items)
                    </span>
                    <span className="text-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Shipping</span>
                    <span className="text-black">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Tax</span>
                    <span className="text-black">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-black">Total</span>
                      <span className="text-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-black mt-2">Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
