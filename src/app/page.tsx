import Link from "next/link"
import Image from "next/image"
import Header from "./components/Header"
import ProductCarousel from "./components/ProductCarousel"

const BASE_URL = "https://inspired-sunshine-587c5c91b5.strapiapp.com"

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
    console.error("Error fetching products:", error)
    return []
  }
}

async function getBannerImage(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/galleries/?populate=*`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const data = await res.json()
    const avifImage = data.data
      ?.flatMap((gallery: any) => gallery.carosel || [])
      ?.find((img: any) => img.url?.includes("gav01_1920x612_1_8a973f6ebb.avif"))

    if (avifImage) {
      return avifImage.url.startsWith("http") ? avifImage.url : BASE_URL + avifImage.url
    }

    return "https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"
  } catch (error) {
    console.error("Error fetching banner:", error)
    return "https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"
  }
}

export default async function CasioLandingPage() {
  const [products, bannerImage] = await Promise.all([getProducts(), getBannerImage()])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
          <Image
            src={bannerImage || "/placeholder.svg"}
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">Recommended for You</h2>
              </div>
            </div>

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
    title: "G-SHOCK - Redefining Toughness",
    description: "Discover the latest G-SHOCK collection featuring the GAV01 and other iconic timepieces.",
    openGraph: {
      title: "G-SHOCK - Redefining Toughness",
      description: "Discover the latest G-SHOCK collection featuring the GAV01 and other iconic timepieces.",
      images: ["https://inspired-sunshine-587c5c91b5.media.strapiapp.com/gav01_1920x612_1_8a973f6ebb.avif"],
    },
  }
}
