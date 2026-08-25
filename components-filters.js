/* ============================================================
   FILTER BAR — chips on desktop, bottom-sheet drawer on mobile
   ============================================================ */

const FILTER_KEYS = ["verified", "codes", "deals", "freeShipping", "cashback", "expiringSoon"];
const SORT_KEYS = ["newest", "mostUsed", "highestDiscount", "expiringSoon"];

function FilterBar({ filters, setFilters, sort, setSort, resultCount }) {
  const { t } = useLang();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleFilter = (key) => {
    setFilters((prev) => prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]);
  };

  if (isMobile) {
    return h(React.Fragment, null, [
      h("div", { key: "toolbar", className: "filter-toolbar" }, [
        h("button", { key: "open", className: "btn btn-outline btn-sm", onClick: () => setDrawerOpen(true) }, [
          h(Icon, { key: "i", name: "tag", size: 15 }), t("filters.title"),
          filters.length > 0 && h("span", { key: "n", className: "badge badge-accent", style: { marginInlineStart: "4px" } }, filters.length),
        ]),
        h("span", { key: "count", style: { fontSize: "13px", color: "var(--color-text-muted)" } }, `${resultCount} ${t("filters.resultsCount")}`),
      ]),
      drawerOpen && h(FilterDrawer, {
        key: "drawer", filters, toggleFilter, sort, setSort,
        onClose: () => setDrawerOpen(false),
        onClear: () => { setFilters([]); setSort("newest"); },
      }),
    ]);
  }

  return h("div", { className: "filter-toolbar" }, [
    h("div", { key: "chips", className: "filter-scroll" }, FILTER_KEYS.map((key) =>
      h("button", {
        key, className: "filter-chip" + (filters.includes(key) ? " active" : ""),
        onClick: () => toggleFilter(key),
      }, t(`filters.${key}`))
    )),
    h("div", { key: "right", style: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 } }, [
      h("span", { key: "count", style: { fontSize: "13px", color: "var(--color-text-muted)" } }, `${resultCount} ${t("filters.resultsCount")}`),
      h("select", {
        key: "sort", className: "select-native", value: sort,
        onChange: (e) => setSort(e.target.value), "aria-label": t("filters.sortBy"),
      }, SORT_KEYS.map((key) => h("option", { key, value: key }, t(`filters.${key}`)))),
    ]),
  ]);
}

function FilterDrawer({ filters, toggleFilter, sort, setSort, onClose, onClear }) {
  useScrollLock(true);
  const { t } = useLang();
  return h(React.Fragment, null, [
    h("div", { key: "overlay", className: "drawer-overlay", onClick: onClose }),
    h("div", { key: "sheet", className: "drawer-bottom", role: "dialog", "aria-modal": "true" }, [
      h("div", { key: "handle", className: "drawer-handle" }),
      h("div", { key: "head", className: "drawer-header" }, [
        h("h3", { key: "t", style: { fontSize: "17px" } }, t("filters.title")),
        h("button", { key: "x", className: "icon-btn", onClick: onClose, "aria-label": "Close" }, h(Icon, { name: "close" })),
      ]),
      h("div", { key: "sortlabel", style: { fontSize: "13px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "10px" } }, t("filters.sortBy")),
      h("div", { key: "sortrow", style: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" } },
        SORT_KEYS.map((key) => h("button", {
          key, className: "filter-chip" + (sort === key ? " active" : ""), onClick: () => setSort(key),
        }, t(`filters.${key}`)))
      ),
      h("div", { key: "filterlabel", style: { fontSize: "13px", fontWeight: 700, color: "var(--color-primary)", marginBottom: "10px" } }, t("filters.title")),
      h("div", { key: "filterrow", style: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" } },
        FILTER_KEYS.map((key) => h("button", {
          key, className: "filter-chip" + (filters.includes(key) ? " active" : ""), onClick: () => toggleFilter(key),
        }, t(`filters.${key}`)))
      ),
      h("div", { key: "actions", style: { display: "flex", gap: "10px" } }, [
        h("button", { key: "clear", className: "btn btn-outline btn-block", onClick: onClear }, t("filters.clear")),
        h("button", { key: "apply", className: "btn btn-primary btn-block", onClick: onClose }, t("filters.apply")),
      ]),
    ]),
  ]);
}
