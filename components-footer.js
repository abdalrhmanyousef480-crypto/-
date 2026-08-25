/* ============================================================
   FOOTER + BREADCRUMBS + FAQ + STATE COMPONENTS
   ============================================================ */

function SiteFooter() {
  const { t, locale } = useLang();
  const year = 2026;
  return h("footer", { className: "site-footer" },
    h("div", { className: "container" }, [
      h("div", { key: "grid", className: "footer-grid" }, [
        h("div", { key: "brand" }, [
          h("div", { key: "logo", className: "logo", style: { color: "#fff", marginBottom: "12px" } }, [
            h("span", { key: "m", className: "logo-mark", style: { background: "rgba(255,255,255,0.14)" } }, "%"),
            h("span", { key: "t" }, t("site.name")),
          ]),
          h("p", { key: "tag", style: { fontSize: "13.5px", lineHeight: 1.7, maxWidth: "280px" } }, t("footer.tagline")),
          h("div", { key: "social", className: "footer-social", style: { marginTop: "18px" } }, [
            h("a", { key: "fb", href: "https://facebook.com", "aria-label": "Facebook", target: "_blank", rel: "noopener noreferrer" }, h(Icon, { name: "facebook", size: 16 })),
            h("a", { key: "ig", href: "https://instagram.com", "aria-label": "Instagram", target: "_blank", rel: "noopener noreferrer" }, h(Icon, { name: "instagram", size: 16 })),
            h("a", { key: "tw", href: "https://twitter.com", "aria-label": "Twitter", target: "_blank", rel: "noopener noreferrer" }, h(Icon, { name: "twitter", size: 16 })),
          ]),
        ]),
        h("div", { key: "explore" }, [
          h("div", { key: "t", className: "footer-col-title" }, t("footer.explore")),
          h(Link, { key: "1", to: "/coupons", className: "footer-link" }, t("nav.coupons")),
          h(Link, { key: "2", to: "/stores", className: "footer-link" }, t("nav.stores")),
          h(Link, { key: "3", to: "/categories", className: "footer-link" }, t("nav.categories")),
          h(Link, { key: "4", to: "/blog", className: "footer-link" }, t("nav.blog")),
        ]),
        h("div", { key: "company" }, [
          h("div", { key: "t", className: "footer-col-title" }, t("footer.company")),
          h(Link, { key: "1", to: "/about", className: "footer-link" }, t("nav.about")),
          h(Link, { key: "2", to: "/contact", className: "footer-link" }, t("nav.contact")),
        ]),
        h("div", { key: "legal" }, [
          h("div", { key: "t", className: "footer-col-title" }, t("footer.legal")),
          h(Link, { key: "1", to: "/privacy", className: "footer-link" }, t("privacy.title")),
          h(Link, { key: "2", to: "/terms", className: "footer-link" }, t("terms.title")),
          h(Link, { key: "3", to: "/affiliate-disclosure", className: "footer-link" }, t("affiliateDisclosure.title")),
        ]),
      ]),
      h("div", { key: "bottom", className: "footer-bottom" }, [
        h("span", { key: "c" }, `© ${year} ${t("site.name")}. ${t("footer.rights")}`),
      ]),
      h("p", { key: "aff", className: "footer-affiliate-note" }, t("footer.affiliateNote")),
    ])
  );
}

function Breadcrumbs({ items }) {
  const { t } = useLang();
  const { locale } = useLang();
  const ChevIcon = locale === "ar" ? "chevronStart" : "chevronEnd";
  return h("nav", { className: "breadcrumbs", "aria-label": "Breadcrumb" },
    [{ label: t("breadcrumb.home"), to: "/" }, ...items].map((item, i, arr) =>
      h(React.Fragment, { key: i }, [
        i === arr.length - 1
          ? h("span", { key: "cur", "aria-current": "page" }, item.label)
          : h(Link, { key: "link", to: item.to }, item.label),
        i < arr.length - 1 && h("span", { key: "sep", className: "sep" }, h(Icon, { name: ChevIcon, size: 13 })),
      ])
    )
  );
}

function SectionHead({ title, sub, viewAllTo, viewAllLabel }) {
  return h("div", { className: "section-head" }, [
    h("div", { key: "left" }, [
      h("h2", { key: "t", className: "section-title" }, title),
      sub && h("p", { key: "s", className: "section-sub" }, sub),
    ]),
    viewAllTo && h(Link, { key: "cta", to: viewAllTo, className: "btn btn-outline btn-sm" }, [
      viewAllLabel, h(Icon, { key: "i", name: "arrowEnd", size: 15 }),
    ]),
  ]);
}

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  return h("div", null, items.map((item, i) =>
    h("div", { key: i, className: "faq-item" }, [
      h("button", {
        key: "q", className: "faq-question", "aria-expanded": openIndex === i,
        onClick: () => setOpenIndex(openIndex === i ? -1 : i),
      }, [
        h("span", { key: "t" }, item.q),
        h(Icon, { key: "i", name: "close", size: 18, className: "faq-icon" + (openIndex === i ? " open" : "") }),
      ]),
      openIndex === i && h("div", { key: "a", className: "faq-answer" }, item.a),
    ])
  ));
}

function EmptyState({ title, desc, icon = "search" }) {
  return h("div", { className: "state-block" }, [
    h(Icon, { key: "i", name: icon, size: 40, className: "state-icon" }),
    h("h3", { key: "t", style: { fontSize: "16px", color: "var(--color-primary)" } }, title),
    desc && h("p", { key: "d", style: { fontSize: "13.5px" } }, desc),
  ]);
}

function ErrorState({ title, desc, onRetry }) {
  const { t } = useLang();
  return h("div", { className: "state-block" }, [
    h(Icon, { key: "i", name: "alertCircle", size: 40, className: "state-icon" }),
    h("h3", { key: "t", style: { fontSize: "16px", color: "var(--color-primary)" } }, title),
    desc && h("p", { key: "d", style: { fontSize: "13.5px" } }, desc),
    onRetry && h("button", { key: "btn", className: "btn btn-outline btn-sm", onClick: onRetry }, t("loading")),
  ]);
}

function LoadingGrid({ count = 8, gridClass = "grid-4" }) {
  return h("div", { className: `grid ${gridClass}` },
    Array.from({ length: count }).map((_, i) =>
      h("div", { key: i, className: "skeleton", style: { height: "180px", borderRadius: "18px" } })
    )
  );
}

function PageMeta({ title, description, canonical, jsonLd }) {
  useSEO({ title, description, canonical, jsonLd });
  return null;
}
