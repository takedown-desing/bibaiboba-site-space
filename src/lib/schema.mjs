// JSON-LD @graph из шапки черновика. FAQ и title переносятся слово в слово (контракт пайплайна).
import { CONTACTS, SITE, AUTHORS, absUrl } from './site.mjs';

export function buildGraph(d) {
  const url = absUrl(d.url);
  const graph = [];
  graph.push({
    '@type': 'Organization', '@id': SITE.orgId, name: SITE.name, description: SITE.descriptor,
    url: absUrl('/'), areaServed: { '@type': 'Country', name: 'Россия' },
    founder: [{ '@id': AUTHORS.aleksey.id }, { '@id': AUTHORS.valentin.id }],
  });
  graph.push({ '@type': 'WebSite', '@id': absUrl('/') + '#website', url: absUrl('/'), name: SITE.name, inLanguage: 'ru-RU', publisher: { '@id': SITE.orgId } });
  const authorKeys = d.author === 'both' ? ['aleksey', 'valentin'] : [d.author || 'aleksey'];
  for (const k of ['aleksey', 'valentin']) {
    const a = AUTHORS[k];
    const p = { '@type': 'Person', '@id': a.id, name: a.name, jobTitle: a.role, url: absUrl(a.url), worksFor: { '@id': SITE.orgId }, ...(a.photo ? { image: absUrl(a.photo) } : {}), ...(CONTACTS[k] ? { sameAs: CONTACTS[k].filter((c) => c.kind !== 'mail').map((c) => c.url) } : {}) };
    if (d.type === 'person' && d.person && d.url === a.url) {
      p.jobTitle = d.person.job_title || p.jobTitle;
      if (d.person.knows_about) p.knowsAbout = d.person.knows_about;
      if (d.person.same_as) p.sameAs = d.person.same_as;
    }
    graph.push(p);
  }
  const pageType = d.type === 'about' ? 'AboutPage' : d.type === 'contact' ? 'ContactPage' : d.type === 'person' ? 'ProfilePage' : d.type === 'hub' ? 'CollectionPage' : 'WebPage';
  const page = {
    '@type': pageType, '@id': url + '#webpage', url, name: d.title, description: d.description, inLanguage: 'ru-RU',
    isPartOf: { '@id': absUrl('/') + '#website' }, dateModified: String(d.date_modified || '2026-10-03'),
    author: authorKeys.map((k) => ({ '@id': AUTHORS[k].id })),
  };
  if (d.type === 'person') page.mainEntity = { '@id': (d.url === AUTHORS.valentin.url ? AUTHORS.valentin : AUTHORS.aleksey).id };
  graph.push(page);
  if (d.breadcrumbs?.length) {
    graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumbs', itemListElement: d.breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: absUrl(b.url) })) });
  }
  if (d.service && String(d.type).startsWith('service')) {
    graph.push({
      '@type': 'Service', '@id': url + '#service', name: d.service.name, serviceType: d.service.service_type, description: d.service.description,
      provider: { '@id': SITE.orgId }, areaServed: { '@type': 'Country', name: 'Россия' }, url,
    });
  }
  if (d.type === 'case' && d.case) {
    graph.push({ '@type': 'Article', '@id': url + '#article', headline: d.title, about: d.case.niche, author: authorKeys.map((k) => ({ '@id': AUTHORS[k].id })), publisher: { '@id': SITE.orgId }, dateModified: String(d.date_modified || '2026-10-03'), mainEntityOfPage: { '@id': url + '#webpage' } });
  }
  if (d.faq?.length) {
    graph.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
