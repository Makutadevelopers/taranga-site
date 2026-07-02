// FAQ content lives in content/faq.json so it can be edited in the CMS at /admin
// (Journal author → "FAQs"). Imported at build time, so both the server Journal
// page (for the FAQPage JSON-LD) and the client <Faq> accordion share one list.
import faqData from '@/content/faq.json';

export const FAQ_ITEMS = faqData.items;
