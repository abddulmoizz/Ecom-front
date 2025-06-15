import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProductDetailClient from "../../components/ProductDetailClient"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Product {
  id: number
  documentId: string
  slug: string
  title: string
  price: string
  Description: { type: string; children: { text: string }[] }[]
  images: {
    id: number
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }[]
  catagory?: { id: number; Name: string; slug: string }
  size: { id: number; size: string }[]
  seoMeta?: {
    metaTitle: string
    metaDescription: { type: string; children: { text: string }[] }[]
    keywords: string
    openGraphTitle: string
    openGraphDescription: string
  }
  series?: string
  isNew?: boolean
  releaseDate?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error("Network response was not ok")

    const { data } = await res.json()
    const matched = data.find((p: Product) => p.slug === slug)

    if (matched) {
      return matched as Product
    }

    return null
  } catch (err) {
    console.error("Error loading product:", err)
    return null
  }
}

async function getAllProducts(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []

    const { data } = await res.json()
    return data.map((p: Product) => p.slug || `product-${p.id}`)
  } catch (error) {
    console.error("Error fetching products for static generation:", error)
    return []
  }
}

// Generate static params for all products
export async function generateStaticParams() {
  const slugs = await getAllProducts()

  return slugs.map((slug) => ({
    slug: slug,
  }))
}

// Generate metadata for each product
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url.startsWith("http")
        ? product.images[0].url
        : `${BASE_URL}${product.images[0].url}`
      : null;

  // Create a more comprehensive description from the structured Description field
  const description = product.Description
    ?.map((block) => block.children?.map((child) => child.text).join(" "))
    .join(" ")
    .slice(0, 160) || `${product.title} - Premium G-SHOCK timepiece`;

  return {
    title: `${product.title} - G-SHOCK`,
    description: description,
    openGraph: {
      title: `${product.title} - G-SHOCK`,
      description: `${product.title} - Premium G-SHOCK timepiece for ${product.price}`,
      images: imageUrl ? [imageUrl] : [],
      type: "website",
    },
    other: {
      "product:price:amount": product.price,
      "product:price:currency": "USD",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.Description?.map((block) => 
      block.children?.map((child) => child.text).join(" ")
    ).join(" ") || product.title,
    image: product.images?.map((img) => 
      img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`
    ) || [],
    brand: {
      "@type": "Brand",
      name: "G-SHOCK",
    },
    category: product.catagory?.Name,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/product/${product.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Header />
      <main className="bg-white text-gray-900 px-4 sm:px-6 md:px-10 py-6 min-h-[80vh]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              {product.catagory && (
                <>
                  <li>
                    <span className="hover:text-gray-700">{product.catagory.Name}</span>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-gray-900 font-medium">{product.title}</li>
            </ol>
          </nav>

          <ProductDetailClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  )
}