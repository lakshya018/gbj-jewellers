import { getTrendingProducts, getBanners, getAllCategories } from '@/lib/payloadAPI';
import HeroBanner from '@/components/sections/HeroBanner';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import TrendingCarousel from '@/components/sections/TrendingCarousel';
import PromoBanners from '@/components/sections/PromoBanners';
import TrustStrip from '@/components/sections/TrustStrip';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';

export const metadata = {
  title: 'GBJ Jewellers — Luxury Gold & Diamond Jewellery',
  description: 'Discover premium gold, diamond, and bridal jewellery at GBJ Jewellers. BIS Hallmarked 22KT gold. IGI certified diamonds. Free shipping on orders above ₹10,000.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const trendingProducts = await getTrendingProducts(8);
  const banners = await getBanners();
  const categories = await getAllCategories();

  return (
    <main>
      <HeroBanner />
      <TrustStrip />
      <FeaturedCollections categories={categories} />
      <TrendingCarousel trending={trendingProducts} />
      <PromoBanners banners={banners} />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
