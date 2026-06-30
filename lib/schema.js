// Shared schema.org / JSON-LD building blocks. One source of truth for NAP
// (name/address/phone), so Organization, LocalBusiness and BreadcrumbList stay
// consistent across every page. All absolute URLs derive from lib/site.js.
import { SITE_URL, OG_IMAGE } from './site';

const STREET = 'IDL Road, Opp. IDL Lake, Habeeb Nagar, Moosapet';
const POSTAL = {
  '@type': 'PostalAddress',
  streetAddress: STREET,
  addressLocality: 'Hyderabad',
  addressRegion: 'Telangana',
  postalCode: '500072',
  addressCountry: 'IN',
};
const GEO = { '@type': 'GeoCoordinates', latitude: '17.486', longitude: '78.411' };
const PHONE = '+91-90596-76464';

// The developer brand behind the project.
export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Makuta Developers',
  url: 'https://www.makutadevelopers.com',
  slogan: 'Crown of Excellence',
  logo: `${SITE_URL}/assets/img/makuta.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: PHONE,
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['en', 'te', 'hi'],
  },
};

// The on-site sales office — physical NAP for local search / Google Business.
export const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${SITE_URL}/#salesoffice`,
  name: 'Makuta Taranga — Sales Office',
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: PHONE,
  email: 'sales@makutataranga.com',
  priceRange: '₹₹₹',
  address: POSTAL,
  geo: GEO,
  areaServed: { '@type': 'City', name: 'Hyderabad' },
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:30',
      closes: '19:00',
    },
  ],
};

// BreadcrumbList from an ordered [{ name, path }] trail (path like '/location/').
export function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

// BlogPosting / Article for a single journal post. `post` is a lib/blog record.
export function blogPosting(post) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.description,
    image: post.cover ? `${SITE_URL}${post.cover}` : OG_IMAGE,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: { '@type': 'Organization', name: post.author || 'Makuta Developers' },
    publisher: { '@id': `${SITE_URL}/#organization` },
    keywords: (post.tags || []).join(', ') || undefined,
  };
}

// FAQPage from an ordered [{ q, a }] list (a = plain-text answer).
export function faqPage(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

// Serialise for dangerouslySetInnerHTML.
export function ld(obj) {
  return { __html: JSON.stringify(obj) };
}
