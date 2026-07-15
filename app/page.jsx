import HomeClient from './HomeClient';
import { SITE_URL, OG_IMAGE } from '@/lib/site';
import { ORGANIZATION, LOCAL_BUSINESS, ld } from '@/lib/schema';

export const metadata = {
  title: 'Gated Community Flats For Sale In Kukatpally | Makuta Taranga',
  description:
    'Discover gated community flats for sale in Kukatpally at Makuta Taranga. Luxury 3 & 4 BHK apartments with premium amenities in a prime Hyderabad location.',
  keywords: [
    'gated communities in kukatpally',
    '3 bhk apartments in kukatpally',
    '3 bhk flats for sale in kukatpally',
    '4bhk flats for sale',
    'flats for sale in kukatpally near metro',
    'flats near kukatpally',
    'gated communities near kukatpally',
    'gated community flats for sale in kukatpally',
    'gated community flats in kukatpally',
    'kukatpally 3 bhk flat for sale',
    'kukatpally gated community flats',
    'new gated communities in kukatpally',
    '3bhk flats in kukatpally',
    'gated community apartments in kukatpally',
    'luxury apartments in kukatpally',
    'residential projects in kukatpally',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Gated Community Flats For Sale In Kukatpally | Makuta Taranga',
    description:
      'Discover gated community flats for sale in Kukatpally at Makuta Taranga. Luxury 3 & 4 BHK apartments with premium amenities in a prime Hyderabad location.',
    url: '/',
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: 'Makuta Taranga',
  description:
    'Lakefront 3 & 4 BHK luxury residences by IDL Lake, Kukatpally, Hyderabad. G+24 twin towers connected by a sky bridge, 10.35-ft ceilings, privacy foyers and 36 amenities.',
  url: SITE_URL,
  image: OG_IMAGE,
  numberOfAccommodationUnits: '248',
  petsAllowed: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'IDL Road, Opp. IDL Lake',
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
  developer: { '@type': 'Organization', name: 'Makuta', url: 'https://www.makutadevelopers.com' },
  branchOf: { '@type': 'RealEstateAgent', name: 'Makuta', telephone: '+91-90596-76464' },
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
