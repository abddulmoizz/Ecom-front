'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-lg font-extrabold uppercase tracking-widest whitespace-nowrap flex-shrink-0"
        >
          G-SHOCK
        </Link>

        {/* Desktop Navigation - visible only from lg and above */}
        <nav className="hidden lg:block flex-1 ml-10">
          <ul className="flex space-x-6 text-white text-xs uppercase font-semibold tracking-wide whitespace-nowrap">
            {[
              { href: '/new-featured', label: 'NEW & FEATURED' },
              { href: '/best-sellers', label: 'BEST SELLERS' },
              { href: '/iconic-styles', label: 'ICONIC STYLES' },
              { href: '/men', label: 'MEN' },
              { href: '/women', label: 'WOMEN' },
              { href: '/sale', label: 'SALE' },
              { href: '/about-gshock', label: 'ABOUT G-SHOCK' },
              { href: '/find-a-store', label: 'FIND A STORE' },
            ].map(({ href, label }) => (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className="
                    relative
                    text-white
                    decoration-transparent
                    hover:decoration-transparent
                    after:absolute
                    after:-bottom-0.5
                    after:left-0
                    after:h-[2px]
                    after:w-full
                    after:bg-white
                    after:origin-left
                    after:scale-x-0
                    after:transition-transform
                    after:duration-300
                    after:ease-in-out
                    hover:after:scale-x-100
                  "
                  onClick={() => setMobileMenuOpen(false)} // close mobile menu if opened (precaution)
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side icons and search bar */}
        <div className="flex items-center space-x-4">
          {/* Search bar - show on lg+ */}
          <div className="hidden lg:flex items-center space-x-1">
            <input
              type="text"
              aria-label="Search"
              placeholder="Search..."
              className="outline-none text-white text-xs w-20 bg-black placeholder-gray-400 border-b border-white focus:border-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button aria-label="Search" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>

          {/* Cart Icon - visible on lg+ */}
          <button aria-label="Cart" className="hover:text-gray-400 hidden lg:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.6M7 13l-4-8M17 21a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>

          {/* User Icon - visible on lg+ */}
          <button aria-label="User Account" className="hover:text-gray-400 hidden lg:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Hamburger Menu Button - visible below lg */}
          <button
            aria-label="Menu"
            className="hover:text-gray-400 lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                // Close icon (X)
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger icon
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown - visible below lg */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-black border-t border-gray-800">
          <ul className="flex flex-col px-6 py-4 space-y-3 text-white text-sm uppercase font-semibold tracking-wide">
            {[
              { href: '/new-featured', label: 'NEW & FEATURED' },
              { href: '/best-sellers', label: 'BEST SELLERS' },
              { href: '/iconic-styles', label: 'ICONIC STYLES' },
              { href: '/men', label: 'MEN' },
              { href: '/women', label: 'WOMEN' },
              { href: '/sale', label: 'SALE' },
              { href: '/about-gshock', label: 'ABOUT G-SHOCK' },
              { href: '/find-a-store', label: 'FIND A STORE' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block w-full py-2 border-b border-gray-800 hover:bg-gray-900"
                  onClick={() => setMobileMenuOpen(false)} // close menu on click link
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Mobile Search Bar */}
            <li>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  aria-label="Search"
                  placeholder="Search..."
                  className="flex-grow outline-none text-black text-sm px-2 py-1 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button aria-label="Search" className="text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </button>
              </div>
            </li>

            {/* Mobile Cart & User Icons */}
            <li className="flex space-x-6">
              <button aria-label="Cart" className="hover:text-gray-400 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.6M7 13l-4-8M17 21a2 2 0 11-4 0 2 2 0 014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>

              <button aria-label="User Account" className="hover:text-gray-400 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
