// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// const BASE_URL = 'https://inspired-sunshine-587c5c91b5.strapiapp.com';

// interface Size {
//   id: number;
//   size: string;
// }

// interface Category {
//   id: number;
//   Name: string;
// }

// interface Product {
//   id: number;
//   slug: string;
//   title: string;
//   price: string;
//   Description: { type: string; children: { text: string }[] }[];
//   catagory: { id: number; Name: string };
//   images: {
//     url: string;
//     formats: {
//       thumbnail?: { url: string };
//       small?: { url: string };
//       medium?: { url: string };
//       large?: { url: string };
//     };
//   };
//   size: Size[];
// }

// export default function HomePage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const catRes = await fetch(`${BASE_URL}/api/catagories?populate=products`);
//         const catData = await catRes.json();
//         setCategories(catData.data);

//         const prodRes = await fetch(
//           `${BASE_URL}/api/products?populate[images][fields][0]=url&populate[catagory][fields][0]=Name&populate[size]=true`
//         );
//         const prodData = await prodRes.json();
//         setProducts(prodData.data);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   const toggleCategory = (id: number | 'all') => {
//     if (id === 'all') {
//       setSelectedCategoryIds([]);
//     } else {
//       setSelectedCategoryIds(prev =>
//         prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
//       );
//     }
//   };

//   const getBestImageUrl = (image: Product['images']) => {
//     const { formats, url } = image;
//     return BASE_URL + (
//       formats?.medium?.url ||
//       formats?.small?.url ||
//       formats?.thumbnail?.url ||
//       url
//     );
//   };

//   const getShortDescription = (description: Product['Description']) => {
//     const text = description?.[0]?.children?.[0]?.text || '';
//     return text.split(' ').slice(0, 18).join(' ') + (text.split(' ').length > 18 ? '...' : '');
//   };

//   const filteredProducts = useMemo(() => {
//     if (selectedCategoryIds.length === 0) return products;
//     return products.filter(product =>
//       selectedCategoryIds.includes(product.catagory?.id)
//     );
//   }, [products, selectedCategoryIds]);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 text-xl py-20">Loading products...</div>
//     );
//   }

//   return (
//     <div className="bg-white text-gray-800 px-4 sm:px-6 md:px-10 py-10 min-h-screen">
//       {/* Header + Category Pills Filter */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => toggleCategory('all')}
//             className={`px-4 py-1.5 rounded-full border text-sm transition ${
//               selectedCategoryIds.length === 0
//                 ? 'bg-blue-600 text-white border-blue-600'
//                 : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
//             }`}
//           >
//             All
//           </button>

//           {categories.map(cat => (
//             <button
//               key={cat.id}
//               onClick={() => toggleCategory(cat.id)}
//               className={`px-4 py-1.5 rounded-full border text-sm transition ${
//                 selectedCategoryIds.includes(cat.id)
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               {cat.Name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Product List (Vertical) */}
//       {filteredProducts.length === 0 ? (
//         <p className="text-gray-500">No products found in this category.</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {filteredProducts.map(product => (
//             <Link
//               href={`/product/${product.slug}`}
//               key={product.id}
//               className="group flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
//             >
//               {/* Image */}
//               <div className="sm:w-56 w-full h-64 sm:h-auto bg-gray-100 relative">
//                 <Image
//                   src={getBestImageUrl(product.images)}
//                   alt={product.title}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-l-2xl sm:rounded-none"
//                   loading="lazy"
//                   unoptimized
//                 />
//               </div>

//               {/* Content */}
//               <div className="flex flex-col justify-between p-4 sm:p-6 w-full gap-2">
//                 <div className="flex justify-between items-start">
//                   <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
//                   <span className="text-base font-semibold text-blue-600 whitespace-nowrap">
//                     Rs. {product.price}
//                   </span>
//                 </div>

//                 {product.Description?.length > 0 && (
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">
//                     {getShortDescription(product.Description)}
//                   </p>
//                 )}

//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                   <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                     {product.catagory?.Name}
//                   </span>
//                   {product.size.length > 0 && (
//                     <span className="text-xs text-gray-400 italic">
//                       Sizes: {product.size.map(s => s.size).join(', ')}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





//2



'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/catagories?populate[products][populate]=images`
        );
        const json = await res.json();
        setCategories(json.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const toggleCategory = (id: number | 'all') => {
    if (id === 'all') {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(prev =>
        prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
      );
    }
  };

  // Flatten all products from all categories for 'All' option
  const allProducts = useMemo(() => {
    return categories.flatMap(cat => cat.products);
  }, [categories]);

  // Filtered products based on selected categories
  const filteredProducts = useMemo(() => {
    if (selectedCategoryIds.length === 0) return allProducts;
    return categories
      .filter(cat => selectedCategoryIds.includes(cat.id))
      .flatMap(cat => cat.products);
  }, [categories, selectedCategoryIds, allProducts]);

  const getShortDescription = (description: DescriptionNode[]) => {
    const text = description?.[0]?.children?.[0]?.text || '';
    return text.split(' ').slice(0, 18).join(' ') + (text.split(' ').length > 18 ? '...' : '');
  };

  const getBestImageUrl = (images?: ProductImage[]) => {
    if (!images || images.length === 0) return null;
    const image = images[0];
    return (
      BASE_URL +
      (image.formats?.medium?.url ||
        image.formats?.small?.url ||
        image.formats?.thumbnail?.url ||
        image.url)
    );
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl py-20">Loading products...</div>;
  }

  return (
    <div className="bg-white text-gray-800 px-4 sm:px-6 md:px-10 py-10 min-h-screen">
      {/* Header + Category Pills Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleCategory('all')}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              selectedCategoryIds.length === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            All
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full border text-sm transition ${
                selectedCategoryIds.includes(cat.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat.Name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredProducts.map(product => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="group flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
            >
              {/* Product Image */}
              {product.images && product.images.length > 0 ? (
                <div className="sm:w-56 w-full h-64 sm:h-auto bg-gray-100 relative">
                  <Image
                    src={getBestImageUrl(product.images) || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-l-2xl sm:rounded-none"
                    loading="lazy"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="sm:w-56 w-full h-64 sm:h-auto bg-gray-100 flex items-center justify-center rounded-l-2xl sm:rounded-none">
                  <span className="text-gray-400 italic">No image available</span>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col justify-between p-4 sm:p-6 w-full gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
                  <span className="text-base font-semibold text-blue-600 whitespace-nowrap">
                    Rs. {product.price}
                  </span>
                </div>

                {product.Description?.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                    {getShortDescription(product.Description)}
                  </p>
                )}

                <div className="mt-4">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Category: {categories.find(cat => cat.products.some(p => p.id === product.id))?.Name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
