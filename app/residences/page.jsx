import PageClient from './PageClient';

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

export default function Page() {
  return <PageClient />;
}
