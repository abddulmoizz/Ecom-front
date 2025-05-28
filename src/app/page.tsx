'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';

const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

interface ProductImage {
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  images: ProductImage[];
}

// Skeleton Loader Components
const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm flex-shrink-0 w-64 sm:w-72 lg:w-80 animate-pulse">
    <div className="p-4 sm:p-6">
      <div className="w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6 bg-gray-200 rounded-lg"></div>
      <div className="text-center">
        <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const HeroSkeleton = () => (
  <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] bg-gray-200 animate-pulse">
    <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8">
      <div className="h-8 sm:h-12 lg:h-16 bg-gray-300 rounded w-32 sm:w-48 mb-4"></div>
      <div className="h-8 sm:h-10 bg-gray-300 rounded w-24 sm:w-32"></div>
    </div>
  </div>
);

// Error Fallback Component
const ImageFallback = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span className="text-xs text-center px-2">{title}</span>
  </div>
);

const CasioLandingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${BASE_URL}/api/products?populate=*`);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const json = await res.json();
      const data = json.data || [];

      const products = data.map((p: any) => ({
        id: p.id,
        slug: p.slug || `product-${p.id}`,
        title: p.title || 'Untitled Product',
        price: p.price || '0.00',
        images: p.images || [],
      }));

      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getBestImageUrl = useCallback((images: ProductImage[] = []) => {
    if (images.length === 0) return null;
    const image = images[0];
    const formatUrl = image.formats?.medium?.url || image.formats?.small?.url || image.formats?.thumbnail?.url || image.url;
    return formatUrl.startsWith('http') ? formatUrl : BASE_URL + formatUrl;
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = window.innerWidth < 768 ? 280 : 288;
    const gap = window.innerWidth < 768 ? 16 : 24;
    const scrollAmount = (cardWidth + gap) * (window.innerWidth < 768 ? 1 : 2);
    
    container.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)
    : true;

  const NavButton = ({ direction, disabled }: { direction: 'left' | 'right', disabled: boolean }) => (
    <button
      onClick={() => scroll(direction)}
      disabled={disabled}
      className={`p-2 lg:p-3 rounded-full border-2 transition-all duration-200 ${
        disabled 
          ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
          : 'border-black text-black hover:bg-black hover:text-white'
      }`}
    >
      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        {!heroLoaded && <HeroSkeleton />}
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
              
              {/* Desktop Navigation */}
              <div className="hidden sm:flex gap-2 absolute right-0 top-1/2 transform -translate-y-1/2">
                <NavButton direction="left" disabled={!canScrollLeft} />
                <NavButton direction="right" disabled={!canScrollRight} />
              </div>
            </div>

            {/* Error State */}
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

            {/* Loading State */}
            {loading && !error && (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 sm:gap-6 pb-4 px-2 sm:px-4">
                  {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              </div>
            )}

            {/* Products */}
            {!loading && !error && (
              <>
                {/* Mobile Navigation */}
                <div className="flex sm:hidden justify-center gap-4 mb-6">
                  <NavButton direction="left" disabled={!canScrollLeft} />
                  <NavButton direction="right" disabled={!canScrollRight} />
                </div>

                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="overflow-x-auto scrollbar-hide"
                >
                  <div className="flex gap-4 sm:gap-6 pb-4 px-2 sm:px-4" style={{ width: 'max-content' }}>
                    {products.length === 0 ? (
                      <p className="text-center text-gray-500 w-full">No products found.</p>
                    ) : (
                      products.map((product) => {
                        const imageUrl = getBestImageUrl(product.images);
                        
                        return (
                          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0 w-64 sm:w-72 lg:w-80">
                            <div className="p-4 sm:p-6">
                              <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6 bg-gray-100 rounded-lg overflow-hidden">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`absolute inset-0 ${imageUrl ? 'hidden' : ''}`}>
                                  <ImageFallback title={product.title} />
                                </div>
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
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        @media (max-width: 640px) {
          .scrollbar-hide { scroll-snap-type: x mandatory; }
          .scrollbar-hide > div > div { scroll-snap-align: start; }
        }
      `}</style>
    </div>
  );
};

export default CasioLandingPage;