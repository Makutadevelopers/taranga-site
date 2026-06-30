import PageClient from './PageClient';

export const metadata = {
  title: 'Contact & FAQ | Makuta Taranga',
  description:
    'Contact Makuta Taranga — book a private site visit by IDL Lake, Moosapet, Hyderabad. Answers on configs, RERA, possession and home loans.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'Contact & FAQ | Makuta Taranga',
    description:
      'Contact Makuta Taranga — book a private site visit by IDL Lake, Moosapet, Hyderabad. Answers on configs, RERA, possession and home loans.',
    url: '/contact/',
  },
};

export default function Page() {
  return <PageClient />;
}
