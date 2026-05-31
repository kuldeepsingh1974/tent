'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type NavTheme = 'hero' | 'light' | 'contact' | 'footer';

const navigation = ['Services', 'Pricing', 'Gallery', 'Contact'];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>('hero');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById('services');
      const contactSection = document.getElementById('contact');
      const footerSection = document.getElementById('footer');
      const themePoint = window.scrollY + 110;

      if (footerSection && themePoint >= footerSection.offsetTop) {
        setNavTheme('footer');
      } else if (contactSection && themePoint >= contactSection.offsetTop) {
        setNavTheme('contact');
      } else if (servicesSection && themePoint >= servicesSection.offsetTop) {
        setNavTheme('light');
      } else {
        setNavTheme(pathname === '/' ? 'hero' : 'light');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const theme: Record<NavTheme, {
    panel: React.CSSProperties;
    wash: string;
    line: string;
    text: string;
    link: string;
    ctaBg: string;
    ctaText: string;
    mobileBg: string;
  }> = {
    hero: {
      panel: { backgroundColor: 'rgb(255 255 255 / 0.15)', borderColor: 'rgb(255 255 255 / 0.3)' },
      wash: 'linear-gradient(90deg, rgb(115 108 127 / 0.72), rgb(208 157 157 / 0.58), rgb(250 217 187 / 0.46))',
      line: 'rgb(255 255 255 / 0.7)',
      text: '#000000',
      link: '#000000',
      ctaBg: '#FFF9E9',
      ctaText: '#000000',
      mobileBg: 'rgb(255 255 255 / 0.1)',
    },
    light: {
      panel: { backgroundColor: 'rgb(255 249 233 / 0.86)', borderColor: 'rgb(250 217 187 / 0.8)' },
      wash: 'linear-gradient(90deg, rgb(255 249 233 / 0.92), rgb(247 237 247 / 0.88), rgb(250 217 187 / 0.86))',
      line: 'rgb(255 255 255 / 0.9)',
      text: '#000000',
      link: '#000000',
      ctaBg: '#FFF9E9',
      ctaText: '#000000',
      mobileBg: 'rgb(255 249 233 / 0.9)',
    },
    contact: {
      panel: { backgroundColor: 'rgb(255 255 255 / 0.12)', borderColor: 'rgb(255 255 255 / 0.25)' },
      wash: 'linear-gradient(90deg, rgb(115 108 127 / 0.76), rgb(208 157 157 / 0.7), rgb(250 217 187 / 0.55))',
      line: 'rgb(247 237 247 / 0.75)',
      text: '#000000',
      link: '#000000',
      ctaBg: '#FFF9E9',
      ctaText: '#000000',
      mobileBg: 'rgb(255 255 255 / 0.1)',
    },
    footer: {
      panel: { backgroundColor: 'rgb(115 108 127 / 0.72)', borderColor: 'rgb(255 255 255 / 0.15)' },
      wash: 'linear-gradient(90deg, rgb(115 108 127 / 0.88), rgb(208 157 157 / 0.72), rgb(247 237 247 / 0.35))',
      line: 'rgb(255 255 255 / 0.3)',
      text: '#000000',
      link: '#000000',
      ctaBg: '#FFF9E9',
      ctaText: '#000000',
      mobileBg: 'rgb(115 108 127 / 0.65)',
    },
  };
  const currentTheme = theme[navTheme];

  return (
    <nav className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-2xl shadow-[#3F394B]/25 backdrop-blur-2xl transition-colors duration-500 sm:rounded-[1.75rem]" style={currentTheme.panel}>
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl transition-colors duration-500 sm:rounded-[1.75rem]" style={{ background: currentTheme.wash }} />
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white/70 transition-colors duration-500" style={{ backgroundColor: currentTheme.line }} />
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <a href="/" className="flex min-w-0 items-center gap-3">
              <span className="flex h-14 w-44 items-center justify-center sm:h-18 sm:w-48">
                <img
                  src="/logo-2.png"
                  alt="Chaman Tent House logo"
                  className="h-full w-full object-contain mix-blend-multiply contrast-125 saturate-110"
                />
              </span>
            </a>

            <div className="hidden items-center gap-8 xl:gap-16 lg:flex">
              {navigation.map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase()}`}
                  className="relative font-bold text-black group"
                  style={{ color: currentTheme.link }}
                >
                  {link}

                  <span
                    className="absolute left-0 -bottom-1 h-[2px] w-0 bg-current transition-all duration-300 ease-in-out group-hover:w-full"
                  ></span>
                </a>
              ))}
            </div>

            <a href="/#contact" className="hidden rounded-full border border-[#FAD9BB] px-6 py-3 font-black shadow-lg shadow-[#3F394B]/15 backdrop-blur transition hover:scale-105 hover:bg-[#F7EDF7] lg:block xl:px-7" style={{ background: currentTheme.ctaBg, color: currentTheme.ctaText }}>
              Book Now
            </a>

            <button
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[#FAD9BB] bg-[#FFF9E9] text-black shadow-lg shadow-[#3F394B]/15 backdrop-blur transition hover:bg-[#F7EDF7] lg:hidden"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mb-3 grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-[#3F394B]/20 backdrop-blur-2xl transition-colors duration-500 sm:mb-4 lg:hidden" style={{ backgroundColor: currentTheme.mobileBg }}>
              {navigation.map((link) => (
                <a key={link} href={`/#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="rounded-xl border border-[#FAD9BB] bg-[#FFF9E9] px-3 py-2 font-bold text-black transition hover:bg-[#F7EDF7]">
                  {link}
                </a>
              ))}
              <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-[#FAD9BB] px-5 py-3 text-center font-black shadow-lg shadow-[#3F394B]/15 backdrop-blur hover:bg-[#F7EDF7]" style={{ background: currentTheme.ctaBg, color: currentTheme.ctaText }}>
                Book Now
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
