import PageClient from './PageClient';

export const metadata = {
  title: 'About Makuta Developers — Crown of Excellence | Makuta Taranga',
  description:
    'About Makuta Developers — the team behind Makuta Taranga. RERA-clean process, trusted build quality and a portfolio across Hyderabad.',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Makuta Developers — Crown of Excellence | Makuta Taranga',
    description:
      'About Makuta Developers — the team behind Makuta Taranga. RERA-clean process, trusted build quality and a portfolio across Hyderabad.',
    url: '/about/',
  },
};

export default function Page() {
  return <PageClient />;
}
