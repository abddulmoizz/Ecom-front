"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "../../context/CartContext"
import Image from "next/image"

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart()

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-lg font-extrabold uppercase tracking-widest whitespace-nowrap flex-shrink-0"
        >
          G-SHOCK
        </Link>

        {/* Desktop Navigation - visible only from lg and above */}
        <nav className="hidden lg:block flex-1 ml-10">
          <ul className="flex space-x-6 text-white text-xs uppercase font-semibold tracking-wide whitespace-nowrap">
            {[
              { href: "/new-featured", label: "NEW & FEATURED" },
              { href: "/best-sellers", label: "BEST SELLERS" },
              { href: "/iconic-styles", label: "ICONIC STYLES" },
              { href: "/men", label: "MEN" },
              { href: "/women", label: "WOMEN" },
              { href: "/sale", label: "SALE" },
              { href: "/about-gshock", label: "ABOUT G-SHOCK" },
              { href: "/find-a-store", label: "FIND A STORE" },
            ].map(({ href, label }) => (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className="
                    relative
                    text-white
                    decoration-transparent
                    hover:decoration-transparent
                    after:absolute
                    after:-bottom-0.5
                    after:left-0
                    after:h-[2px]
                    after:w-full
                    after:bg-white
                    after:origin-left
                    after:scale-x-0
                    after:transition-transform
                    after:duration-300
                    after:ease-in-out
                    hover:after:scale-x-100
                  "
                  onClick={() => setMobileMenuOpen(false)} // close mobile menu if opened (precaution)
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side icons and search bar */}
        <div className="flex items-center space-x-4">
          {/* Search bar - show on lg+ */}
          <div className="hidden lg:flex items-center space-x-1">
            <input
              type="text"
              aria-label="Search"
              placeholder="Search..."
              className="outline-none text-white text-xs w-20 bg-black placeholder-gray-400 border-b border-white focus:border-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button aria-label="Search" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>

          {/* Cart Icon - visible on lg+ */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className="text-white hover:text-gray-400 hidden lg:block relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.6M7 13l-4-8M17 21a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getCartItemsCount()}
              </span>
            )}
          </button>

          {/* User Icon - visible on lg+ */}
          <button aria-label="User Account" className="hover:text-gray-400 hidden lg:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Hamburger Menu Button - visible below lg */}
          <button
            aria-label="Menu"
            className="hover:text-gray-400 lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                // Close icon (X)
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger icon
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown - visible below lg */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-black border-t border-gray-800">
          <ul className="flex flex-col px-6 py-4 space-y-3 text-white text-sm uppercase font-semibold tracking-wide">
            {[
              { href: "/new-featured", label: "NEW & FEATURED" },
              { href: "/best-sellers", label: "BEST SELLERS" },
              { href: "/iconic-styles", label: "ICONIC STYLES" },
              { href: "/men", label: "MEN" },
              { href: "/women", label: "WOMEN" },
              { href: "/sale", label: "SALE" },
              { href: "/about-gshock", label: "ABOUT G-SHOCK" },
              { href: "/find-a-store", label: "FIND A STORE" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block w-full py-2 border-b border-gray-800 hover:bg-gray-900"
                  onClick={() => setMobileMenuOpen(false)} // close menu on click link
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Mobile Search Bar */}
            <li>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  aria-label="Search"
                  placeholder="Search..."
                  className="flex-grow outline-none text-black text-sm px-2 py-1 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button aria-label="Search" className="text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </button>
              </div>
            </li>

            {/* Mobile Cart & User Icons */}
            <li className="flex space-x-6">
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className="text-white hover:text-gray-400 relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.6M7 13l-4-8M17 21a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              <button aria-label="User Account" className="hover:text-gray-400 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-black">Shopping Cart ({getCartItemsCount()})</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="text-black hover:underline">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const BASE_URL = "https://inspired-sunshine-587c5c91b5.strapiapp.com"
                      const getImageUrl = (image: any) => {
                        if (!image) return null
                        const imageUrl = image.formats?.small?.url || image.formats?.thumbnail?.url || image.url
                        return imageUrl?.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`
                      }
                      const imageUrl = item.product.images.length > 0 ? getImageUrl(item.product.images[0]) : null

                      return (
                        <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                            <p className="text-sm font-semibold text-black mt-2">${item.product.price}</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium text-black">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-black">
                            ${(Number.parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-black">Total</span>
                    <span className="text-black">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="w-full bg-black text-white py-3 text-center font-semibold uppercase hover:bg-gray-800 transition rounded block"
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Cart & Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-gray-300 py-3 text-center font-semibold uppercase bg-white text-gray-700 hover:bg-gray-50 transition rounded"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
