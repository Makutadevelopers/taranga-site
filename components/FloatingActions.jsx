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
          <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.25-8.24 8.25zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" /></svg><span>WhatsApp</span>
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
          <span className="sb-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg></span><span className="sb-label">WHATSAPP</span>
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
