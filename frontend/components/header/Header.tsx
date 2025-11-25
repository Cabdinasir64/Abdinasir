"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/skills', label: t('nav.skills') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/Galleries', label: t('nav.galleries') },
    { href: '/contact', label: t('nav.contact') }
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
        ? 'bg-surface-50/80 backdrop-blur-lg shadow-lg shadow-primary-900/5 py-3'
        : 'bg-transparent py-5'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          <Logo />

          <motion.nav
            className="hidden md:flex items-center gap-1 bg-surface-100/80 p-1 rounded-full border border-surface-200/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500 rounded-full shadow-md shadow-primary-500/25"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span
                    suppressHydrationWarning={true}
                    className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-surface-600 hover:text-primary-600'
                      }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </motion.nav>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <LanguageSelector />

            <motion.button
              className="md:hidden p-2 rounded-lg bg-surface-100 text-surface-800 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-current rounded-full origin-left"
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current rounded-full"
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current rounded-full origin-left"
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0 }}
                />
              </div>
            </motion.button>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-surface-50/95 backdrop-blur-xl border-b border-surface-200 shadow-xl overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl font-medium text-lg flex items-center justify-between ${pathname === item.href
                      ? 'bg-primary-50 text-primary-600 border border-primary-100'
                      : 'text-surface-600 hover:bg-surface-100'
                      }`}
                  >
                    <span suppressHydrationWarning={true}>
                      {item.label}
                    </span>

                    {pathname === item.href && (
                      <motion.div layoutId="mobileActiveDot" className="w-2 h-2 rounded-full bg-primary-500" />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;