import HomeClient from './HomeClient';
import { SITE_URL, OG_IMAGE } from '@/lib/site';
import { ORGANIZATION, LOCAL_BUSINESS, ld } from '@/lib/schema';

export const metadata = {
  title: 'Makuta Taranga — The Finest Form of Luxury | IDL Lakefront, Hyderabad',
  description:
    'Lakefront 3 & 4 BHK luxury residences by IDL Lake, Moosapet–Kukatpally, Hyderabad. G+24 towers, 10.35-ft ceilings, privacy foyers. TS RERA P02200011012.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Makuta Taranga — The Finest Form of Luxury | IDL Lakefront, Hyderabad',
    description:
      'Lakefront 3 & 4 BHK luxury residences by IDL Lake, Moosapet–Kukatpally, Hyderabad. G+24 towers, 10.35-ft ceilings, privacy foyers. TS RERA P02200011012.',
    url: '/',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(ORGANIZATION)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(LOCAL_BUSINESS)} />
      <HomeClient />
    </>
  );
}
