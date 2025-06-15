"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import Image from "next/image"

interface CarouselImage {
  id: number
  url: string
  name?: string
  alternativeText?: string
  caption?: string
}

interface ServerCarouselProps {
  images: CarouselImage[]
}

export default function ServerCarousel({ images }: ServerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return

    const distance = touchStartX.current - touchEndX.current
    const threshold = 50

    if (distance > threshold) {
      handleNext()
    } else if (distance < -threshold) {
      handlePrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (images.length === 0) {
    return <div className="text-center py-20 text-gray-500">No images found.</div>
  }

  return (
    <div className="max-w-lg mx-auto select-none relative">
      <div
        className="relative rounded-lg shadow-lg overflow-hidden h-96"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, idx) => (
          <Image
            key={img.id}
            src={img.url || "/placeholder.svg"}
            alt={img.alternativeText || img.name || `Carousel image ${idx + 1}`}
            fill
            style={{ objectFit: "contain" }}
            className={`transition-opacity duration-500 ease-in-out absolute inset-0 ${
              idx === currentIndex ? "opacity-100 relative" : "opacity-0 pointer-events-none"
            }`}
            priority={idx === currentIndex}
          />
        ))}

        <button
          onClick={handlePrev}
          aria-label="Previous Image"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-md focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Image"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-md focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center space-x-3 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? "bg-gray-800" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  )
}
