// Превращает директивы контента (:::definition, :::steps, :::stats, :::compare, :::practice, :::cta, :::cases, :::note)
// в семантические блоки и приводит ссылки к адресу сайта. Контракт: drafts/_context/content-format.md.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { visit } from 'unist-util-visit';

const AUTHOR_NAMES = { aleksey: 'Алексей Боровиков', valentin: 'Валентин Баранов', both: 'Алексей и Валентин' };

function loadCases(dir) {
  const map = {};
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!m) continue;
    try {
      const d = yaml.load(m[1]);
      if (d?.type === 'case' && d.case?.id) map[d.case.id] = { url: d.url, title: d.h1, ...d.case };
    } catch { /* пропуск битой шапки, её поймает check-content */ }
  }
  return map;
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default function remarkBlocks(options = {}) {
  const base = options.base || '';
  const casesDir = options.casesDir || path.resolve('src/content/pages');
  const withBase = (u) => (u.startsWith('/') ? (base + u).replace(/\/{2,}/g, '/') : u);
  let cases = null;

  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== 'containerDirective') return;
      const name = node.name;
      const attrs = node.attributes || {};
      const data = (node.data ||= {});
      const title = attrs.title;
      const titleNode = title ? { type: 'paragraph', data: { hProperties: { className: ['ig-title'] } }, children: [{ type: 'text', value: title }] } : null;

      if (name === 'definition') {
        data.hName = 'div';
        data.hProperties = { className: ['blk-definition'] };
      } else if (name === 'steps') {
        data.hName = 'section';
        data.hProperties = { className: ['ig', 'ig-steps'], 'aria-label': title || 'Этапы' };
        if (titleNode) node.children.unshift(titleNode);
      } else if (name === 'stats') {
        data.hName = 'section';
        data.hProperties = { className: ['ig', 'ig-stats'], 'aria-label': title || 'Цифры' };
        if (titleNode) node.children.unshift(titleNode);
      } else if (name === 'compare') {
        data.hName = 'section';
        data.hProperties = { className: ['ig', 'ig-compare'], 'aria-label': title || 'Сравнение' };
        if (titleNode) node.children.unshift(titleNode);
      } else if (name === 'practice') {
        data.hName = 'aside';
        data.hProperties = { className: ['blk-practice'] };
        const who = AUTHOR_NAMES[attrs.author] || AUTHOR_NAMES.aleksey;
        node.children.unshift({ type: 'paragraph', data: { hProperties: { className: ['blk-practice-label'] } }, children: [{ type: 'text', value: `Из практики · ${who}` }] });
      } else if (name === 'note') {
        data.hName = 'aside';
        data.hProperties = { className: ['blk-note'] };
      } else if (name === 'cta') {
        data.hName = 'div';
        data.hProperties = { className: ['blk-cta'] };
        const href = withBase(attrs.href || '/audit-besplatno/');
        node.children.push({
          type: 'paragraph',
          data: { hProperties: { className: ['blk-cta-action'] } },
          children: [{ type: 'link', url: href, data: { hProperties: { className: ['btn', 'btn-accent'], 'data-roll': attrs.label || 'Оставить заявку' } }, children: [{ type: 'text', value: attrs.label || 'Оставить заявку' }] }],
        });
      } else if (name === 'cases') {
        cases ||= loadCases(casesDir);
        const ids = String(attrs.ids || '').split(',').map((s) => s.trim()).filter(Boolean);
        const cards = ids.map((id) => cases[id]).filter(Boolean);
        const html = cards.length
          ? `<div class="case-grid cards" data-count="${cards.length}">${cards.map((c) => `<a class="case-card" href="${esc(withBase(c.url))}"><span class="case-niche">${esc(c.niche)}</span><span class="case-metric"><b>${esc(c.contacts)}</b> обращений за месяц</span><span class="case-metric"><b>${esc(c.contact_price)}</b> цена обращения</span>${c.deltas ? `<span class="case-delta">${esc(c.deltas)}</span>` : ''}<span class="case-more">Читать кейс</span></a>`).join('')}</div>`
          : '';
        parent.children.splice(index, 1, { type: 'html', value: html });
        return index;
      }
    });

    // Ссылки: внутренние получают базовый путь превью, внешние открываются в новой вкладке без передачи веса.
    visit(tree, 'link', (node) => {
      const url = node.url || '';
      if (url.startsWith('/')) {
        if (!url.startsWith(base + '/')) node.url = withBase(url);
      } else if (/^https?:\/\//.test(url)) {
        node.data ||= {};
        node.data.hProperties = { ...(node.data.hProperties || {}), target: '_blank', rel: 'nofollow noopener' };
      }
    });
  };
}

// rehype: таблицы в прокручиваемый контейнер, чтобы на телефоне не было горизонтального скролла страницы.
export function rehypeTableWrap() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent) return;
      if (parent.properties?.className?.includes?.('table-wrap')) return;
      parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'], tabIndex: 0 }, children: [node] };
    });
  };
}
