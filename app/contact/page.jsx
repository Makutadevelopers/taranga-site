import PageClient from './PageClient';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Contact | Makuta Taranga',
  description:
    'Contact Makuta Taranga — book a private, no-obligation site visit by IDL Lake, Hyderabad. Call, WhatsApp or leave your details for a callback.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'Contact | Makuta Taranga',
    description:
      'Contact Makuta Taranga — book a private, no-obligation site visit by IDL Lake, Hyderabad.',
    url: '/contact/',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }]))}
      />
      <PageClient />
    </>
  );
}
