import PageClient from './PageClient';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Gated Community in Kukatpally with World-Class Amenities | Makuta Taranga',
  description:
    'Discover Makuta Taranga, a premium gated community in Kukatpally with world-class amenities, landscaped gardens, rooftop spaces and modern living for families.',
  keywords: [
    'luxury apartment amenities',
    'luxury apartments with pool',
    'high end apartment amenities',
    'luxury amenities kukatpally',
    'clubhouse apartments kukatpally',
    'infinity pool apartments kukatpally',
    'gated community amenities kukatpally',
    'apartments near idl lake kukatpally',
  ],
  alternates: { canonical: '/amenities/' },
  openGraph: {
    title: 'Gated Community in Kukatpally with World-Class Amenities | Makuta Taranga',
    description:
      'Discover Makuta Taranga, a premium gated community in Kukatpally with world-class amenities, landscaped gardens, rooftop spaces and modern living for families.',
    url: '/amenities/',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Amenities', path: '/amenities/' }]))}
      />
      <PageClient />
    </>
  );
}
