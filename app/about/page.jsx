import PageClient from './PageClient';
import { ORGANIZATION, breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'About Makuta — Crown of Excellence | Makuta Taranga',
  description:
    'About Makuta — the team behind Makuta Taranga. RERA-clean process, trusted build quality and a portfolio across Hyderabad.',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Makuta — Crown of Excellence | Makuta Taranga',
    description:
      'About Makuta — the team behind Makuta Taranga. RERA-clean process, trusted build quality and a portfolio across Hyderabad.',
    url: '/about/',
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(ORGANIZATION)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }]))}
      />
      <PageClient />
    </>
  );
}
