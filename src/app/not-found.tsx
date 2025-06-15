import Link from "next/link"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been moved.</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
