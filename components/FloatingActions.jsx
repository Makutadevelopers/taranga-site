'use client';
import { trackCall, trackWhatsApp, downloadPDF } from '@/lib/lead';

// Desktop WhatsApp pill (.wa) + mobile call nav (.mcall) + mobile sticky bar (#sbar).
// CSS decides which is visible per device (one set per breakpoint).
export default function FloatingActions() {
  const openModal = (m) => window.openModal && window.openModal(m);
  return (
    <>
      <a className="wa" href="https://wa.me/919059676464" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" onClick={trackWhatsApp}>
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 4C9.93 4 5 8.93 5 15.04c0 2.13.6 4.13 1.64 5.83L5 27l6.3-1.65a11 11 0 0 0 4.74 1.08h.01c6.1 0 11.04-4.93 11.04-11.04C27.09 8.93 22.15 4 16.04 4zm0 19.85h-.01a9.16 9.16 0 0 1-4.66-1.28l-.33-.2-3.46.91.92-3.37-.22-.35a9.13 9.13 0 0 1-1.4-4.86c0-5.05 4.11-9.16 9.17-9.16 2.45 0 4.75.96 6.48 2.69a9.1 9.1 0 0 1 2.68 6.48c0 5.05-4.11 9.14-9.17 9.14zm5.03-6.85c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.6.07-.28-.14-1.16-.43-2.22-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.43.12-.56.12-.12.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.66 1.12 2.85c.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z" /></svg>
      </a>

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
          <span className="sb-icon">📞</span><span className="sb-label">CALL</span>
        </a>
        <a href="https://wa.me/919059676464?text=Hi%20Makuta%20Taranga%2C%20I%27d%20like%20to%20know%20more%20about%20the%20project." target="_blank" rel="noopener noreferrer" className="sb-btn" title="WhatsApp us" onClick={trackWhatsApp}>
          <span className="sb-icon">💬</span><span className="sb-label">WHATSAPP</span>
        </a>
        <a href="#" className="sb-btn" title="Download brochure" onClick={(e) => { e.preventDefault(); downloadPDF('brochure'); }}>
          <span className="sb-icon">📄</span><span className="sb-label">BROCHURE</span>
        </a>
        <a href="#" className="sb-btn" title="Get price sheet" onClick={(e) => { e.preventDefault(); openModal('price'); }}>
          <span className="sb-icon">💰</span><span className="sb-label">PRICE</span>
        </a>
      </div>
    </>
  );
}
