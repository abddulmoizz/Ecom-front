'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import Header from './components/Header'; // Adjust path if needed

const BACKGROUND_IMAGE_URL =
  'https://inspired-sunshine-587c5c91b5.media.strapiapp.com/image_2025_05_22_214653813_c05ef365ee.png';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMjIyMjIyIi8+PC9zdmc+'; // plain gray svg as a placeholder

export default function HomePage() {
  const [bgImage, setBgImage] = useState(PLACEHOLDER_IMAGE);

  useEffect(() => {
    const img = new Image();
    img.src = BACKGROUND_IMAGE_URL;
    img.onload = () => setBgImage(BACKGROUND_IMAGE_URL);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black flex flex-col">
        {/* Banner Section centered */}
        <section
          aria-label="G-SHOCK Banner"
          className="flex-grow flex items-center justify-center bg-center bg-cover relative px-4 sm:px-6 md:px-8 transition-background duration-700"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30 pointer-events-none"></div>

          <div className="max-w-4xl text-center relative z-10 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider leading-tight text-white font-extrabold select-text">
              G-SHOCK
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-white font-normal select-text">
              Explore the toughest watches on the planet.
            </p>
            <Link
              href="/details"
              className="inline-block mt-6 px-6 py-3 bg-white text-black text-sm uppercase font-semibold rounded shadow-md hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              aria-label="Shop Now"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
