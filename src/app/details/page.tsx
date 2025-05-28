'use client';

import { useState, useMemo, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Carousel = lazy(() => import('../components/Carousel'));
const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  images?: { url: string; formats?: Record<string, { url: string }> }[];
}

interface Category {
  id: number;
  Name: string;
  products: Product[];
}

interface Gallery {
  id: number;
  carosel?: GalleryImage[];
}

interface GalleryImage {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
}

interface GalleryApiResponse {
  data: Gallery[];
}

const ProductCard = memo(function ProductCard({ 
  product, 
  isHearted, 
  onToggleHeart, 
  getBestImageUrl 
}: {
  product: Product;
  isHearted: boolean;
  onToggleHeart: (id: number) => void;
  getBestImageUrl: (images?: Product['images']) => string | null;
}) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:border-black cursor-pointer w-full max-w-[320px] mx-auto">
      <span className="absolute top-3 sm:top-5 left-3 sm:left-5 text-xs font-semibold tracking-wider text-black z-10">NEW</span>
      
      <button
        onClick={() => onToggleHeart(product.id)}
        className={`absolute top-3 sm:top-5 right-3 sm:right-5 transition z-10 ${isHearted ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
      >
        <svg fill={isHearted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>

      <Link href={`/product/${product.slug}`} className="w-full px-6 sm:px-10 py-6 sm:py-8">
        <div className="w-full h-[200px] sm:h-[300px] relative">
          <Image
            src={getBestImageUrl(product.images) || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      <h3 className="uppercase font-bold text-base sm:text-lg tracking-wide mb-2 px-2 sm:px-4 text-black">{product.title}</h3>
      <p className="text-sm text-black mb-4 sm:mb-6">${product.price}</p>

      <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 sm:py-3 rounded-md uppercase font-semibold tracking-wider hover:bg-gray-900 transition text-xs sm:text-sm">
        BUY NOW
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
        </svg>
      </button>
    </div>
  );
});

const BannerSkeleton = memo(function BannerSkeleton() {
  return <div className="w-full aspect-[5/2] sm:aspect-[8/3] md:aspect-[12/4] bg-gray-200 animate-pulse" />;
});

const SectionSkeleton = memo(function SectionSkeleton() {
  return (
    <section className="bg-black py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto text-center space-y-3">
        <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-700 rounded animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 sm:h-5 bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    </section>
  );
});

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl w-full max-w-[320px] mx-auto animate-pulse">
      <div className="px-6 sm:px-10 py-6 sm:py-8">
        <div className="w-full h-[200px] sm:h-[300px] bg-gray-200 rounded" />
      </div>
      <div className="space-y-2 px-4 pb-4">
        <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto" />
        <div className="w-1/4 h-4 bg-gray-200 rounded mx-auto" />
        <div className="w-full h-10 sm:h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
});

const LoadingSkeleton = memo(function LoadingSkeleton({ type }: { type: 'banner' | 'product' | 'section' }) {
  if (type === 'banner') return <BannerSkeleton />;
  if (type === 'section') return <SectionSkeleton />;
  return <ProductSkeleton />;
});

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [heartedIds, setHeartedIds] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [categoriesRes, galleryRes] = await Promise.all([
        fetch(`${BASE_URL}/api/catagories?populate[products][populate]=images`),
        fetch(`${BASE_URL}/api/galleries/?populate=*`)
      ]);

      if (!categoriesRes.ok) throw new Error(`Categories API error! status: ${categoriesRes.status}`);
      
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.data || []);

      if (galleryRes.ok) {
        const galleryData: GalleryApiResponse = await galleryRes.json();
        const avifImage = galleryData.data
          ?.flatMap((gallery: Gallery) => gallery.carosel || [])
          ?.find((img: GalleryImage) => img.url?.includes('gav01_1920x612_1_8a973f6ebb.avif'));
        
        if (avifImage) {
          setBannerImage(avifImage.url.startsWith('http') ? avifImage.url : BASE_URL + avifImage.url);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const toggleCategory = useCallback((id: number | 'all') => {
    setSelectedCategoryIds(prev => 
      id === 'all' ? [] : prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  }, []);

  const allProducts = useMemo(() => categories.flatMap(cat => cat.products || []), [categories]);
  
  const filteredProducts = useMemo(() => 
    selectedCategoryIds.length === 0 ? allProducts : 
    categories.filter(cat => selectedCategoryIds.includes(cat.id)).flatMap(cat => cat.products || [])
  , [categories, selectedCategoryIds, allProducts]);

  const getBestImageUrl = useCallback((images?: Product['images']) => {
    if (!images?.length) return null;
    const { formats, url } = images[0];
    const imgUrl = formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || url;
    return imgUrl ? (imgUrl.startsWith('http') ? imgUrl : BASE_URL + imgUrl) : null;
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

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSkeleton type="banner" />
        <LoadingSkeleton type="section" />
        <main className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 min-h-screen max-w-[1400px] mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">L I N E U P</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20 max-w-[400px] sm:max-w-[700px] mx-auto">
            {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} type="product" />)}
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
            <button onClick={fetchData} className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition">
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
      
      {bannerImage && (
        <div className="w-full aspect-[5/2] sm:aspect-[8/3] md:aspect-[12/4] relative overflow-hidden">
          <Image src={bannerImage} alt="Banner" fill className="object-cover" priority />
        </div>
      )}
      
      <section className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10">
            Redefining toughness with a strikingly original design
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-300 max-w-5xl mx-auto">
            Everyone counts on G-SHOCK for unceasing evolution. But check out this comprehensive new reinterpretation, 
            representing a whole new approach to construction and design that powerfully conveys the brand&apos;s unwavering 
            commitment to toughness.
          </p>
        </div>
      </section>
      
      <main className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 min-h-screen max-w-[1400px] mx-auto">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">L I N E U P</h2>
        </div>

        {categories.length > 1 && (
          <div className="mb-8 text-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <button
                onClick={() => toggleCategory('all')}
                className={`px-4 py-2 rounded-md transition ${selectedCategoryIds.length === 0 ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-md transition ${selectedCategoryIds.includes(category.id) ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
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

        <section className="mt-16 sm:mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black mb-6 sm:mb-8">G A L L E R Y</h2>
          <Suspense fallback={<div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center"><span className="text-gray-400">Loading gallery...</span></div>}>
            <Carousel />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}