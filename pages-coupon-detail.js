/* ============================================================
   COUPON DETAIL PAGE
   ============================================================ */
function CouponPage({ slug }) {
  const { t, locale } = useLang();
  const coupon = getCouponBySlug(slug);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyCode = useCopyCode();

  useEffect(() => { trackEvent("coupon_view", { slug }); }, [slug]);

  if (!coupon) return h(NotFoundPage, null);

  const store = getStore(coupon.store);
  const title = coupon.title[locale] || coupon.title.en;
  const desc = coupon.desc[locale] || coupon.desc.en;
  const terms = coupon.terms[locale] || coupon.terms.en;
  const relatedCoupons = COUPONS.filter((c) => c.id !== coupon.id && c.store === coupon.store).slice(0, 3);
  const relatedFromCategory = COUPONS.filter((c) => c.id !== coupon.id && c.store !== coupon.store && getStore(c.store).category === store.category).slice(0, 3);
  const relatedStores = STORES.filter((s) => s.category === store.category && s.id !== store.id).slice(0, 3);

  const handleReveal = () => { setRevealed(true); trackEvent("code_reveal", { couponId: coupon.id }); };
  const handleUse = () => {
    if (coupon.code) { copyCode(coupon.code, coupon.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    trackEvent("affiliate_click", { couponId: coupon.id, storeId: coupon.store });
    window.open(coupon.affiliateUrl || coupon.storeUrl, "_blank", "noopener,noreferrer");
  };

  const faqItems = [
    { q: locale === "ar" ? "كيف أستخدم هذا الكود؟" : "How do I use this code?",
      a: locale === "ar" ? "اضغط «إظهار الكود» لنسخه، ثم ستنتقل تلقائيًا إلى موقع المتجر لإدخاله عند الدفع." : "Click \"Show Code\" to copy it, then you'll be taken to the store automatically to enter it at checkout." },
    { q: locale === "ar" ? "ماذا أفعل إذا لم يعمل الكود؟" : "What if the code doesn't work?",
      a: locale === "ar" ? "تحقق من الشروط أدناه، فقد يقتصر الكود على منتجات أو عملاء معينين. جرّب كوبونًا آخر من نفس المتجر أدناه." : "Check the terms below — the code may be limited to certain products or customers. Try another coupon from the same store below." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question", name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return h(React.Fragment, null, [
    h(PageMeta, {
      key: "meta",
      title: `${title} — ${store.name} | ${t("site.name")}`,
      description: desc,
      jsonLd,
    }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px", paddingBottom: "56px" } }, [
      h(Breadcrumbs, {
        key: "bc",
        items: [
          { label: t("nav.stores"), to: "/stores" },
          { label: store.name, to: `/store/${store.slug}` },
          { label: title },
        ],
      }),

      h("div", { key: "grid", style: { display: "grid", gridTemplateColumns: "1fr", gap: "32px", maxWidth: "780px" } }, [

        h("div", { key: "card", className: "card", style: { padding: "28px" } }, [
          h("div", { key: "top", style: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" } }, [
            h(Link, { key: "logo", to: `/store/${store.slug}`, className: "store-header-logo", style: { width: "60px", height: "60px" } },
              h("img", { src: store.logo, alt: store.name })
            ),
            h("div", { key: "info" }, [
              h(Link, { key: "name", to: `/store/${store.slug}`, style: { fontWeight: 700, color: "var(--color-primary)", fontSize: "15px" } }, store.name),
              h("div", { key: "discount", className: "coupon-discount", style: { fontSize: "20px" } }, coupon.discount),
            ]),
            coupon.verified && h("span", { key: "v", className: "badge badge-success", style: { marginInlineStart: "auto" } }, [h(Icon, { key: "i", name: "checkCircle", size: 13 }), t("coupon.verified")]),
          ]),

          h("h1", { key: "title", style: { fontSize: "21px", marginBottom: "10px" } }, title),
          h("p", { key: "desc", style: { color: "var(--color-text-muted)", fontSize: "14.5px", lineHeight: 1.6, marginBottom: "20px" } }, desc),

          h("div", { key: "metarow", style: { display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "22px", fontSize: "13px", color: "var(--color-text-muted)" } }, [
            h("span", { key: "1" }, [h(Icon, { key: "i", name: "clock", size: 14, style: { verticalAlign: "-2px", marginInlineEnd: "4px" } }), expiryLabel(coupon.expirationDate, t)]),
            h("span", { key: "2" }, [h(Icon, { key: "i", name: "checkCircle", size: 14, style: { verticalAlign: "-2px", marginInlineEnd: "4px" } }), `${t("coupon.lastChecked")}: ${formatDate("2026-08-24", locale)}`]),
            h("span", { key: "3", className: "badge badge-neutral" }, t(`coupon.type.${coupon.type}`)),
          ]),

          !revealed
            ? h("button", { key: "reveal", className: "btn btn-primary btn-lg btn-block", onClick: handleReveal }, [
                coupon.code
                  ? h(React.Fragment, { key: "f" }, [h(Icon, { key: "i", name: "tag", size: 18 }), t("coupon.showCode")])
                  : h(React.Fragment, { key: "f" }, [h(Icon, { key: "i", name: "externalLink", size: 18 }), t("coupon.getDeal")]),
              ])
            : coupon.code
              ? h("div", { key: "codebox", className: "coupon-code-box", style: { borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" } }, [
                  h("div", { key: "code", className: "coupon-code-text", style: { fontSize: "20px", padding: "18px 14px" } }, coupon.code),
                  h("button", {
                    key: "copy", className: "coupon-code-copybtn" + (copied ? " copied" : ""), onClick: handleUse, style: { fontSize: "14.5px", padding: "18px 22px" },
                  }, [h(Icon, { key: "i", name: copied ? "check" : "externalLink", size: 16 }), copied ? t("coupon.copied") : t("coupon.useCode")]),
                ])
              : h("button", { key: "go", className: "btn btn-primary btn-lg btn-block", onClick: handleUse }, [h(Icon, { key: "i", name: "externalLink", size: 18 }), t("coupon.useCode")]),
        ]),

        h("div", { key: "terms", className: "prose" }, [
          h("h2", { key: "t" }, t("coupon.terms")),
          h("p", { key: "p" }, terms),
        ]),

        h("div", { key: "faq" }, [
          h("h2", { key: "t", style: { fontSize: "19px", marginBottom: "8px" } }, t("section.faq")),
          h(FAQAccordion, { key: "acc", items: faqItems }),
        ]),

        (relatedCoupons.length > 0 || relatedFromCategory.length > 0) && h("div", { key: "related" }, [
          h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedCoupons")),
          h("div", { key: "grid", className: "grid grid-3" }, [...relatedCoupons, ...relatedFromCategory].slice(0, 3).map((c) => h(CouponCard, { key: c.id, coupon: c }))),
        ]),

        relatedStores.length > 0 && h("div", { key: "relstores" }, [
          h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedStores")),
          h("div", { key: "grid", className: "grid grid-4" }, relatedStores.map((s) => h(StoreCard, { key: s.id, store: s }))),
        ]),
      ]),
    ]),
  ]);
}
