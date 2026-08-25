/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage() {
  const { t, locale } = useLang();
  const [query, setQuery] = useState("");

  const popularStores = STORES.filter((s) => s.featured);
  const bestCoupons = filterCoupons(COUPONS.filter((c) => c.featured), { sort: "highestDiscount" }).slice(0, 6);
  const latestDeals = filterCoupons(COUPONS, { sort: "newest" }).slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/coupons?q=${encodeURIComponent(query.trim())}`);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t("site.name"),
    url: window.location.origin + window.location.pathname,
    potentialAction: {
      "@type": "SearchAction",
      target: window.location.origin + window.location.pathname + "#/coupons?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqItems = [
    { q: locale === "ar" ? "هل استخدام كوبونيتا مجاني؟" : "Is Couponeta free to use?",
      a: locale === "ar" ? "نعم، تصفح الموقع والحصول على أكواد الخصم مجاني بالكامل ولن يُطلب منك أي دفع." : "Yes, browsing the site and getting discount codes is completely free — you'll never be asked to pay." },
    { q: locale === "ar" ? "كيف تتأكدون أن الكوبون يعمل؟" : "How do you make sure a coupon works?",
      a: locale === "ar" ? "يراجع فريقنا الأكواد بشكل دوري بالتحقق الفعلي منها في سلة الشراء، ونضع علامة «تم التحقق» على ما يعمل بنجاح." : "Our team periodically reviews codes by actually testing them at checkout, and marks working codes as verified." },
    { q: locale === "ar" ? "لماذا لا يعمل الكود أحيانًا؟" : "Why does a code sometimes not work?",
      a: locale === "ar" ? "قد ينتهي الكود أو يقتصر على منتجات معينة أو عملاء جدد فقط. تحقق من الشروط والأحكام في صفحة الكوبون." : "A code may have expired or be limited to certain products or new customers only. Check the terms on the coupon page." },
  ];

  return h(React.Fragment, null, [
    h(PageMeta, {
      key: "meta",
      title: `${t("site.name")} — ${t("hero.title")}`,
      description: t("hero.subtitle"),
      jsonLd,
    }),
    h("section", { key: "hero", className: "hero" },
      h("div", { className: "container" }, [
        h("h1", { key: "title", className: "hero-title" }, t("hero.title")),
        h("p", { key: "sub", className: "hero-subtitle" }, t("hero.subtitle")),
        h("form", { key: "search", className: "hero-search", onSubmit: handleSearchSubmit }, [
          h("div", { key: "box", className: "hero-search-box" }, [
            h(Icon, { key: "i", name: "search", size: 19, style: { color: "var(--color-text-faint)" } }),
            h("input", {
              key: "input", type: "text", value: query, onChange: (e) => setQuery(e.target.value),
              placeholder: t("search.placeholder"), "aria-label": t("search.placeholder"),
            }),
            h("button", { key: "btn", type: "submit", className: "btn btn-primary" }, t("search.placeholderShort")),
          ]),
        ]),
        h("div", { key: "stats", className: "hero-stats" }, [
          h("div", { key: "1" }, [h("div", { key: "n", className: "hero-stat-num" }, SITE_STATS.stores + "+"), h("div", { key: "l", className: "hero-stat-label" }, t("hero.stat.stores"))]),
          h("div", { key: "2" }, [h("div", { key: "n", className: "hero-stat-num" }, SITE_STATS.coupons + "+"), h("div", { key: "l", className: "hero-stat-label" }, t("hero.stat.coupons"))]),
          h("div", { key: "3" }, [h("div", { key: "n", className: "hero-stat-num" }, SITE_STATS.categories), h("div", { key: "l", className: "hero-stat-label" }, t("hero.stat.categories"))]),
        ]),
      ])
    ),

    h("section", { key: "stores", className: "section" },
      h("div", { className: "container" }, [
        h(SectionHead, { key: "head", title: t("section.popularStores"), sub: t("section.popularStores.sub"), viewAllTo: "/stores", viewAllLabel: t("viewAllStores") }),
        h("div", { key: "grid", className: "grid grid-6" }, popularStores.map((s) => h(StoreCard, { key: s.id, store: s }))),
      ])
    ),

    h("section", { key: "coupons", className: "section", style: { background: "var(--color-surface-alt)" } },
      h("div", { className: "container" }, [
        h(SectionHead, { key: "head", title: t("section.bestCoupons"), sub: t("section.bestCoupons.sub"), viewAllTo: "/coupons", viewAllLabel: t("viewAllCoupons") }),
        h("div", { key: "grid", className: "grid grid-3" }, bestCoupons.map((c) => h(CouponCard, { key: c.id, coupon: c }))),
      ])
    ),

    h("section", { key: "categories", className: "section" },
      h("div", { className: "container" }, [
        h(SectionHead, { key: "head", title: t("section.categories"), sub: t("section.categories.sub"), viewAllTo: "/categories", viewAllLabel: t("viewAllCategories") }),
        h("div", { key: "grid", className: "grid grid-4" }, CATEGORIES.slice(0, 8).map((c) => h(CategoryCard, { key: c.id, category: c }))),
      ])
    ),

    h("section", { key: "deals", className: "section", style: { background: "var(--color-surface-alt)" } },
      h("div", { className: "container" }, [
        h(SectionHead, { key: "head", title: t("section.latestDeals"), sub: t("section.latestDeals.sub"), viewAllTo: "/coupons", viewAllLabel: t("viewAllCoupons") }),
        h("div", { key: "grid", className: "grid grid-4" }, latestDeals.map((c) => h(CouponCard, { key: c.id, coupon: c }))),
      ])
    ),

    h("section", { key: "why", className: "section" },
      h("div", { className: "container" }, [
        h("div", { key: "head", style: { textAlign: "center", marginBottom: "32px" } },
          h("h2", { className: "section-title" }, t("section.whyUs"))
        ),
        h("div", { key: "grid", className: "grid grid-4" }, [
          { icon: "bolt", key: "speed" }, { icon: "shield", key: "verified" }, { icon: "gift", key: "free" }, { icon: "refresh", key: "updated" },
        ].map((item) => h("div", { key: item.key, className: "card", style: { padding: "24px 20px", textAlign: "center" } }, [
          h("div", { key: "icon", className: "category-icon", style: { margin: "0 auto 14px" } }, h(Icon, { name: item.icon, size: 21 })),
          h("h3", { key: "t", style: { fontSize: "15px", marginBottom: "6px" } }, t(`why.${item.key}.title`)),
          h("p", { key: "d", style: { fontSize: "13px", color: "var(--color-text-muted)" } }, t(`why.${item.key}.desc`)),
        ]))),
      ])
    ),

    h("section", { key: "blog", className: "section", style: { background: "var(--color-surface-alt)" } },
      h("div", { className: "container" }, [
        h(SectionHead, { key: "head", title: t("section.blog"), sub: t("section.blog.sub"), viewAllTo: "/blog", viewAllLabel: t("viewAllArticles") }),
        h("div", { key: "grid", className: "grid grid-3" }, BLOG_POSTS.map((p) => h(BlogCard, { key: p.id, post: p }))),
      ])
    ),

    h("section", { key: "faq", className: "section" },
      h("div", { className: "container", style: { maxWidth: "760px" } }, [
        h("h2", { key: "t", className: "section-title", style: { textAlign: "center", marginBottom: "24px" } }, t("section.faq")),
        h(FAQAccordion, { key: "acc", items: faqItems }),
      ])
    ),
  ]);
}

/* ============================================================
   COUPONS LISTING PAGE
   ============================================================ */
function CouponsPage({ route }) {
  const { t, locale } = useLang();
  const initialQuery = route.params.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState("newest");

  useEffect(() => { setSearch(route.params.get("q") || ""); }, [route.params]);

  let results = COUPONS.filter((c) => c.active);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((c) => {
      const store = getStore(c.store);
      const title = (c.title[locale] || c.title.en).toLowerCase();
      return title.includes(q) || (store && store.name.toLowerCase().includes(q)) || c.code.toLowerCase().includes(q);
    });
  }
  results = filterCoupons(results, { filters, sort });

  return h(React.Fragment, null, [
    h(PageMeta, {
      key: "meta",
      title: `${t("nav.coupons")} — ${t("site.name")}`,
      description: t("section.bestCoupons.sub"),
    }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px" } }, [
      h(Breadcrumbs, { key: "bc", items: [{ label: t("nav.coupons") }] }),
      h("h1", { key: "h1", style: { fontSize: "26px", marginBottom: "6px" } }, t("nav.coupons")),
      h("p", { key: "sub", style: { color: "var(--color-text-muted)", fontSize: "14.5px", marginBottom: "22px" } }, t("section.bestCoupons.sub")),

      h("div", { key: "searchrow", style: { marginBottom: "18px", maxWidth: "420px" } },
        h("div", { style: { position: "relative" } }, [
          h(Icon, { key: "i", name: "search", size: 17, style: { position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "14px", color: "var(--color-text-faint)" } }),
          h("input", {
            key: "input", type: "text", className: "input", value: search,
            onChange: (e) => setSearch(e.target.value), placeholder: t("search.placeholder"),
            style: { paddingInlineStart: "40px" },
          }),
        ])
      ),
    ]),
    h("div", { key: "list", className: "container", style: { paddingBottom: "56px" } }, [
      h(FilterBar, { key: "filters", filters, setFilters, sort, setSort, resultCount: results.length }),
      results.length === 0
        ? h(EmptyState, { key: "empty", title: t("filters.noResults"), desc: t("filters.noResultsHint") })
        : h("div", { key: "grid", className: "grid grid-3" }, results.map((c) => h(CouponCard, { key: c.id, coupon: c }))),
    ]),
  ]);
}
