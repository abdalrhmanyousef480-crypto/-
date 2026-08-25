/* ============================================================
   BLOG LISTING PAGE
   ============================================================ */
function BlogPage() {
  const { t, locale } = useLang();
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("nav.blog")} — ${t("site.name")}`, description: t("section.blog.sub") }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px", paddingBottom: "56px" } }, [
      h(Breadcrumbs, { key: "bc", items: [{ label: t("nav.blog") }] }),
      h("h1", { key: "h1", style: { fontSize: "26px", marginBottom: "6px" } }, t("nav.blog")),
      h("p", { key: "sub", style: { color: "var(--color-text-muted)", fontSize: "14.5px", marginBottom: "26px" } }, t("section.blog.sub")),
      posts.length === 0
        ? h(EmptyState, { key: "empty", title: t("empty.title"), desc: t("empty.desc") })
        : h("div", { key: "grid", className: "grid grid-3" }, posts.map((p) => h(BlogCard, { key: p.id, post: p }))),
    ]),
  ]);
}

/* ============================================================
   BLOG ARTICLE PAGE
   ============================================================ */
function BlogPostPage({ slug }) {
  const { t, locale } = useLang();
  const post = getPostBySlug(slug);
  if (!post) return h(NotFoundPage, null);

  const category = getCategory(post.category);
  const content = post.content[locale] || post.content.en;
  const headings = content.filter((block) => block.h).map((block) => block.h);
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const relatedCoupons = (post.relatedCoupons || []).map((id) => COUPONS.find((c) => c.id === id)).filter(Boolean);
  const relatedStores = (post.relatedStores || []).map((id) => getStore(id)).filter(Boolean);
  const author = locale === "ar" ? post.author : post.authorEn;
  const title = post.title[locale] || post.title.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: author },
  };

  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${title} — ${t("site.name")}`, description: post.excerpt[locale] || post.excerpt.en, ogImage: post.image, jsonLd }),
    h("div", { key: "body", className: "container", style: { paddingTop: "24px", paddingBottom: "56px" } }, [
      h(Breadcrumbs, {
        key: "bc",
        items: [
          { label: t("nav.blog"), to: "/blog" },
          ...(category ? [{ label: category.name[locale] || category.name.en, to: `/category/${category.slug}` }] : []),
          { label: title },
        ],
      }),

      h("div", { key: "content", className: "prose", style: { maxWidth: "720px" } }, [
        h("h1", { key: "title", style: { fontSize: "27px", marginBottom: "14px" } }, title),
        h("div", { key: "meta", className: "author-row", style: { marginBottom: "22px" } }, [
          h("span", { key: "avatar", className: "author-avatar" }, author.charAt(0)),
          h("span", { key: "by" }, `${t("blog.by")} ${author}`),
          h("span", { key: "sep1" }, "·"),
          h("span", { key: "date" }, formatDate(post.date, locale)),
          h("span", { key: "sep2" }, "·"),
          h("span", { key: "read" }, post.readingTime[locale] || post.readingTime.en),
        ]),
        h("img", { key: "img", src: post.image, alt: title, style: { width: "100%", borderRadius: "var(--radius-lg)", marginBottom: "28px" }, loading: "lazy" }),

        headings.length > 1 && h("div", { key: "toc", className: "toc-box" }, [
          h("div", { key: "t", className: "toc-title" }, t("blog.tableOfContents")),
          h("div", { key: "list", className: "toc-list" }, headings.map((hd, i) =>
            h("a", { key: i, href: `#heading-${i}` }, hd)
          )),
        ]),

        ...content.map((block, i) => {
          if (block.h) {
            const headingIndex = content.slice(0, i + 1).filter((b) => b.h).length - 1;
            return h("h2", { key: i, id: `heading-${headingIndex}` }, block.h);
          }
          return h("p", { key: i }, block.p);
        }),
      ]),

      relatedCoupons.length > 0 && h("div", { key: "relcoupons", style: { maxWidth: "780px", marginTop: "44px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedCoupons")),
        h("div", { key: "grid", className: "grid grid-3" }, relatedCoupons.map((c) => h(CouponCard, { key: c.id, coupon: c }))),
      ]),

      relatedStores.length > 0 && h("div", { key: "relstores", style: { maxWidth: "780px", marginTop: "40px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("coupon.relatedStores")),
        h("div", { key: "grid", className: "grid grid-4" }, relatedStores.map((s) => h(StoreCard, { key: s.id, store: s }))),
      ]),

      relatedPosts.length > 0 && h("div", { key: "relposts", style: { maxWidth: "780px", marginTop: "40px" } }, [
        h("h2", { key: "t", style: { fontSize: "18px", marginBottom: "16px" } }, t("blog.relatedArticles")),
        h("div", { key: "grid", className: "grid grid-3" }, relatedPosts.map((p) => h(BlogCard, { key: p.id, post: p }))),
      ]),
    ]),
  ]);
}
