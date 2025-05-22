'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white text-sm">
      {/* Top Grid Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {/* MEN */}
        <div>
          <h4 className="font-bold mb-3 uppercase tracking-wide">Men</h4>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="#">MR-G</Link></li>
            <li><Link href="#">MT-G</Link></li>
            <li><Link href="#">G-STEEL</Link></li>
            <li><Link href="#">Master of G - Collection</Link></li>
            <li><Link href="#">G-SHOCK MOVE</Link></li>
            <li><Link href="#">Digital</Link></li>
            <li><Link href="#">Analog-Digital</Link></li>
            <li><Link href="#">Limited Models</Link></li>
          </ul>
        </div>

        {/* WOMEN */}
        <div>
          <h4 className="font-bold mb-3 uppercase tracking-wide">Women</h4>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="#">Women</Link></li>
            <li><Link href="#">G-MS Watches</Link></li>
            <li><Link href="#">BABY-G</Link></li>
          </ul>
        </div>

        {/* SHOP BY CATEGORY */}
        <div>
          <h4 className="font-bold mb-3 uppercase tracking-wide">Shop by Category</h4>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="#">Type</Link></li>
            <li><Link href="#">Collection</Link></li>
            <li><Link href="#">Watches</Link></li>
          </ul>
        </div>

        {/* CUSTOMER SUPPORT */}
        <div>
          <h4 className="font-bold mb-3 uppercase tracking-wide">Customer Support</h4>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="#">Where to Buy</Link></li>
            <li><Link href="#">Customer Support</Link></li>
            <li><Link href="#">Manuals</Link></li>
            <li><Link href="#">Product Registration</Link></li>
            <li><Link href="#">Affiliates</Link></li>
            <li><Link href="#">G-SHOCK Points Program</Link></li>
            <li><Link href="#">Daylight Savings Time</Link></li>
            <li><Link href="#">Military Discount</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-gray-400 text-xs">
        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" aria-label="Facebook" className="hover:text-white">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-white">
            <i className="fab fa-twitter" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white">
            <i className="fab fa-instagram" />
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-white">
            <i className="fab fa-youtube" />
          </a>
        </div>

        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Sale</Link>
          <Link href="#" className="hover:text-white">Return Policy</Link>
          <span className="text-gray-500">Select Country (United States)</span>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-center">
          © {new Date().getFullYear()} CASIO AMERICA, INC.
        </div>
      </div>
    </footer>
  );
}
