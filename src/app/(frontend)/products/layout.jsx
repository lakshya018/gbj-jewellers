// ─── Layout for /products — provides base SEO metadata ───────────────────────
export const metadata = {
  title: 'Collections | GBJ Jewellers — Gold, Diamond & Bridal Jewellery',
  description:
    'Shop GBJ Jewellers\' full range of BIS Hallmarked 22KT & 18KT gold jewellery, IGI certified diamonds, and handcrafted bridal sets. Filter by category, type, purity and price.',
  openGraph: {
    title: 'Collections | GBJ Jewellers',
    description: 'Browse 10,000+ handcrafted gold and diamond jewellery designs. BIS Hallmarked & IGI Certified.',
    type: 'website',
  },
  keywords: 'gold jewellery online, diamond rings India, bridal necklace set, 22KT gold bangles, IGI certified diamonds, buy gold jewellery Nagaur',
};

export default function ProductsLayout({ children }) {
  return children;
}
