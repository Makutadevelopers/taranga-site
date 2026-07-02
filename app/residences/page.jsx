import PageClient from './PageClient';
import { SITE_URL, OG_IMAGE } from '@/lib/site';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Residences — 3 & 4 BHK Lakefront Homes | Makuta Taranga',
  description:
    'Spacious 3 & 4 BHK lakefront homes with privacy foyers, 10.35-ft ceilings and corner-facing light. Floor plans on request.',
  alternates: { canonical: '/residences/' },
  openGraph: {
    title: 'Residences — 3 & 4 BHK Lakefront Homes | Makuta Taranga',
    description:
      'Spacious 3 & 4 BHK lakefront homes with privacy foyers, 10.35-ft ceilings and corner-facing light. Floor plans on request.',
    url: '/residences/',
  },
};

const PRODUCT_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Makuta Taranga — 3 & 4 BHK Lakefront Residences',
  description:
    'Spacious 3 & 4 BHK lakefront homes (2480–3255 sft) with privacy foyers, 10.35-ft ceilings and corner-facing light, by IDL Lake, Kukatpally, Hyderabad.',
  image: OG_IMAGE,
  url: `${SITE_URL}/residences/`,
  category: 'Residential Apartment',
  brand: { '@type': 'Brand', name: 'Makuta' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    availability: 'https://schema.org/PreOrder',
    offerCount: '2',
    itemOffered: [
      { '@type': 'Apartment', name: '3 BHK', numberOfRooms: 3, floorSize: { '@type': 'QuantitativeValue', unitText: 'SqFt' } },
      { '@type': 'Apartment', name: '4 BHK', numberOfRooms: 4, floorSize: { '@type': 'QuantitativeValue', unitText: 'SqFt' } },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(PRODUCT_LD)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Residences', path: '/residences/' }]))}
      />
      <PageClient />
    </>
  );
}
