/* ============================================================
   STORES LISTING PAGE — with alphabet navigation
   ============================================================ */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function StoresPage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState(null);

  const availableLetters = new Set(STORES.map((s) => s.name[0].toUpperCase()));

  let results = STORES;
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((s) => s.name.toLowerCase().includes(q));
  } else if (letter) {
    results = results.filter((s) => s.name[0].toUpperCase() === letter);
  }
  results = [...results].sort((a, b) => a.name.localeCompare(b.name));

  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("nav.stores")} — ${t("site.name")}`, description: t("section.popularStores.sub") }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px", paddingBottom: "56px" } }, [
      h(Breadcrumbs, { key: "bc", items: [{ label: t("nav.stores") }] }),
      h("h1", { key: "h1", style: { fontSize: "26px", marginBottom: "6px" } }, t("nav.stores")),
      h("p", { key: "sub", style: { color: "var(--color-text-muted)", fontSize: "14.5px", marginBottom: "22px" } }, t("section.popularStores.sub")),

      h("div", { key: "searchrow", style: { marginBottom: "20px", maxWidth: "420px" } },
        h("div", { style: { position: "relative" } }, [
          h(Icon, { key: "i", name: "search", size: 17, style: { position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "14px", color: "var(--color-text-faint)" } }),
          h("input", {
            key: "input", type: "text", className: "input", value: search,
            onChange: (e) => { setSearch(e.target.value); setLetter(null); },
            placeholder: t("search.placeholderShort"), style: { paddingInlineStart: "40px" },
          }),
        ])
      ),

      !search.trim() && h("div", { key: "alpha", className: "alpha-nav" }, [
        h("button", {
          key: "all", className: "alpha-btn" + (!letter ? " active" : ""), onClick: () => setLetter(null),
        }, t("alphabet.all")),
        ...ALPHABET.map((l) => h("button", {
          key: l, className: "alpha-btn" + (letter === l ? " active" : ""),
          disabled: !availableLetters.has(l), onClick: () => setLetter(l),
        }, l)),
      ]),

      results.length === 0
        ? h(EmptyState, { key: "empty", title: t("empty.title"), desc: t("empty.desc") })
        : h("div", { key: "grid", className: "grid grid-6" }, results.map((s) => h(StoreCard, { key: s.id, store: s }))),
    ]),
  ]);
}

/* ============================================================
   STORE DETAIL PAGE
   ============================================================ */
function StorePage({ slug }) {
  const { t, locale } = useLang();
  const store = getStoreBySlug(slug);

  if (!store) return h(NotFoundPage, null);

  const coupons = filterCoupons(couponsForStore(store.id), { sort: "newest" });
  const category = getCategory(store.category);
  const relatedStores = STORES.filter((s) => s.category === store.category && s.id !== store.id).slice(0, 4);
  const relatedCoupons = COUPONS.filter((c) => c.store !== store.id && getStore(c.store).category === store.category).slice(0, 3);
  const desc = store.desc[locale] || store.desc.en;

  const faqItems = [
    { q: locale === "ar" ? `هل جميع كوبونات ${store.name} تعمل؟` : `Do all ${store.name} coupons work?`,
      a: locale === "ar" ? `نراجع الكوبونات بانتظام، وتحمل الأكواد الموثقة علامة «تم التحقق». مع ذلك قد ينتهي كود بشكل مفاجئ، فإذا واجهت مشكلة جرّب كودًا آخر.` : `We review coupons regularly, and verified codes carry a "Verified" badge. Still, a code may expire unexpectedly — if one doesn't work, try another.` },
    { q: locale === "ar" ? `كيف أستخدم كود خصم ${store.name}؟` : `How do I use a ${store.name} coupon code?`,
      a: locale === "ar" ? `اضغط «إظهار الكود»، ثم انسخه، وسيتم توجيهك تلقائيًا إلى الموقع لإدخاله عند إتمام الطلب.` : `Click "Show Code", copy it, and you'll be taken to the store automatically to paste it at checkout.` },
    { q: locale === "ar" ? `هل يوجد شحن مجاني من ${store.name}؟` : `Does ${store.name} offer free shipping?`,
      a: locale === "ar" ? `تحقق من قائمة الكوبونات أعلاه، حيث نضيف عروض الشحن المجاني عند توفرها.` : `Check the coupon list above — we add free shipping offers whenever they're available.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.stores"), item: window.location.origin + window.location.pathname + "#/stores" },
      { "@type": "ListItem", position: 2, name: store.name, item: window.location.href },
    ],
  };

  return h(React.Fragment, null, [
    h(PageMeta, {
      key: "meta",
      title: `${t("store.bestCouponsFor")} ${store.name} — ${new Date().getFullYear()} | ${t("site.name")}`,
      description: desc,
      jsonLd,
    }),
    h("div", { key: "hero", className: "page-hero" },
      h("div", { className: "container" }, [
        h(Breadcrumbs, {
          key: "bc",
          items: [
            { label: t("nav.stores"), to: "/stores" },
            ...(category ? [{ label: category.name[locale] || category.name.en, to: `/category/${category.slug}` }] : []),
            { label: store.name },
          ],
        }),
        h("div", { key: "header", className: "store-header" }, [
          h("div", { key: "logo", className: "store-header-logo" }, h("img", { src: store.logo, alt: store.name })),
          h("div", { key: "info", style: { flex: 1, minWidth: "220px" } }, [
            h("h1", { key: "name", style: { fontSize: "24px" } }, store.name),
            h("p", { key: "desc", style: { color: "var(--color-text-muted)", fontSize: "14px", marginTop: "6px", maxWidth: "560px" } }, desc),
            h("div", { key: "meta", className: "store-header-meta" }, [
              h("span", { key: "1", className: "store-meta-item" }, [h("strong", { key: "n" }, coupons.length), " ", t("store.couponsCount")]),
              h("span", { key: "2", className: "store-meta-item" }, [t("store.lastUpdated"), ": ", h("strong", { key: "n" }, formatDate("2026-08-24", locale))]),
            ]),
          ]),
          h("a", { key: "cta", href: store.website, target: "_blank", rel: "noopener noreferrer", className: "btn btn-secondary" }, [
            h("span", { key: "label" }, t("store.visitStore")), h(Icon, { key: "i", name: "externalLink", size: 15 }),
          ]),
        ]),
      ])
    ),

    h("div", { key: "body", className: "container", style: { paddingTop: "36px", paddingBottom: "56px" } }, [
      h("h2", { key: "h2", style: { fontSize: "20px", marginBottom: "18px" } }, `${t("store.bestCouponsFor")} ${store.name}`),
      coupons.length === 0
        ? h(EmptyState, { key: "empty", title: t("filters.noResults") })
        : h("div", { key: "grid", className: "grid grid-3", style: { marginBottom: "48px" } }, coupons.map((c) => h(CouponCard, { key: c.id, coupon: c, showStore: false }))),

      h("div", { key: "about", className: "prose", style: { marginBottom: "40px" } }, [
        h("h2", { key: "t" }, `${t("store.about")} ${store.name}`),
        h("p", { key: "p" }, desc),
      ]),

      h("div", { key: "faq", style: { maxWidth: "720px", marginBottom: "48px" } }, [
        h("h2", { key: "t", style: { fontSize: "20px", marginBottom: "8px" } }, `${t("store.faq")} ${store.name}`),
        h(FAQAccordion, { key: "acc", items: faqItems }),
      ]),

      relatedStores.length > 0 && h("div", { key: "relstores", style: { marginBottom: "40px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedStores")),
        h("div", { key: "grid", className: "grid grid-4" }, relatedStores.map((s) => h(StoreCard, { key: s.id, store: s }))),
      ]),

      relatedCoupons.length > 0 && h("div", { key: "relcoupons" }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedCoupons")),
        h("div", { key: "grid", className: "grid grid-3" }, relatedCoupons.map((c) => h(CouponCard, { key: c.id, coupon: c }))),
      ]),
    ]),
  ]);
}
