import { Shield, Truck, RotateCcw, Award, Lock } from 'lucide-react';

const trustItems = [
  { icon: Award, label: 'BIS Hallmarked', desc: 'Certified gold quality' },
  { icon: Shield, label: 'IGI / GIA Certified', desc: 'Verified diamonds' },
  { icon: Truck, label: 'Free Shipping', desc: 'On orders above ₹10,000' },
  { icon: RotateCcw, label: '30-Day Returns', desc: 'Hassle-free policy' },
  { icon: Lock, label: 'Secure Payments', desc: '100% safe & encrypted' },
];

export default function TrustStrip() {
  return (
    <section className="bg-charcoal py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustItems.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 border border-gold-700 flex items-center justify-center mb-3 group-hover:border-gold-400 group-hover:bg-gold-900/20 transition-all duration-300">
                <Icon size={20} className="text-gold-400" />
              </div>
              <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-1">{label}</h4>
              <p className="text-gray-500 text-[11px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
