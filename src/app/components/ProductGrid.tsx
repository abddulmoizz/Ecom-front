"use client"

import { useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"

const BASE_URL = "https://inspired-sunshine-587c5c91b5.strapiapp.com"

interface Product {
  id: number
  slug: string
  title: string
  price: string
  images?: { url: string; formats?: Record<string, { url: string }> }[]
}

interface Category {
  id: number
  Name: string
  products: Product[]
}

interface ProductGridProps {
  categories: Category[]
  products: Product[]
}

const ProductCard = memo(function ProductCard({
  product,
  isHearted,
  onToggleHeart,
  getBestImageUrl,
}: {
  product: Product
  isHearted: boolean
  onToggleHeart: (id: number) => void
  getBestImageUrl: (images?: Product["images"]) => string | null
}) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:border-black cursor-pointer w-full max-w-[320px] mx-auto">
      <span className="absolute top-3 sm:top-5 left-3 sm:left-5 text-xs font-semibold tracking-wider text-black z-10">
        NEW
      </span>

      <button
        onClick={() => onToggleHeart(product.id)}
        className={`absolute top-3 sm:top-5 right-3 sm:right-5 transition z-10 ${isHearted ? "text-red-600" : "text-gray-400 hover:text-red-600"}`}
      >
        <svg
          fill={isHearted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>

      <Link href={`/product/${product.slug}`} className="w-full px-6 sm:px-10 py-6 sm:py-8">
        <div className="w-full h-[200px] sm:h-[300px] relative">
          <Image
            src={getBestImageUrl(product.images) || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      <h3 className="uppercase font-bold text-base sm:text-lg tracking-wide mb-2 px-2 sm:px-4 text-black">
        {product.title}
      </h3>
      <p className="text-sm text-black mb-4 sm:mb-6">${product.price}</p>

      <button
        onClick={() => {
          const checkoutUrl = new URL("/checkout", window.location.origin)
          checkoutUrl.searchParams.set("product", product.slug)
          checkoutUrl.searchParams.set("quantity", "1")
          window.location.href = checkoutUrl.toString()
        }}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 sm:py-3 rounded-md uppercase font-semibold tracking-wider hover:bg-gray-900 transition text-xs sm:text-sm"
      >
        BUY NOW
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
          />
        </svg>
      </button>
    </div>
  )
})

export default function ProductGrid({ categories, products }: ProductGridProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [heartedIds, setHeartedIds] = useState<Set<number>>(new Set())

  const toggleCategory = useCallback((id: number | "all") => {
    setSelectedCategoryIds((prev) =>
      id === "all" ? [] : prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    )
  }, [])

  const filteredProducts = useMemo(
    () =>
      selectedCategoryIds.length === 0
        ? products
        : categories.filter((cat) => selectedCategoryIds.includes(cat.id)).flatMap((cat) => cat.products || []),
    [categories, selectedCategoryIds, products],
  )

  const getBestImageUrl = useCallback((images?: Product["images"]) => {
    if (!images?.length) return null
    const { formats, url } = images[0]
    const imgUrl = formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || url
    return imgUrl ? (imgUrl.startsWith("http") ? imgUrl : BASE_URL + imgUrl) : null
  }, [])

  const toggleHeart = useCallback((id: number) => {
    setHeartedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => toggleCategory("all")}
              className={`px-4 py-2 rounded-md transition ${selectedCategoryIds.length === 0 ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-md transition ${selectedCategoryIds.includes(category.id) ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
              >
                {category.Name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-black text-center text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20 max-w-[400px] sm:max-w-[700px] mx-auto">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isHearted={heartedIds.has(product.id)}
              onToggleHeart={toggleHeart}
              getBestImageUrl={getBestImageUrl}
            />
          ))}
        </div>
      )}
    </>
  )
}
