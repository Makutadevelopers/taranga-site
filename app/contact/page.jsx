import PageClient from './PageClient';
import { faqPage, breadcrumb, ld } from '@/lib/schema';

export const metadata = {
  title: 'Contact & FAQ | Makuta Taranga',
  description:
    'Contact Makuta Taranga — book a private site visit by IDL Lake, Moosapet, Hyderabad. Answers on configs, RERA, possession and home loans.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'Contact & FAQ | Makuta Taranga',
    description:
      'Contact Makuta Taranga — book a private site visit by IDL Lake, Moosapet, Hyderabad. Answers on configs, RERA, possession and home loans.',
    url: '/contact/',
  },
};

// Keep these in lockstep with the visible FAQ accordion in PageClient.jsx.
const FAQ = [
  {
    q: 'Where exactly is Makuta Taranga?',
    a: 'IDL Road, opposite IDL Lake, Habeeb Nagar, Moosapet, Hyderabad — 500072, between Kukatpally and Balanagar. Kukatpally metro is about 800 m away.',
  },
  {
    q: 'What configurations and sizes are available?',
    a: 'Spacious 3 and 4 BHK lakefront homes, many corner-facing, all with 10.35-ft ceilings and privacy foyers. Exact carpet areas and pricing are shared on enquiry.',
  },
  {
    q: 'Is the project RERA registered?',
    a: 'Yes — TS RERA P02200011012.',
  },
  {
    q: 'What is the possession timeline?',
    a: 'Construction is progressing on schedule; the committed possession timeline is shared on request and stated in your agreement.',
  },
  {
    q: 'Can I get a home loan? Which banks are approved?',
    a: 'Yes — the project is supported by leading banks and housing-finance companies. Our team will share the approved-financier list and help with the process.',
  },
  {
    q: 'How do I book a site visit?',
    a: 'Fill the enquiry form or tap “Come see it” anywhere on the site, and we will call you to arrange a convenient time. Visits are private and no-obligation.',
  },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqPage(FAQ))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }]))}
      />
      <PageClient />
    </>
  );
}
