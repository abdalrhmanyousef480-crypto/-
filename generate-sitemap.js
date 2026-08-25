// Generates sitemap.xml from data.js content (run with node)
const fs = require('fs');
const vm = require('vm');

const dataCode = fs.readFileSync(__dirname + '/data.js', 'utf8')
  + '\nmodule.exports = { STORES, CATEGORIES, COUPONS, BLOG_POSTS };';
const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox);
Object.assign(sandbox, sandbox.module.exports);

const BASE = "https://www.couponeta.example";
const staticPages = ["/", "/coupons", "/stores", "/categories", "/blog", "/about", "/contact", "/privacy", "/terms", "/affiliate-disclosure"];

const urls = [
  ...staticPages.map(p => ({ loc: `${BASE}/#${p}`, priority: p === "/" ? "1.0" : "0.8" })),
  ...sandbox.STORES.map(s => ({ loc: `${BASE}/#/store/${s.slug}`, priority: "0.7" })),
  ...sandbox.CATEGORIES.map(c => ({ loc: `${BASE}/#/category/${c.slug}`, priority: "0.7" })),
  ...sandbox.COUPONS.map(c => ({ loc: `${BASE}/#/coupon/${c.slug}`, priority: "0.6" })),
  ...sandbox.BLOG_POSTS.map(p => ({ loc: `${BASE}/#/blog/${p.slug}`, priority: "0.6" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(__dirname + '/sitemap.xml', xml);
console.log(`sitemap.xml generated with ${urls.length} URLs`);
