/* ============================================================
   COUPON CARD — the most important UI piece on the site.
   Two-phase reveal: "Show Code" button -> revealed code + copy.
   Clicking "Use Code" copies the code (if any) then opens the
   affiliate link in a new tab, so the user never loses the code.
   ============================================================ */

function CouponCard({ coupon, showStore = true }) {
  const { t, locale } = useLang();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyCode = useCopyCode();
  const store = getStore(coupon.store);
  const days = daysUntil(coupon.expirationDate);
  const isExpiringSoon = days <= 3 && days >= 0;

  const handleReveal = () => {
    setRevealed(true);
    trackEvent("code_reveal", { couponId: coupon.id });
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    copyCode(coupon.code, coupon.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = (e) => {
    e.stopPropagation();
    if (coupon.code) copyCode(coupon.code, coupon.id);
    trackEvent("affiliate_click", { couponId: coupon.id, storeId: coupon.store });
    window.open(coupon.affiliateUrl || coupon.storeUrl, "_blank", "noopener,noreferrer");
  };

  const title = coupon.title[locale] || coupon.title.en;
  const desc = coupon.desc[locale] || coupon.desc.en;

  return h("div", { className: "card card-hover coupon-card has-code" + (coupon.featured ? " featured" : "") }, [
    h("div", { key: "badges", className: "coupon-card-badges" }, [
      coupon.verified
        ? h("span", { key: "v", className: "badge badge-success" }, [h(Icon, { key: "i", name: "checkCircle", size: 12 }), t("coupon.verified")])
        : null,
      isExpiringSoon ? h("span", { key: "e", className: "badge badge-warning" }, [h(Icon, { key: "i", name: "clock", size: 12 }), expiryLabel(coupon.expirationDate, t)]) : null,
    ]),
    h("div", { key: "top", className: "coupon-card-top" }, [
      showStore && store && h(Link, { key: "logo", to: `/store/${store.slug}`, className: "coupon-store-logo" },
        h("img", { src: store.logo, alt: store.name, loading: "lazy" })
      ),
      h("div", { key: "meta" }, [
        showStore && store && h(Link, { key: "name", to: `/store/${store.slug}`, className: "coupon-store-name" }, store.name),
        h("div", { key: "discount", className: "coupon-discount" }, coupon.discount),
      ]),
    ]),
    h(Link, { key: "title", to: `/coupon/${coupon.slug}`, className: "coupon-title" }, title),
    h("p", { key: "desc", className: "coupon-desc" }, desc),
    h("div", { key: "metarow", className: "coupon-meta-row" }, [
      h("span", { key: "type", className: "badge badge-neutral" }, t(`coupon.type.${coupon.type}`)),
      !isExpiringSoon && h("span", { key: "exp", className: "coupon-expiry" }, expiryLabel(coupon.expirationDate, t)),
    ]),

    h("div", { key: "perf", className: "coupon-perforation" }),

    !revealed
      ? h("button", { key: "reveal", className: "coupon-reveal-btn", onClick: handleReveal }, [
          coupon.code
            ? h(React.Fragment, { key: "f" }, [h(Icon, { key: "i", name: "tag", size: 17 }), t("coupon.showCode")])
            : h(React.Fragment, { key: "f" }, [h(Icon, { key: "i", name: "externalLink", size: 17 }), t("coupon.getDeal")]),
        ])
      : coupon.code
        ? h("div", { key: "codebox", className: "coupon-code-box" }, [
            h("div", { key: "code", className: "coupon-code-text" }, coupon.code),
            h("button", {
              key: "copy", className: "coupon-code-copybtn" + (copied ? " copied" : ""), onClick: handleUse,
              "aria-label": t("coupon.copyAndGo"),
            }, [
              h(Icon, { key: "i", name: copied ? "check" : "externalLink", size: 15 }),
              copied ? t("coupon.copied") : t("coupon.useCode"),
            ]),
          ])
        : h("button", { key: "go", className: "coupon-reveal-btn", onClick: handleUse }, [
            h(Icon, { key: "i", name: "externalLink", size: 17 }), t("coupon.useCode"),
          ]),
  ]);
}

/* ============================================================
   STORE CARD
   ============================================================ */
function StoreCard({ store }) {
  const { t } = useLang();
  const count = couponsForStore(store.id).length;
  return h(Link, { to: `/store/${store.slug}`, className: "card card-hover store-card" }, [
    h("div", { key: "logo", className: "store-logo-wrap" }, h("img", { src: store.logo, alt: store.name, loading: "lazy" })),
    h("div", { key: "name", className: "store-name" }, store.name),
    h("div", { key: "count", className: "store-count" }, `${count} ${t("store.couponsCount")}`),
  ]);
}

/* ============================================================
   CATEGORY CARD
   ============================================================ */
function CategoryCard({ category }) {
  const { t, locale } = useLang();
  const count = couponsForCategory(category.id).length;
  return h(Link, { to: `/category/${category.slug}`, className: "card card-hover category-card" }, [
    h("div", { key: "icon", className: "category-icon" }, h(Icon, { name: category.icon, size: 21 })),
    h("div", { key: "name", className: "category-name" }, category.name[locale] || category.name.en),
    h("div", { key: "count", className: "category-count" }, `${count} ${locale === "ar" ? "كوبون" : "coupons"}`),
  ]);
}

/* ============================================================
   BLOG CARD
   ============================================================ */
function BlogCard({ post }) {
  const { t, locale } = useLang();
  const cat = getCategory(post.category);
  return h(Link, { to: `/blog/${post.slug}`, className: "card card-hover blog-card" }, [
    h("img", { key: "img", src: post.image, alt: "", className: "blog-card-img", loading: "lazy" }),
    h("div", { key: "body", className: "blog-card-body" }, [
      cat && h("span", { key: "cat", className: "badge badge-accent", style: { alignSelf: "flex-start" } }, cat.name[locale] || cat.name.en),
      h("h3", { key: "title", className: "blog-card-title" }, post.title[locale] || post.title.en),
      h("p", { key: "excerpt", className: "blog-card-excerpt" }, post.excerpt[locale] || post.excerpt.en),
      h("div", { key: "meta", className: "blog-card-meta" }, [
        h("span", { key: "d" }, formatDate(post.date, locale)),
        h("span", { key: "sep" }, "·"),
        h("span", { key: "r" }, post.readingTime[locale] || post.readingTime.en),
      ]),
    ]),
  ]);
}
