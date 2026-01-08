'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/research', label: 'Research' },
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800/50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <Image
            src="/logo-light.png"
            alt="Shibboleth"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8 hidden dark:block"
          />
          <Image
            src="/logo-dark.png"
            alt="Shibboleth"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8 block dark:hidden"
          />
          <span className="font-mono text-sm sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-zinc-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
            SHIBBOLETH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative font-mono text-sm tracking-wider transition-colors ${
                  isActive
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-4 text-sky-500">→</span>
                )}
                {label}
              </Link>
            );
          })}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="font-mono text-sm px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all min-w-[90px]"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? '☀ LIGHT' : '☾ DARK') : ''}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="font-mono text-xs px-2 py-1 border border-zinc-300 dark:border-zinc-700 text-zinc-500"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? '☀' : '☾') : ''}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
          <nav className="flex flex-col px-4 py-3">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-mono text-sm tracking-wider py-3 border-b border-zinc-100 dark:border-zinc-800 transition-colors ${
                    isActive
                      ? 'text-sky-500'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {isActive && <span className="mr-2">→</span>}
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
