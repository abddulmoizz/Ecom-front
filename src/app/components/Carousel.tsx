'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

interface CarouselImage {
  id: number;
  url: string;
  name: string;
}

interface RawImage {
  id: number;
  url: string;
  name: string;
}

export default function EcommerceCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${BASE_URL}/api/galleries/?populate=*`);
        const data = await res.json();
        const imgs: CarouselImage[] =
          data.data?.[0]?.carosel?.map((img: RawImage) => ({
            id: img.id,
            url: img.url.startsWith('http') ? img.url : BASE_URL + img.url,
            name: img.name,
          })) || [];
        setImages(imgs);
      } catch (error) {
        console.error('Failed to fetch images', error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0) return;
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, images.length, resetTimer]);

  function handlePrev() {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetTimer();
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetTimer();
  }

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (images.length === 0) return <div className="text-center py-20">No images found.</div>;

  return (
    <div className="max-w-lg mx-auto select-none relative">
      {/* Image container with fixed height */}
      <div className="relative rounded-lg shadow-lg overflow-hidden h-96">
        {images.map((img, idx) => (
          <Image
            key={img.id}
            src={img.url}
            alt={img.name || `Carousel image ${idx + 1}`}
            fill
            style={{ objectFit: 'contain' }}
            className={`transition-opacity duration-500 ease-in-out absolute inset-0 ${
              idx === currentIndex ? 'opacity-100 relative' : 'opacity-0 pointer-events-none'
            }`}
            priority={idx === currentIndex}
          />
        ))}

        {/* Left Arrow */}
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

        {/* Right Arrow */}
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

      {/* Dots Navigation */}
      <div className="flex justify-center space-x-3 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              resetTimer();
            }}
            aria-label={`Go to image ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
