import PageClient from './PageClient';
import { breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Amenities — 36 Features for Play & Leisure | Makuta Taranga',
  description:
    "36 amenities at Makuta Taranga — rooftop lounge, pool, courts, temple garden, sky bridge, kids' play and more across site, terrace and activity zones.",
  alternates: { canonical: '/amenities/' },
  openGraph: {
    title: 'Amenities — 36 Features for Play & Leisure | Makuta Taranga',
    description:
      "36 amenities at Makuta Taranga — rooftop lounge, pool, courts, temple garden, sky bridge, kids' play and more across site, terrace and activity zones.",
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
