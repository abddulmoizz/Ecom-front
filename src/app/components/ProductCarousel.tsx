"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface Product {
  id: number
  slug: string
  title: string
  price: string
  images: { url: string; formats?: Record<string, { url: string }> }[]
}

interface ProductCarouselProps {
  products: Product[]
}

const ProductCard = ({
  product,
  getBestImageUrl,
}: { product: Product; getBestImageUrl: (images: Product["images"]) => string | null }) => {
  const imageUrl = getBestImageUrl(product.images)

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0 w-64 sm:w-72 lg:w-80">
      <div className="p-4 sm:p-6">
        <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6 bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xs text-center px-2">{product.title}</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">G-SHOCK</p>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-2 sm:mb-3 leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4">${product.price}</p>

          <Link
            href={`/product/${product.slug}`}
            className="w-full bg-black text-white text-center py-2.5 sm:py-3 lg:py-3.5 rounded-sm hover:bg-gray-800 transition-colors uppercase text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2"
          >
            See Details
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getBestImageUrl = useCallback((images: Product["images"] = []) => {
    if (!images.length) return null
    const image = images[0]
    const formatUrl =
      image.formats?.medium?.url || image.formats?.small?.url || image.formats?.thumbnail?.url || image.url
    return formatUrl.startsWith("http") ? formatUrl : BASE_URL + formatUrl
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (scrollRef.current) setScrollPosition(scrollRef.current.scrollLeft)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollRef.current
    ? scrollPosition < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    : true

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <div className="hidden sm:flex gap-2 absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          {["left", "right"].map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir as "left" | "right")}
              disabled={dir === "left" ? !canScrollLeft : !canScrollRight}
              className={`p-2 lg:p-3 rounded-full border-2 transition-all duration-200 ${
                (dir === "left" ? !canScrollLeft : !canScrollRight)
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 sm:gap-6 pb-4 px-2 sm:px-4" style={{ width: "max-content" }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} getBestImageUrl={getBestImageUrl} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  )
}
