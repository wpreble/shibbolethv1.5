'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/analytics', label: 'Analytics' },
  ];

  return (
    <header className="border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Covenant-style logo mark */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="text-zinc-700" />
              <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" className="text-zinc-600" />
              <circle cx="20" cy="20" r="6" fill="currentColor" className="text-sky-500 group-hover:text-sky-400 transition-colors" />
            </svg>
          </div>
          <span className="font-mono text-lg tracking-[0.2em] font-semibold text-white group-hover:text-sky-400 transition-colors">
            SHIBBOLETH
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative font-mono text-sm tracking-wider transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-4 text-sky-500">→</span>
                )}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
