'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/residences/', label: 'Residences' },
  { href: '/amenities/', label: 'Amenities' },
  { href: '/location/', label: 'Location' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/blog/', label: 'Journal' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  const cls = ['', isHome ? 'over-hero' : '', solid ? 'solid' : ''].filter(Boolean).join(' ');
  const norm = (h) => (h === '/' ? '/' : h);

  return (
    <header id="hdr" className={cls}>
      <div className="bar">
        <Link className="brand" href="/" aria-label="Makuta Taranga — Home">
          <img className="lg-dark" src="/assets/img/taranga_navy.png" alt="Makuta Taranga" width="160" />
          <img className="lg-light" src="/assets/img/taranga_white.png" alt="Makuta Taranga" width="160" />
        </Link>
        <div
          className="hamb"
          id="hamb"
          role="button"
          tabIndex={0}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => { if (e.key === 'Enter') setOpen((o) => !o); }}
        >
          <span></span><span></span><span></span>
        </div>
        <nav id="nav" className={open ? 'open' : ''}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === norm(n.href) ? 'active' : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <a href="#" className="nbtn" onClick={(e) => { e.preventDefault(); window.openModal && window.openModal('visit'); }}>Come see it</a>
        </nav>
      </div>
    </header>
  );
}
