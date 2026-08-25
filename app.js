/* ============================================================
   MAIN APP — router switch
   ============================================================ */

function AppShell() {
  const route = useRoute();

  useEffect(() => {
    // Update robots/sitemap-relevant canonical structure is handled per-page via useSEO
  }, [route]);

  let page;
  const p = route.path;

  if (p === "/" ) page = h(HomePage, { key: "home" });
  else if (p === "/coupons") page = h(CouponsPage, { key: "coupons", route });
  else if (p === "/stores") page = h(StoresPage, { key: "stores" });
  else if (p === "/categories") page = h(CategoriesPage, { key: "categories" });
  else if (p === "/blog") page = h(BlogPage, { key: "blog" });
  else if (p === "/about") page = h(AboutPage, { key: "about" });
  else if (p === "/contact") page = h(ContactPage, { key: "contact" });
  else if (p === "/privacy") page = h(PrivacyPage, { key: "privacy" });
  else if (p === "/terms") page = h(TermsPage, { key: "terms" });
  else if (p === "/affiliate-disclosure") page = h(AffiliateDisclosurePage, { key: "affiliate" });
  else if (p.startsWith("/store/")) page = h(StorePage, { key: p, slug: p.replace("/store/", "") });
  else if (p.startsWith("/category/")) page = h(CategoryPage, { key: p, slug: p.replace("/category/", "") });
  else if (p.startsWith("/coupon/")) page = h(CouponPage, { key: p, slug: p.replace("/coupon/", "") });
  else if (p.startsWith("/blog/")) page = h(BlogPostPage, { key: p, slug: p.replace("/blog/", "") });
  else page = h(NotFoundPage, { key: "404" });

  return h("div", { className: "app-shell" }, [
    h(SiteHeader, { key: "header", route }),
    h("main", { key: "main" }, page),
    h(SiteFooter, { key: "footer" }),
  ]);
}

function App() {
  return h(LangProvider, null,
    h(ToastProvider, null,
      h(AppShell, null)
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App, null));
