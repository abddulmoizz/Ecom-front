'use client';

import { useState, useMemo, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Lazy load the Carousel component
const Carousel = lazy(() => import('../components/Carousel'));

const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

interface DescriptionNode {
  type: string;
  children: { text: string }[];
}

interface ImageFormat {
  url: string;
}

interface ProductImage {
  url: string;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  Description: DescriptionNode[];
  images?: ProductImage[];
}

interface Category {
  id: number;
  Name: string;
  slug: string;
  products: Product[];
}

// Memoized ProductCard component for better rendering performance
const ProductCard = memo(function ProductCard({
  product,
  isHearted,
  onToggleHeart,
  getBestImageUrl,
}: {
  product: Product;
  isHearted: boolean;
  onToggleHeart: (id: number) => void;
  getBestImageUrl: (images?: ProductImage[]) => string | null;
}) {
  const imageUrl = getBestImageUrl(product.images);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center select-none transition-all duration-300 hover:border-black cursor-pointer w-full max-w-[320px] mx-auto">
      <span className="absolute top-3 sm:top-5 left-3 sm:left-5 text-xs font-semibold tracking-wider text-black z-10">
        NEW
      </span>

      <button
        aria-label="Add to wishlist"
        onClick={() => onToggleHeart(product.id)}
        className={`absolute top-3 sm:top-5 right-3 sm:right-5 transition z-10 ${
          isHearted ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
        }`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isHearted ? 'currentColor' : 'none'}
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

      <Link href={`/product/${product.slug}`} className="w-full px-6 sm:px-10 py-6 sm:py-8 relative" prefetch={false}>
        <div className="w-full h-[200px] sm:h-[300px] relative">
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 320px"
            loading="lazy"
            onError={(e) => {
              // Fallback to regular img if Next.js Image fails
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.png';
            }}
          />
        </div>
      </Link>

      <h3 className="uppercase font-bold text-base sm:text-lg tracking-wide mb-2 px-2 sm:px-4 text-black leading-tight">
        {product.title}
      </h3>

      <p className="text-sm text-black mb-4 sm:mb-6">${product.price}</p>

      <button 
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 sm:py-3 rounded-md uppercase font-semibold tracking-wider hover:bg-gray-900 transition text-xs sm:text-sm"
        onClick={(e) => {
          e.preventDefault();
          // Add to cart functionality here
        }}
      >
        BUY NOW
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-4 h-4 sm:w-5 sm:h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
          />
        </svg>
      </button>
    </div>
  );
});

// Loading skeleton component
const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center w-full max-w-[320px] mx-auto animate-pulse">
      <div className="w-full px-6 sm:px-10 py-6 sm:py-8">
        <div className="w-full h-[200px] sm:h-[300px] bg-gray-200 rounded"></div>
      </div>
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-1/4 h-4 bg-gray-200 rounded mb-4 sm:mb-6"></div>
      <div className="w-full h-10 sm:h-12 bg-gray-200 rounded"></div>
    </div>
  );
});

// Carousel loading fallback
const CarouselSkeleton = memo(function CarouselSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading gallery...</span>
    </div>
  );
});

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [heartedIds, setHeartedIds] = useState<Set<number>>(new Set());

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(
        `${BASE_URL}/api/catagories?populate[products][populate]=images`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleCategory = useCallback((id: number | 'all') => {
    if (id === 'all') {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(prev =>
        prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
      );
    }
  }, []);

  const allProducts = useMemo(() => {
    return categories.flatMap(cat => cat.products || []);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryIds.length === 0) return allProducts;
    return categories
      .filter(cat => selectedCategoryIds.includes(cat.id))
      .flatMap(cat => cat.products || []);
  }, [categories, selectedCategoryIds, allProducts]);

  const getBestImageUrl = useCallback((images?: ProductImage[]) => {
    if (!images || images.length === 0) return null;
    const image = images[0];
    const url =
      image.formats?.medium?.url ||
      image.formats?.small?.url ||
      image.formats?.thumbnail?.url ||
      image.url;

    if (!url) return null;
    return url.startsWith('http') ? url : BASE_URL + url;
  }, []);

  const toggleHeart = useCallback((id: number) => {
    setHeartedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Retry function for error state
  const handleRetry = useCallback(() => {
    setLoading(true);
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 min-h-screen max-w-[1400px] mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">L I N E U P</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20 justify-center max-w-[400px] sm:max-w-[700px] mx-auto px-4 sm:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="bg-white px-6 md:px-12 lg:px-20 py-12 min-h-screen max-w-[1400px] mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 min-h-screen max-w-[1400px] mx-auto">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">L I N E U P</h2>
        </div>

        {/* Category Filter Section - Only show if toggleCategory is needed */}
        {categories.length > 1 && (
          <div className="mb-8 text-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <button
                onClick={() => toggleCategory('all')}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategoryIds.length === 0
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-md transition ${
                    selectedCategoryIds.includes(category.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20 justify-center max-w-[400px] sm:max-w-[700px] mx-auto px-4 sm:px-0">
            {filteredProducts.map(product => (
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

        {/* GALLERY SECTION */}
        <section className="mt-16 sm:mt-20 text-center px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black mb-6 sm:mb-8">G A L L E R Y</h2>
          <Suspense fallback={<CarouselSkeleton />}>
            <Carousel />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}