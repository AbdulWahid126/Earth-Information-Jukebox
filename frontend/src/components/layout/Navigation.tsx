'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Radio } from 'lucide-react';

interface NavItem {
  readonly label: string;
  readonly href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Keyboard accessibility: close mobile navigation on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-space-black/85 backdrop-blur-md"
      role="navigation"
      aria-label="Main mission control navigation"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Ident */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="Earth Information Jukebox — Mission Control Home"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-hairline-accent bg-chassis-panel transition-colors group-hover:border-nasa-cyan">
            <Globe className="h-4 w-4 text-nasa-cyan transition-transform group-hover:scale-105" strokeWidth={1.75} />
            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-nasa-cyan animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-widest text-text-primary uppercase">
              Earth Jukebox
            </span>
            <span className="font-mono text-[9px] tracking-wider text-text-muted uppercase">
              NASA Sonification Lab
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center rounded-sm px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-nasa-cyan ${
                    isActive
                      ? 'text-nasa-cyan bg-nasa-cyan/10 border border-hairline-accent font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-chassis-panel/60 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-[calc(0.5rem+3px)] h-[2px] bg-nasa-cyan shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Status Badge (Desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-sm border border-hairline bg-chassis-base/80 px-2.5 py-1 font-mono text-[10px] text-text-secondary">
            <Radio className="h-3 w-3 text-biosphere-emerald animate-pulse" />
            <span className="text-text-muted uppercase">Acoustic Engine:</span>
            <span className="text-biosphere-emerald font-semibold uppercase">Standby</span>
          </div>
          <Link
            href="/studio"
            className="flex items-center gap-1.5 rounded-sm border border-hairline-accent bg-nasa-cyan/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-nasa-cyan transition-colors hover:bg-nasa-cyan hover:text-space-black"
          >
            Launch Studio
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-sm border border-hairline bg-chassis-panel p-2 text-text-secondary transition-colors hover:text-text-primary md:hidden"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? 'Close mission control menu' : 'Open mission control menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-nasa-cyan" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-hairline bg-chassis-base/98 backdrop-blur-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between border-b border-hairline pb-2 mb-3">
                <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
                  Telemetry Navigation
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-biosphere-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-biosphere-emerald animate-pulse" />
                  CLIENT ONLINE
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center justify-between rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-nasa-cyan ${
                          isActive
                            ? 'text-nasa-cyan bg-nasa-cyan/10 border border-hairline-accent font-semibold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-chassis-panel'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-nasa-cyan shadow-[0_0_6px_#00E5FF]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-3 border-t border-hairline">
                <Link
                  href="/studio"
                  onClick={closeMobileMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-nasa-cyan py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-space-black transition-colors hover:bg-cyan-300"
                >
                  Launch Studio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
