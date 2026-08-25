/* ============================================================
   UTILITIES
   ============================================================ */

function getStore(id) { return STORES.find(s => s.id === id); }
function getCategory(id) { return CATEGORIES.find(c => c.id === id); }
function getStoreBySlug(slug) { return STORES.find(s => s.slug === slug); }
function getCategoryBySlug(slug) { return CATEGORIES.find(c => c.slug === slug); }
function getCouponBySlug(slug) { return COUPONS.find(c => c.slug === slug); }
function getPostBySlug(slug) { return BLOG_POSTS.find(p => p.slug === slug); }
function couponsForStore(storeId) { return COUPONS.filter(c => c.store === storeId && c.active); }
function couponsForCategory(catId) {
  const storeIds = STORES.filter(s => s.category === catId).map(s => s.id);
  return COUPONS.filter(c => storeIds.includes(c.store) && c.active);
}
function storesForCategory(catId) { return STORES.filter(s => s.category === catId); }
function postsForCategory(catId) { return BLOG_POSTS.filter(p => p.category === catId); }

function daysUntil(dateStr) {
  const today = new Date("2026-08-25T00:00:00Z");
  const target = new Date(dateStr + "T00:00:00Z");
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr, locale) {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function expiryLabel(dateStr, t) {
  const days = daysUntil(dateStr);
  if (days < 0) return t("coupon.expired");
  if (days === 0) return t("coupon.expiresToday");
  return `${t("coupon.expiresIn")} ${days} ${t("coupon.days")}`;
}

// Global search across stores, coupons, categories, articles
function globalSearch(query, locale) {
  const q = query.trim().toLowerCase();
  if (!q) return { stores: [], coupons: [], categories: [], articles: [] };

  const stores = STORES.filter(s => s.name.toLowerCase().includes(q)).slice(0, 5);
  const coupons = COUPONS.filter(c => {
    const title = (c.title[locale] || c.title.en).toLowerCase();
    const store = getStore(c.store);
    return title.includes(q) || (store && store.name.toLowerCase().includes(q)) || c.code.toLowerCase().includes(q);
  }).slice(0, 5);
  const categories = CATEGORIES.filter(c => (c.name[locale] || c.name.en).toLowerCase().includes(q)).slice(0, 5);
  const articles = BLOG_POSTS.filter(p => (p.title[locale] || p.title.en).toLowerCase().includes(q)).slice(0, 5);

  return { stores, coupons, categories, articles };
}

// Filter + sort coupons list
function filterCoupons(coupons, { filters = [], sort = "newest" } = {}) {
  let result = [...coupons];

  if (filters.includes("verified")) result = result.filter(c => c.verified);
  if (filters.includes("codes")) result = result.filter(c => c.type === "code");
  if (filters.includes("deals")) result = result.filter(c => c.type === "deal");
  if (filters.includes("cashback")) result = result.filter(c => c.type === "cashback");
  if (filters.includes("freeShipping")) {
    result = result.filter(c =>
      (c.title.en + c.desc.en).toLowerCase().includes("free shipping") ||
      (c.title.ar + c.desc.ar).includes("شحن مجاني")
    );
  }
  if (filters.includes("expiringSoon")) result = result.filter(c => daysUntil(c.expirationDate) <= 7);

  switch (sort) {
    case "highestDiscount":
      result.sort((a, b) => (parseInt(b.discount) || 0) - (parseInt(a.discount) || 0));
      break;
    case "expiringSoon":
      result.sort((a, b) => daysUntil(a.expirationDate) - daysUntil(b.expirationDate));
      break;
    case "mostUsed":
      result.sort((a, b) => (b.featured === true) - (a.featured === true));
      break;
    case "newest":
    default:
      result.sort((a, b) => b.id.localeCompare(a.id));
  }
  return result;
}

// simple analytics stub — logs events, ready to wire to real analytics later
function trackEvent(name, payload) {
  if (window.__DEBUG_ANALYTICS__) {
    console.log("[analytics]", name, payload);
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
}
