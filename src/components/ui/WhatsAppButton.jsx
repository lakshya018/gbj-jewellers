'use client';

import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '919876543210'; // TODO: Replace with real number (country code + number, no +)
const MESSAGE = encodeURIComponent(
  'Hi! I came across GBJ Jewellers and I\'m interested in your jewellery collection. Could you please help me?'
);

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group"
    >
      {/* Tooltip */}
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200
        bg-surface-dark text-on-dark text-[11px] font-medium px-3 py-1.5 rounded-sm whitespace-nowrap
        shadow-md pointer-events-none">
        Chat with us
      </span>

      {/* Button */}
      <div className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center
        relative overflow-hidden"
        style={{ background: '#25D366' }}
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ background: '#25D366' }} />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-white relative z-10"
        >
          <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.75 5.56 2.17 7.96L.5 31.5l7.75-2.12A15.45 15.45 0 0016 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.4a13.04 13.04 0 01-6.63-1.8l-.47-.28-4.6 1.26 1.22-4.48-.31-.49A12.94 12.94 0 013.1 16C3.1 9.44 8.94 3.6 16 3.6S28.9 9.44 28.9 16 23.06 28.9 16 28.9zm7.1-9.73c-.39-.2-2.3-1.14-2.66-1.27-.36-.13-.62-.2-.88.2s-1.01 1.27-1.24 1.53c-.23.26-.45.29-.84.1-.39-.2-1.65-.61-3.14-1.94-1.16-1.04-1.94-2.32-2.17-2.71-.23-.39-.02-.6.17-.79.18-.18.39-.45.59-.68.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.68-.1-.2-.88-2.12-1.2-2.9-.32-.77-.64-.66-.88-.67h-.75c-.26 0-.68.1-1.04.49s-1.36 1.33-1.36 3.24 1.39 3.76 1.59 4.02c.2.26 2.73 4.17 6.62 5.85.93.4 1.65.64 2.21.82.93.3 1.77.26 2.44.16.74-.11 2.3-.94 2.62-1.85.32-.91.32-1.7.23-1.85-.1-.16-.36-.26-.75-.45z" />
        </svg>
      </div>
    </motion.a>
  );
}
