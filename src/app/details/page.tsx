import Image from "next/image"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductGrid from "../components/ProductGrid"
import ServerCarousel from "../components/ServerCarousel"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface Product {
  id: number
  slug: string
  title: string
  price: string
  images?: { url: string; formats?: Record<string, { url: string }> }[]
}

interface Category {
  id: number
  Name: string
  products: Product[]
}

interface Gallery {
  id: number
  carosel?: GalleryImage[]
}

interface GalleryImage {
  id: number
  url: string
  alternativeText?: string
  caption?: string
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/catagories?populate[products][populate]=images`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Categories API error! status: ${res.status}`)

    const categoriesData = await res.json()
    return categoriesData.data || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

async function getBannerImage(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/galleries/?populate=*`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const galleryData = await res.json()
    const avifImage = galleryData.data
      ?.flatMap((gallery: Gallery) => gallery.carosel || [])
      ?.find((img: GalleryImage) => img.url?.includes("gav01_1920x612_1_8a973f6ebb.avif"))

    if (avifImage) {
      return avifImage.url.startsWith("http") ? avifImage.url : BASE_URL + avifImage.url
    }

    return null
  } catch (error) {
    console.error("Failed to fetch banner:", error)
    return null
  }
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/galleries/?populate=*`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []

    const data = await res.json()
    return (
      data.data?.[0]?.carosel?.map((img: any) => ({
        id: img.id,
        url: img.url.startsWith("http") ? img.url : BASE_URL + img.url,
        name: img.name,
        alternativeText: img.alternativeText,
        caption: img.caption,
      })) || []
    )
  } catch (error) {
    console.error("Failed to fetch gallery images:", error)
    return []
  }
}

export default async function HomePage() {
  const [categories, bannerImage, galleryImages] = await Promise.all([
    getCategories(),
    getBannerImage(),
    getGalleryImages(),
  ])

  const allProducts = categories.flatMap((cat) => cat.products || [])

  return (
    <>
      <Header />

      {bannerImage && (
        <div className="w-full aspect-[5/2] sm:aspect-[8/3] md:aspect-[12/4] relative overflow-hidden">
          <Image src={bannerImage || "/placeholder.svg"} alt="Banner" fill className="object-cover" priority />
        </div>
      )}

      <section className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10">
            Redefining toughness with a strikingly original design
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-300 max-w-5xl mx-auto">
            Everyone counts on G-SHOCK for unceasing evolution. But check out this comprehensive new reinterpretation,
            representing a whole new approach to construction and design that powerfully conveys the brand&apos;s
            unwavering commitment to toughness.
          </p>
        </div>
      </section>

      <main className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 min-h-screen max-w-[1400px] mx-auto">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">L I N E U P</h2>
        </div>

        <ProductGrid categories={categories} products={allProducts} />

        <section className="mt-16 sm:mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-black mb-6 sm:mb-8">G A L L E R Y</h2>
          <ServerCarousel images={galleryImages} />
        </section>
      </main>
      <Footer />
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "G-SHOCK Details - Lineup & Gallery",
    description: "Explore the complete G-SHOCK lineup and gallery featuring the latest timepieces and collections.",
    openGraph: {
      title: "G-SHOCK Details - Lineup & Gallery",
      description: "Explore the complete G-SHOCK lineup and gallery featuring the latest timepieces and collections.",
    },
  }
}
