import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Collections: [
    { label: 'Gold Jewellery',    href: '/products?category=Gold' },
    { label: 'Diamond Jewellery', href: '/products?category=Diamond' },
    { label: 'Bridal Collection', href: '/products?category=Bridal' },
    { label: 'Everyday Wear',     href: '/products?category=Everyday+Wear' },
    { label: 'All Collections',   href: '/products' },
  ],
  Explore: [
    { label: 'Home',     href: '/' },
    { label: 'About Us', href: '/#about' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart',     href: '/cart' },
  ],
  Shop: [
    { label: 'Gold Jewellery',    href: '/products?category=Gold' },
    { label: 'Diamond Jewellery', href: '/products?category=Diamond' },
    { label: 'Bridal Collection', href: '/products?category=Bridal' },
    { label: 'All Products',      href: '/products' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <div className="flex items-center">
                <Image
                  src="/images/gbj_logo.png"
                  alt="GBJ Jewellers Logo"
                  width={120}
                  height={120}
                  className="w-24 object-contain"
                />
                <div className="flex flex-col -ml-3">
                  <span className="font-serif font-bold text-2xl">
                    GBJ <span className="text-gold-400">Jewellers</span>
                  </span>
                  <div className="text-[10px] tracking-[0.35em] uppercase text-gold-500 mt-0.5">
                    Since 1925
                  </div>
                </div>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Crafting timeless jewellery since 1925. Every piece tells a story of artistry, tradition, and enduring beauty — passed down through generations.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={14} className="text-gold-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={14} className="text-gold-400 flex-shrink-0" />
                <span>care@gbjjewellers.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={14} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <span>Nawa City, Nagaur, Rajasthan</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gold-400 hover:text-gold-400 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-serif text-sm font-semibold text-gold-400 uppercase tracking-widest mb-5">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gold-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-10">
          <div className="max-w-lg mx-auto text-center">
            <h4 className="font-serif text-xl text-white mb-1">Stay in the Know</h4>
            <p className="text-sm text-gray-400 mb-5">
              Subscribe for new arrivals, exclusive offers, and jewellery care tips.
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-gray-800 text-white text-sm placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <button
                className="px-6 py-3 text-xs font-semibold tracking-widest uppercase text-onyx transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="mt-10 gold-divider" />

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2025 GBJ Jewellers. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-400 inline-block" />
              BIS Hallmarked Gold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-400 inline-block" />
              IGI Certified Diamonds
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
