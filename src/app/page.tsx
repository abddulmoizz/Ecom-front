'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';

const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  images: { url: string; formats?: Record<string, { url: string }> }[];
}

interface ApiProduct {
  id: number;
  slug?: string;
  title?: string;
  price?: string;
  images?: { url: string; formats?: Record<string, { url: string }> }[];
}

interface ApiResponse {
  data: ApiProduct[];
}

const Skeleton = ({ className }: { className: string }) => (
  <div className={`${className} bg-gray-200 animate-pulse rounded`} />
);

const ProductCard = ({ product, getBestImageUrl }: { product: Product; getBestImageUrl: (images: Product['images']) => string | null }) => {
  const imageUrl = getBestImageUrl(product.images);
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0 w-64 sm:w-72 lg:w-80">
      <div className="p-4 sm:p-6">
        <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6 bg-gray-100 rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.title} fill className="object-contain" loading="lazy" />
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
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4">
            ${product.price}
          </p>
          
          <Link
            href={`/product/${product.slug}`}
            className="w-full bg-black text-white text-center py-2.5 sm:py-3 lg:py-3.5 rounded-sm hover:bg-gray-800 transition-colors uppercase text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2"
          >
            BUY NOW
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function CasioLandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${BASE_URL}/api/products?populate=*`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const json: ApiResponse = await res.json();
      const data = json.data || [];

      setProducts(data.map((p: ApiProduct) => ({
        id: p.id,
        slug: p.slug || `product-${p.id}`,
        title: p.title || 'Untitled Product',
        price: p.price || '0.00',
        images: p.images || [],
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const getBestImageUrl = useCallback((images: Product['images'] = []) => {
    if (!images.length) return null;
    const image = images[0];
    const formatUrl = image.formats?.medium?.url || image.formats?.small?.url || image.formats?.thumbnail?.url || image.url;
    return formatUrl.startsWith('http') ? formatUrl : BASE_URL + formatUrl;
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const handleScroll = () => {
    if (scrollRef.current) setScrollPosition(scrollRef.current.scrollLeft);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollRef.current 
    ? scrollPosition < (scrollRef.current.scrollWidth - scrollRef.current.clientWidth)
    : true;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        {!heroLoaded && <Skeleton className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]" />}
        <div className={`relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden ${!heroLoaded ? 'hidden' : ''}`}>
          <Image
            src="https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"
            alt="G-SHOCK GAV01 Collection"
            fill
            className="object-cover object-center"
            priority
            onLoadingComplete={() => setHeroLoaded(true)}
            onError={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full pb-4 sm:pb-6 lg:pb-8">
              <div className="text-left max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-wider drop-shadow-lg">
                  GAV01
                </h1>
                <div className="mt-2 sm:mt-3 lg:mt-4">
                  <Link
                    href="/details"
                    className="inline-block border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    LEARN MORE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="py-8 sm:py-10 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-8 sm:mb-10 lg:mb-12">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  Recommended for You
                </h2>
              </div>
              
              <div className="hidden sm:flex gap-2 absolute right-0 top-1/2 transform -translate-y-1/2">
                {['left', 'right'].map(dir => (
                  <button
                    key={dir}
                    onClick={() => scroll(dir as 'left' | 'right')}
                    disabled={dir === 'left' ? !canScrollLeft : !canScrollRight}
                    className={`p-2 lg:p-3 rounded-full border-2 transition-all duration-200 ${
                      (dir === 'left' ? !canScrollLeft : !canScrollRight)
                        ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
                        : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d={dir === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 sm:gap-6 pb-4 px-2 sm:px-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm flex-shrink-0 w-64 sm:w-72 lg:w-80 animate-pulse">
                      <div className="p-4 sm:p-6">
                        <Skeleton className="w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6" />
                        <div className="text-center space-y-2">
                          <Skeleton className="h-3 w-16 mx-auto" />
                          <Skeleton className="h-5 w-32 mx-auto" />
                          <Skeleton className="h-6 w-20 mx-auto" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="overflow-x-auto scrollbar-hide"
              >
                <div className="flex gap-4 sm:gap-6 pb-4 px-2 sm:px-4" style={{ width: 'max-content' }}>
                  {products.length === 0 ? (
                    <p className="text-center text-gray-500 w-full">No products found.</p>
                  ) : (
                    products.map(product => (
                      <ProductCard key={product.id} product={product} getBestImageUrl={getBestImageUrl} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}