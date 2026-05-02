import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export const metadata = {
  metadataBase: new URL('https://www.gbjjewellers.com'),
  title: {
    default: 'GBJ Jewellers — Premium Gold & Diamond Jewellery Since 1925',
    template: '%s | GBJ Jewellers',
  },
  description:
    'GBJ Jewellers, Nawa City, Nagaur — Luxury gold, diamond, and bridal jewellery since 1925. BIS Hallmarked 22KT & 18KT gold. IGI and GIA certified diamonds. Free insured shipping across India.',
  keywords: [
    'gold jewellery', 'diamond rings India', 'bridal jewellery set',
    '22KT gold bangles', 'IGI certified diamonds', 'GBJ Jewellers Nagaur',
    'buy gold jewellery online', 'BIS hallmarked gold', 'jewellery Nawa City',
    'luxury Indian jewellery', 'wedding jewellery Rajasthan',
  ],
  authors: [{ name: 'GBJ Jewellers', url: 'https://www.gbjjewellers.com' }],
  creator: 'GBJ Jewellers',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.gbjjewellers.com',
    siteName: 'GBJ Jewellers',
    title: 'GBJ Jewellers — Premium Gold & Diamond Jewellery Since 1925',
    description:
      'Luxury gold, diamond, and bridal jewellery since 1925. BIS Hallmarked gold & IGI certified diamonds. Shop timeless pieces crafted by master artisans in Nawa City, Nagaur.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GBJ Jewellers — Premium Gold & Diamond Jewellery',
    description: 'Luxury jewellery since 1925. BIS Hallmarked gold and IGI certified diamonds.',
    creator: '@gbjjewellers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    // google: 'ADD_YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="bg-pearl font-sans antialiased">
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </WishlistProvider>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
