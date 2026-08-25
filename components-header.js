/* ============================================================
   HEADER + NAVIGATION + SEARCH OVERLAY + BOTTOM NAV
   ============================================================ */

function SiteHeader({ route }) {
  const { t, locale, toggleLocale } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { to: "/coupons", label: t("nav.coupons") },
    { to: "/stores", label: t("nav.stores") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/blog", label: t("nav.blog") },
  ];

  return h(React.Fragment, null, [
    h("header", { key: "header", className: "site-header" },
      h("div", { className: "container header-inner" }, [
        h(Link, { key: "logo", to: "/", className: "logo", "aria-label": t("site.name") }, [
          h("span", { key: "mark", className: "logo-mark" }, "%"),
          h("span", { key: "txt" }, t("site.name")),
        ]),
        h("nav", { key: "nav", className: "main-nav", "aria-label": "Primary" },
          navItems.map((item) =>
            h(Link, {
              key: item.to, to: item.to,
              className: "nav-link" + (route.path === item.to || route.path.startsWith(item.to + "/") ? " active" : ""),
            }, item.label)
          )
        ),
        h("div", { key: "actions", className: "header-actions" }, [
          h("button", {
            key: "search", className: "header-search-trigger desktop-only",
            onClick: () => setSearchOpen(true), "aria-label": t("search.placeholder"),
          }, [
            h(Icon, { key: "i", name: "search", size: 17 }),
            h("span", { key: "t" }, t("search.placeholderShort")),
          ]),
          h("button", {
            key: "search-m", className: "icon-btn mobile-only",
            onClick: () => setSearchOpen(true), "aria-label": t("search.placeholder"),
          }, h(Icon, { name: "search", size: 20 })),
          h("button", {
            key: "lang", className: "lang-switch desktop-only", onClick: toggleLocale,
            "aria-label": "Switch language",
          }, t("lang.switch")),
          h("button", {
            key: "menu", className: "icon-btn mobile-only",
            onClick: () => setMenuOpen(true), "aria-label": t("nav.menu"),
          }, h(Icon, { name: "menu", size: 22 })),
        ]),
      ])
    ),
    menuOpen && h(MobileMenu, { key: "mobilemenu", onClose: () => setMenuOpen(false), navItems, route }),
    searchOpen && h(SearchOverlay, { key: "searchoverlay", onClose: () => setSearchOpen(false) }),
    h(BottomNav, { key: "bottomnav", route, onSearch: () => setSearchOpen(true), onMenu: () => setMenuOpen(true) }),
  ]);
}

function MobileMenu({ onClose, navItems, route }) {
  useScrollLock(true);
  const { t, locale, toggleLocale } = useLang();
  return h(React.Fragment, null, [
    h("div", { key: "overlay", className: "drawer-overlay", onClick: onClose }),
    h("div", { key: "drawer", className: "drawer", role: "dialog", "aria-modal": "true" }, [
      h("div", { key: "head", className: "drawer-header" }, [
        h("span", { key: "l", className: "logo" }, [
          h("span", { key: "m", className: "logo-mark" }, "%"),
          h("span", { key: "t" }, t("site.name")),
        ]),
        h("button", { key: "x", className: "icon-btn", onClick: onClose, "aria-label": "Close menu" }, h(Icon, { name: "close" })),
      ]),
      h("nav", { key: "nav" }, navItems.map((item) =>
        h(Link, { key: item.to, to: item.to, className: "drawer-link", onClick: onClose }, item.label)
      )),
      h(Link, { key: "about", to: "/about", className: "drawer-link", onClick: onClose }, t("nav.about")),
      h(Link, { key: "contact", to: "/contact", className: "drawer-link", onClick: onClose }, t("nav.contact")),
      h("button", {
        key: "lang", className: "btn btn-outline", style: { marginTop: "20px" },
        onClick: () => { toggleLocale(); onClose(); },
      }, t("lang.switch")),
    ]),
  ]);
}

function BottomNav({ route, onSearch, onMenu }) {
  const { t } = useLang();
  useEffect(() => { document.body.classList.add("has-bottom-nav"); return () => document.body.classList.remove("has-bottom-nav"); }, []);
  const items = [
    { to: "/", icon: "home", label: t("breadcrumb.home") },
    { to: "/coupons", icon: "tag", label: t("nav.coupons") },
    { to: "__search", icon: "search", label: t("search.placeholderShort"), action: onSearch },
    { to: "/stores", icon: "store", label: t("nav.stores") },
    { to: "__menu", icon: "menu", label: t("nav.menu"), action: onMenu },
  ];
  return h("div", { className: "bottom-nav" },
    h("div", { className: "bottom-nav-inner" }, items.map((item) => {
      const active = item.to === route.path;
      if (item.action) {
        return h("button", {
          key: item.to, className: "bottom-nav-item", onClick: item.action,
        }, [h(Icon, { key: "i", name: item.icon, size: 21 }), h("span", { key: "l" }, item.label)]);
      }
      return h(Link, {
        key: item.to, to: item.to, className: "bottom-nav-item" + (active ? " active" : ""),
      }, [h(Icon, { key: "i", name: item.icon, size: 21 }), h("span", { key: "l" }, item.label)]);
    }))
  );
}

function SearchOverlay({ onClose }) {
  useScrollLock(true);
  const { t, locale } = useLang();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => globalSearch(query, locale), [query, locale]);
  const hasAny = results.stores.length || results.coupons.length || results.categories.length || results.articles.length;

  const go = (path) => { onClose(); navigate(path); };

  return h("div", { className: "search-overlay", onClick: onClose }, [
    h("div", { key: "panel", className: "search-panel", onClick: (e) => e.stopPropagation() }, [
      h("div", { key: "row", className: "search-input-row" }, [
        h(Icon, { key: "i", name: "search", size: 19, style: { color: "var(--color-text-faint)" } }),
        h("input", {
          key: "input", ref: inputRef, type: "text", value: query,
          placeholder: t("search.placeholder"),
          onChange: (e) => setQuery(e.target.value),
          "aria-label": t("search.placeholder"),
        }),
        h("button", { key: "close", className: "icon-btn", onClick: onClose, "aria-label": "Close" }, h(Icon, { name: "close", size: 18 })),
      ]),
      h("div", { key: "results", className: "search-results" }, [
        query.trim() === "" && h("div", { key: "hint", className: "state-block", style: { padding: "36px 20px" } },
          h("p", null, locale === "ar" ? "ابدأ الكتابة للبحث في المتاجر والكوبونات والتصنيفات." : "Start typing to search stores, coupons and categories.")
        ),
        query.trim() !== "" && !hasAny && h("div", { key: "empty", className: "state-block", style: { padding: "36px 20px" } }, [
          h(Icon, { key: "i", name: "search", size: 32, className: "state-icon" }),
          h("p", { key: "t" }, t("search.noResults")),
        ]),
        query.trim() !== "" && results.stores.length > 0 && h("div", { key: "stores" }, [
          h("div", { key: "l", className: "search-group-label" }, t("search.stores")),
          ...results.stores.map((s) => h("div", {
            key: s.id, className: "search-result-row", role: "button", tabIndex: 0,
            onClick: () => go(`/store/${s.slug}`),
          }, [
            h("div", { key: "thumb", className: "search-result-thumb" }, h("img", { src: s.logo, alt: "", loading: "lazy" })),
            h("span", { key: "name" }, s.name),
          ])),
        ]),
        query.trim() !== "" && results.coupons.length > 0 && h("div", { key: "coupons" }, [
          h("div", { key: "l", className: "search-group-label" }, t("search.coupons")),
          ...results.coupons.map((c) => {
            const store = getStore(c.store);
            return h("div", {
              key: c.id, className: "search-result-row", role: "button", tabIndex: 0,
              onClick: () => go(`/coupon/${c.slug}`),
            }, [
              h("div", { key: "thumb", className: "search-result-thumb" }, store && h("img", { src: store.logo, alt: "", loading: "lazy" })),
              h("span", { key: "name" }, c.title[locale] || c.title.en),
            ]);
          }),
        ]),
        query.trim() !== "" && results.categories.length > 0 && h("div", { key: "cats" }, [
          h("div", { key: "l", className: "search-group-label" }, t("search.categories")),
          ...results.categories.map((c) => h("div", {
            key: c.id, className: "search-result-row", role: "button", tabIndex: 0,
            onClick: () => go(`/category/${c.slug}`),
          }, [
            h("div", { key: "thumb", className: "search-result-thumb" }, h(Icon, { name: c.icon, size: 18 })),
            h("span", { key: "name" }, c.name[locale] || c.name.en),
          ])),
        ]),
        query.trim() !== "" && results.articles.length > 0 && h("div", { key: "articles" }, [
          h("div", { key: "l", className: "search-group-label" }, t("search.articles")),
          ...results.articles.map((p) => h("div", {
            key: p.id, className: "search-result-row", role: "button", tabIndex: 0,
            onClick: () => go(`/blog/${p.slug}`),
          }, [
            h("div", { key: "thumb", className: "search-result-thumb" }, h("img", { src: p.image, alt: "", loading: "lazy" })),
            h("span", { key: "name" }, p.title[locale] || p.title.en),
          ])),
        ]),
      ]),
    ]),
  ]);
}
