import PageClient from './PageClient';
import { SITE_URL, OG_IMAGE } from '@/lib/site';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Location & Map — IDL Lakefront, Moosapet | Makuta Taranga',
  description:
    'Makuta Taranga location: IDL Road, opp. IDL Lake, Moosapet–Kukatpally, Hyderabad. 800 m to metro, malls & schools within 1 km. Interactive map.',
  alternates: { canonical: '/location/' },
  openGraph: {
    title: 'Location & Map — IDL Lakefront, Moosapet | Makuta Taranga',
    description:
      'Makuta Taranga location: IDL Road, opp. IDL Lake, Moosapet–Kukatpally, Hyderabad. 800 m to metro, malls & schools within 1 km. Interactive map.',
    url: '/location/',
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: 'Makuta Taranga',
  description:
    'Lakefront 3 & 4 BHK luxury residences by IDL Lake, Moosapet-Kukatpally, Hyderabad. G+24 twin towers connected by a sky bridge, 10.35-ft ceilings, privacy foyers and 36 amenities.',
  url: SITE_URL,
  image: OG_IMAGE,
  numberOfAccommodationUnits: '248',
  petsAllowed: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'IDL Road, Opp. IDL Lake, Habeeb Nagar, Moosapet',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500072',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '17.486', longitude: '78.411' },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Infinity Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Rooftop Lounge', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sky Bridge', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Temple Garden', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Gymnasium', value: true },
  ],
  containsPlace: [
    { '@type': 'Apartment', name: '3 BHK', numberOfRooms: 3 },
    { '@type': 'Apartment', name: '4 BHK', numberOfRooms: 4 },
  ],
  developer: { '@type': 'Organization', name: 'Makuta Developers', url: 'https://www.makutadevelopers.com' },
  branchOf: { '@type': 'RealEstateAgent', name: 'Makuta Developers', telephone: '+91-90596-76464' },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Location', path: '/location/' }]))}
      />
      <PageClient />
    </>
  );
}
