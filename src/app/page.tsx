import Image from "next/image"
import Header from "./components/Header"
import ProductCarousel from "./components/ProductCarousel"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Product {
  id: number
  slug: string
  title: string
  price: string
  images: { url: string; formats?: Record<string, { url: string }> }[]
}

interface ApiProduct {
  id: number
  slug?: string
  title?: string
  price?: string
  images?: { url: string; formats?: Record<string, { url: string }> }[]
}

interface ApiResponse {
  data: ApiProduct[]
}

// Server-side data fetching
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const json: ApiResponse = await res.json()
    const data = json.data || []

    return data.map((p: ApiProduct) => ({
      id: p.id,
      slug: p.slug || `product-${p.id}`,
      title: p.title || "Untitled Product",
      price: p.price || "0.00",
      images: p.images || [],
    }))
  } catch (error) {
    console.error("Error fetching products from API, using mock data:", error)

    // Provide mock data when API fails
    return [
      {
        id: 1,
        slug: "GAV01A-8A-Silver",
        title: "GAV01A-8A Silver G-SHOCK",
        price: "299.99",
        images: [
          {
            url: "/placeholder.svg?height=400&width=400",
            formats: {
              thumbnail: { url: "/placeholder.svg?height=150&width=150" },
              small: { url: "/placeholder.svg?height=250&width=250" },
              medium: { url: "/placeholder.svg?height=400&width=400" },
            },
          },
        ],
      },
      {
        id: 2,
        slug: "GAV01B-1A-Black",
        title: "GAV01B-1A Black G-SHOCK",
        price: "279.99",
        images: [
          {
            url: "/placeholder.svg?height=400&width=400",
            formats: {
              thumbnail: { url: "/placeholder.svg?height=150&width=150" },
              small: { url: "/placeholder.svg?height=250&width=250" },
              medium: { url: "/placeholder.svg?height=400&width=400" },
            },
          },
        ],
      },
      {
        id: 3,
        slug: "GAV01C-3A-Gold",
        title: "GAV01C-3A Gold G-SHOCK",
        price: "349.99",
        images: [
          {
            url: "/placeholder.svg?height=400&width=400",
            formats: {
              thumbnail: { url: "/placeholder.svg?height=150&width=150" },
              small: { url: "/placeholder.svg?height=250&width=250" },
              medium: { url: "/placeholder.svg?height=400&width=400" },
            },
          },
        ],
      },
      {
        id: 4,
        slug: "GAV01D-2A-Blue",
        title: "GAV01D-2A Blue G-SHOCK",
        price: "289.99",
        images: [
          {
            url: "/placeholder.svg?height=400&width=400",
            formats: {
              thumbnail: { url: "/placeholder.svg?height=150&width=150" },
              small: { url: "/placeholder.svg?height=250&width=250" },
              medium: { url: "/placeholder.svg?height=400&width=400" },
            },
          },
        ],
      },
    ]
  }
}

// Server Component - runs on server
export default async function CasioLandingPage() {
  const products = await getProducts() // Server-side fetch

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
          <Image
            src="https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"
            alt="G-SHOCK GAV01 Collection"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

          <div className="absolute inset-0 flex items-end">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full pb-4 sm:pb-6 lg:pb-8">
              <div className="text-left max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-wider drop-shadow-lg">
                  GAV01
                </h1>
                <div className="mt-2 sm:mt-3 lg:mt-4">
                  <a
                    href="/details"
                    className="inline-block border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    LEARN MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="py-8 sm:py-10 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">Recommended for You</h2>
            </div>

            {/* Client Component for interactive carousel */}
            <ProductCarousel products={products} />
          </div>
        </section>
      </main>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "G-SHOCK - Premium Timepieces | Official Store",
    description:
      "Discover the complete G-SHOCK collection featuring rugged durability, innovative design, and cutting-edge technology. Shop premium timepieces built to last.",
    openGraph: {
      title: "G-SHOCK - Premium Timepieces | Official Store",
      description:
        "Discover the complete G-SHOCK collection featuring rugged durability, innovative design, and cutting-edge technology.",
      images: ["https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"],
      type: "website",
    },
  }
}
