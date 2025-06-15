"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useCallback } from "react"
import { useCart } from "../../context/CartContext"

const BASE_URL = "https://inspired-sunshine-587c5c91b5.strapiapp.com"

interface Product {
  id: number
  slug: string
  title: string
  price: string
  Description: { type: string; children: { text: string }[] }[]
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
  size: { id: number; size: string }[]
  series?: string
  isNew?: boolean
  releaseDate?: string
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart()

  const getImageUrl = useCallback((image: Product["images"][0]) => {
    if (!image) return null

    let imageUrl = null
    if (image.formats) {
      imageUrl =
        image.formats.large?.url ||
        image.formats.medium?.url ||
        image.formats.small?.url ||
        image.formats.thumbnail?.url
    }

    if (!imageUrl) {
      imageUrl = image.url
    }

    if (!imageUrl) return null
    return imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`
  }, [])

  const images = product?.images || []

  const changeImage = useCallback(
    (next: boolean) => {
      if (images.length === 0) return
      setFade(false)
      setImageError(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (next ? (prev + 1) % images.length : prev === 0 ? images.length - 1 : prev - 1))
        setFade(true)
      }, 300)
    },
    [images.length],
  )

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => changeImage(true), 4000)
  }, [changeImage])

  const handleImageError = () => {
    setImageError(true)
  }

  const currentImageUrl = images.length > 0 ? getImageUrl(images[currentImageIndex]) : null

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        images: product.images,
        catagory: product.catagory,
      },
      selectedSize,
    )
    setIsCartOpen(true)
  }

  const handleBuyNow = () => {
    const checkoutUrl = new URL("/checkout", window.location.origin)
    checkoutUrl.searchParams.set("product", product.slug)
    checkoutUrl.searchParams.set("quantity", "1")
    if (selectedSize) {
      checkoutUrl.searchParams.set("size", selectedSize)
    }
    window.location.href = checkoutUrl.toString()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Section */}
      <section aria-label="Product images" className="space-y-5">
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
          {images.length > 0 && currentImageUrl && !imageError ? (
            <>
              <div className="relative w-full h-full">
                <Image
                  src={currentImageUrl || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>

              <button
                onClick={() => {
                  changeImage(false)
                  resetTimer()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-3 hover:bg-opacity-80 transition select-none shadow-lg z-10"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  changeImage(true)
                  resetTimer()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-3 hover:bg-opacity-80 transition select-none shadow-lg z-10"
                aria-label="Next image"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === currentImageIndex) return
                      setFade(false)
                      setImageError(false)
                      setTimeout(() => {
                        setCurrentImageIndex(idx)
                        setFade(true)
                      }, 300)
                      resetTimer()
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${idx === currentImageIndex ? "bg-black" : "bg-gray-400 hover:bg-gray-600"}`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📷</div>
              <p className="italic">No image available</p>
              {imageError && <p className="text-sm text-red-500 mt-2">Failed to load image</p>}
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-5 overflow-x-auto lg:overflow-visible" aria-label="Image thumbnails">
          {images.map((img, idx) => {
            const thumbUrl = getImageUrl(img)
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx)
                  setImageError(false)
                  resetTimer()
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition relative ${idx === currentImageIndex ? "border-black" : "border-transparent hover:border-gray-500"}`}
                aria-label={`Select variant ${idx + 1}`}
              >
                {thumbUrl ? (
                  <Image
                    src={thumbUrl || "/placeholder.svg"}
                    alt={`Variant ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                ) : null}
                <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  N/A
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Product Details */}
      <section aria-label="Product details" className="flex flex-col justify-start space-y-6">
        <div className="text-sm uppercase tracking-wide text-gray-600" aria-label="Product category">
          {product.catagory?.Name?.toUpperCase() || ""}
        </div>
        {product.series && (
          <div className="text-xs uppercase tracking-wide text-gray-500" aria-label="Product series">
            {product.series.toUpperCase()}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" tabIndex={-1}>
          {product.title}
        </h1>

        <div className="flex flex-wrap gap-3 mt-2" aria-label="Badges">
          {product.isNew && (
            <span className="text-xs uppercase font-semibold border border-black px-3 py-1 rounded whitespace-nowrap">
              NEW
            </span>
          )}
          {product.releaseDate && (
            <span className="text-xs uppercase font-semibold border border-black px-3 py-1 rounded whitespace-nowrap">
              {product.releaseDate}
            </span>
          )}
        </div>

        <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4" aria-label="Price">
          ${product.price}
        </p>

        {product.size?.length > 0 && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2">Select Size</p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Size options">
              {product.size.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s.size)}
                  className={`px-4 sm:px-5 py-2 rounded-full border text-sm font-medium transition ${selectedSize === s.size ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"}`}
                  aria-pressed={selectedSize === s.size}
                  aria-label={`Size ${s.size}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="mt-1 text-sm text-green-700 font-semibold" aria-live="polite">
                Selected size: {selectedSize}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={handleBuyNow}
            className="w-full bg-black text-white border border-black py-3 text-center font-semibold uppercase hover:bg-gray-500 hover:text-white transition rounded"
            aria-label="Buy this product now"
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className="w-full border border-black py-3 text-center font-semibold uppercase bg-white text-black hover:bg-gray-500 hover:text-white transition rounded"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
        </div>

        <article className="mt-8 prose prose-sm sm:prose max-w-none text-gray-700" aria-label="Product description">
          {product.Description.map((block, index) =>
            block.children.map((child, i) => <p key={`${index}-${i}`}>{child.text}</p>),
          )}
        </article>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
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
    </div>
  )
}
