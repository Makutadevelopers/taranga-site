import PageClient from './PageClient';

export const metadata = {
  title: 'Gallery | Makuta Taranga',
  description:
    'Renders of Makuta Taranga — lakefront towers, rooftop amenities and gardens. Tap to enlarge.',
  alternates: { canonical: '/gallery/' },
  openGraph: {
    title: 'Gallery | Makuta Taranga',
    description:
      'Renders of Makuta Taranga — lakefront towers, rooftop amenities and gardens. Tap to enlarge.',
    url: '/gallery/',
  },
};

export default function Page() {
  return <PageClient />;
}
