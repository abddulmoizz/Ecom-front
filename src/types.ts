export interface Product {
  id: number
  slug: string
  title: string
  price: string
  images: {
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }[]
  catagory?: { id: number; Name: string }
  size?: { id: number; size: string }[]
  Description?: { type: string; children: { text: string }[] }[]
  series?: string
  isNew?: boolean
  releaseDate?: string
}
