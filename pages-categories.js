/* ============================================================
   CATEGORIES LISTING PAGE
   ============================================================ */
function CategoriesPage() {
  const { t, locale } = useLang();
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("nav.categories")} — ${t("site.name")}`, description: t("section.categories.sub") }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px", paddingBottom: "56px" } }, [
      h(Breadcrumbs, { key: "bc", items: [{ label: t("nav.categories") }] }),
      h("h1", { key: "h1", style: { fontSize: "26px", marginBottom: "6px" } }, t("nav.categories")),
      h("p", { key: "sub", style: { color: "var(--color-text-muted)", fontSize: "14.5px", marginBottom: "22px" } }, t("section.categories.sub")),
      h("div", { key: "grid", className: "grid grid-4" }, CATEGORIES.map((c) => h(CategoryCard, { key: c.id, category: c }))),
    ]),
  ]);
}

/* ============================================================
   CATEGORY DETAIL PAGE
   ============================================================ */
function CategoryPage({ slug }) {
  const { t, locale } = useLang();
  const category = getCategoryBySlug(slug);
  if (!category) return h(NotFoundPage, null);

  const coupons = filterCoupons(couponsForCategory(category.id), { sort: "newest" });
  const stores = storesForCategory(category.id);
  const posts = postsForCategory(category.id);
  const name = category.name[locale] || category.name.en;
  const desc = category.desc[locale] || category.desc.en;

  const faqItems = [
    { q: locale === "ar" ? `كيف أجد أفضل كوبونات ${name}؟` : `How do I find the best ${name} coupons?`,
      a: locale === "ar" ? `تصفح القائمة أعلاه، وابحث عن العلامة الخضراء «تم التحقق» للحصول على أعلى فرصة نجاح.` : `Browse the list above and look for the green "Verified" badge for the highest chance of success.` },
    { q: locale === "ar" ? `هل تُحدّث كوبونات هذا التصنيف باستمرار؟` : `Are coupons in this category updated regularly?`,
      a: locale === "ar" ? `نعم، يضيف فريقنا كوبونات جديدة ويزيل المنتهية بشكل دوري.` : `Yes, our team adds new coupons and removes expired ones on an ongoing basis.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.categories"), item: window.location.origin + window.location.pathname + "#/categories" },
      { "@type": "ListItem", position: 2, name, item: window.location.href },
    ],
  };

  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${name} — ${t("site.name")}`, description: desc, jsonLd }),
    h("div", { key: "hero", className: "page-hero" },
      h("div", { className: "container" }, [
        h(Breadcrumbs, { key: "bc", items: [{ label: t("nav.categories"), to: "/categories" }, { label: name }] }),
        h("div", { key: "header", style: { display: "flex", alignItems: "center", gap: "16px" } }, [
          h("div", { key: "icon", className: "category-icon", style: { width: "56px", height: "56px" } }, h(Icon, { name: category.icon, size: 26 })),
          h("div", { key: "text" }, [
            h("h1", { key: "t", style: { fontSize: "24px" } }, name),
            h("p", { key: "d", style: { color: "var(--color-text-muted)", fontSize: "14px", marginTop: "4px", maxWidth: "560px" } }, desc),
          ]),
        ]),
      ])
    ),
    h("div", { key: "body", className: "container", style: { paddingTop: "36px", paddingBottom: "56px" } }, [
      coupons.length === 0
        ? h(EmptyState, { key: "empty", title: t("filters.noResults") })
        : h("div", { key: "grid", className: "grid grid-3", style: { marginBottom: "48px" } }, coupons.map((c) => h(CouponCard, { key: c.id, coupon: c }))),

      stores.length > 0 && h("div", { key: "stores", style: { marginBottom: "40px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("category.topStores")),
        h("div", { key: "grid", className: "grid grid-4" }, stores.map((s) => h(StoreCard, { key: s.id, store: s }))),
      ]),

      posts.length > 0 && h("div", { key: "posts", style: { marginBottom: "40px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("section.blog")),
        h("div", { key: "grid", className: "grid grid-3" }, posts.map((p) => h(BlogCard, { key: p.id, post: p }))),
      ]),

      h("div", { key: "faq", style: { maxWidth: "720px" } }, [
        h("h2", { key: "t", style: { fontSize: "20px", marginBottom: "8px" } }, t("section.faq")),
        h(FAQAccordion, { key: "acc", items: faqItems }),
      ]),
    ]),
  ]);
}
