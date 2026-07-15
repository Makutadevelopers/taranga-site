import './globals.css';
import Script from 'next/script';
import Loader from '@/components/Loader';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import GlobalUI from '@/components/GlobalUI';
import SharedEffects from '@/components/SharedEffects';
import { SITE_URL } from '@/lib/site';

const SITE = SITE_URL;

export const metadata = {
  metadataBase: new URL(SITE),
  // Each page supplies its full title (already includes "| Makuta Taranga" where
  // appropriate), so no template is applied here to avoid a doubled suffix.
  title: 'Makuta Taranga — The Finest Form of Luxury | IDL Lakefront, Hyderabad',
  description:
    'Lakefront 3 & 4 BHK luxury residences by IDL Lake, Kukatpally, Hyderabad. G+24 towers, 10.35-ft ceilings, privacy foyers. TS RERA P02200011012.',
  authors: [{ name: 'Makuta' }],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    type: 'website',
    siteName: 'Makuta Taranga',
    images: [{ url: '/assets/img/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/assets/img/og-image.jpg'] },
};

export const viewport = {
  themeColor: '#F4F1EA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics 4 — Google's official gtag snippet, verbatim and in <head>.
            It must stay here, not in <body>: Search Console's Google Analytics ownership
            check reads the tag from <head> and fails ("tracking code in the wrong
            location") if next/script defers it into the body. `async` keeps it
            non-blocking, so this costs nothing at render time. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LG2FQH38BR" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LG2FQH38BR', {'anonymize_ip': true});
        `,
          }}
        />
      </head>
      <body>
        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '29987720737478821');
          fbq('track', 'PageView');
        `}</Script>

        {/* Microsoft Clarity — heatmaps + session recordings. Project xmplmcrl7j.
            Loads the tag from clarity.ms and beacons back to *.clarity.ms; both are
            allow-listed in the CSP (public/_headers). The Decap CMS at /admin is a
            standalone index.html outside this layout, so it never loads this. */}
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xmplmcrl7j");
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=29987720737478821&ev=PageView&noscript=1" alt="" />
        </noscript>

        <Loader />
        <ScrollProgress />
        <Header />
        {children}
        <Footer />
        <FloatingActions />
        <GlobalUI />
        <SharedEffects />
      </body>
    </html>
  );
}
