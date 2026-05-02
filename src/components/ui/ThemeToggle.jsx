'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
        isDark ? 'bg-surface-dark text-accent hover:opacity-80' : 'bg-secondary text-text hover:bg-border'
      }`}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="transition-transform duration-500 rotate-0 scale-100" />
      ) : (
        <Moon size={18} className="transition-transform duration-500 rotate-0 scale-100" />
      )}
    </button>
  );
}
