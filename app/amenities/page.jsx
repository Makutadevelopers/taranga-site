import PageClient from './PageClient';

export const metadata = {
  title: 'Amenities — 40+ Features for Play & Leisure | Makuta Taranga',
  description:
    "Over 40 amenities at Makuta Taranga — rooftop lounge, pool, courts, temple garden, sky bridge, kids' play and more across site, terrace and activity zones.",
  alternates: { canonical: '/amenities/' },
  openGraph: {
    title: 'Amenities — 40+ Features for Play & Leisure | Makuta Taranga',
    description:
      "Over 40 amenities at Makuta Taranga — rooftop lounge, pool, courts, temple garden, sky bridge, kids' play and more across site, terrace and activity zones.",
    url: '/amenities/',
  },
};

export default function Page() {
  return <PageClient />;
}
