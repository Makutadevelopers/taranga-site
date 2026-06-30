'use client';
import { trackCall, trackWhatsApp, downloadPDF } from '@/lib/lead';

// Desktop WhatsApp pill (.wa) + mobile call nav (.mcall) + mobile sticky bar (#sbar).
// CSS decides which is visible per device (one set per breakpoint).
export default function FloatingActions() {
  const openModal = (m) => window.openModal && window.openModal(m);
  return (
    <>
      <nav className="mcall">
        <a href="tel:+919059676464" onClick={trackCall}>
          <svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg><span>Call</span>
        </a>
        <a href="https://wa.me/919059676464" target="_blank" rel="noopener" onClick={trackWhatsApp}>
          <svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z" /></svg><span>WhatsApp</span>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); openModal('brochure'); }}>
          <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6" /></svg><span>Brochure</span>
        </a>
        <a className="mc-cta" href="#" onClick={(e) => { e.preventDefault(); openModal('visit'); }}>
          <svg viewBox="0 0 24 24"><path d="M4 6h16v15H4zM4 10h16M8 3v4M16 3v4" /></svg><span>Book a Visit</span>
        </a>
      </nav>

      <div className="sticky-bar" id="sbar">
        <a href="tel:+919059676464" className="sb-btn" title="Call us" onClick={trackCall}>
          <span className="sb-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></span><span className="sb-label">CALL</span>
        </a>
        <a href="https://wa.me/919059676464?text=Hi%20Makuta%20Taranga%2C%20I%27d%20like%20to%20know%20more%20about%20the%20project." target="_blank" rel="noopener noreferrer" className="sb-btn" title="WhatsApp us" onClick={trackWhatsApp}>
          <span className="sb-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z" /></svg></span><span className="sb-label">WHATSAPP</span>
        </a>
        <a href="#" className="sb-btn" title="Download brochure" onClick={(e) => { e.preventDefault(); downloadPDF('brochure'); }}>
          <span className="sb-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6" /></svg></span><span className="sb-label">BROCHURE</span>
        </a>
        <a href="#" className="sb-btn" title="Get price sheet" onClick={(e) => { e.preventDefault(); openModal('price'); }}>
          <span className="sb-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10M7 9h9M14 5c.6 3-1.8 4.2-4 4.2H7l6.5 6.3" /></svg></span><span className="sb-label">PRICE</span>
        </a>
      </div>
    </>
  );
}
