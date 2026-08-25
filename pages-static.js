/* ============================================================
   STATIC / LEGAL PAGES
   ============================================================ */

function StaticPageShell({ title, children, breadcrumbLabel }) {
  return h("div", { className: "container legal-page", style: { paddingTop: "24px", paddingBottom: "64px" } }, [
    h(Breadcrumbs, { key: "bc", items: [{ label: breadcrumbLabel || title }] }),
    h("h1", { key: "h1", style: { fontSize: "26px", marginBottom: "24px" } }, title),
    h("div", { key: "content", className: "prose" }, children),
  ]);
}

function AboutPage() {
  const { t, locale } = useLang();
  const content = locale === "ar" ? {
    p1: "كوبونيتا هي منصة عربية متخصصة في جمع أحدث أكواد الخصم والعروض من أشهر المتاجر الإلكترونية في المنطقة والعالم، بهدف مساعدتك على التوفير في كل عملية شراء.",
    h2: "مهمتنا",
    p2: "نؤمن أن التسوق الذكي يبدأ بمعرفة أن هناك خصمًا متاحًا. لذلك يراجع فريقنا الكوبونات يوميًا للتأكد من صلاحيتها، ونعرضها بطريقة واضحة وسريعة تمكنك من الحصول على الكود واستخدامه في ثوانٍ.",
    h3: "كيف نعمل",
    p3: "نجمع الكوبونات من المتاجر الشريكة ونتحقق من عملها الفعلي بشكل دوري، ثم نصنفها حسب المتجر والتصنيف والنوع لتسهيل الوصول إليها. الموقع مجاني بالكامل للمستخدمين.",
  } : {
    p1: "Couponeta is a platform dedicated to gathering the latest discount codes and deals from the most popular online stores in the region and around the world, helping you save on every purchase.",
    h2: "Our Mission",
    p2: "We believe smart shopping starts with knowing a discount is available. That's why our team reviews coupons daily to confirm they work, and presents them clearly and quickly so you can grab a code and use it in seconds.",
    h3: "How We Work",
    p3: "We gather coupons from partner stores and periodically verify they actually work, then organize them by store, category and type for easy access. The site is completely free for users.",
  };
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("about.title")} — ${t("site.name")}`, description: content.p1 }),
    h(StaticPageShell, { key: "body", title: t("about.title") }, [
      h("p", { key: "p1" }, content.p1),
      h("h2", { key: "h2" }, content.h2),
      h("p", { key: "p2" }, content.p2),
      h("h3", { key: "h3" }, content.h3),
      h("p", { key: "p3" }, content.p3),
    ]),
  ]);
}

function ContactPage() {
  const { t, locale } = useLang();
  const showToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast(locale === "ar" ? "تم إرسال رسالتك" : "Message sent");
  };

  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("contact.title")} — ${t("site.name")}`, description: t("contact.desc") }),
    h(StaticPageShell, { key: "body", title: t("contact.title") }, [
      h("p", { key: "desc" }, t("contact.desc")),
      h("form", {
        key: "form", onSubmit: handleSubmit, style: { maxWidth: "480px", marginTop: "24px" },
      }, [
        h("div", { key: "name", className: "form-field" }, [
          h("label", { key: "l", className: "form-label", htmlFor: "cf-name" }, t("contact.name")),
          h("input", { key: "i", id: "cf-name", className: "input", required: true, value: form.name, placeholder: t("contact.namePlaceholder"), onChange: (e) => setForm({ ...form, name: e.target.value }) }),
        ]),
        h("div", { key: "email", className: "form-field" }, [
          h("label", { key: "l", className: "form-label", htmlFor: "cf-email" }, t("contact.email")),
          h("input", { key: "i", id: "cf-email", type: "email", className: "input", required: true, value: form.email, placeholder: t("contact.emailPlaceholder"), onChange: (e) => setForm({ ...form, email: e.target.value }) }),
        ]),
        h("div", { key: "msg", className: "form-field" }, [
          h("label", { key: "l", className: "form-label", htmlFor: "cf-msg" }, t("contact.message")),
          h("textarea", { key: "i", id: "cf-msg", className: "input", required: true, value: form.message, placeholder: t("contact.messagePlaceholder"), onChange: (e) => setForm({ ...form, message: e.target.value }) }),
        ]),
        h("button", { key: "submit", type: "submit", className: "btn btn-primary btn-block" }, t("contact.send")),
        sent && h("p", { key: "confirm", style: { color: "var(--color-success)", fontSize: "13.5px", marginTop: "12px" } }, "✓ " + t("contact.send")),
      ]),
    ]),
  ]);
}

function PrivacyPage() {
  const { t, locale } = useLang();
  const c = locale === "ar" ? {
    intro: "نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه الصفحة كيفية جمع واستخدام المعلومات عند استخدامك لموقع كوبونيتا.",
    s1: "المعلومات التي نجمعها", s1p: "نجمع معلومات محدودة مثل عنوان IP وبيانات التصفح العامة (نوع المتصفح، الصفحات المُزارة) لأغراض تحسين تجربة الاستخدام وتحليل الأداء. لا نجمع بيانات دفع أو معلومات حساسة.",
    s2: "ملفات تعريف الارتباط (Cookies)", s2p: "نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك مثل اللغة، ولتحليل حركة الزوار بشكل مجهول الهوية.",
    s3: "الروابط الخارجية", s3p: "يحتوي الموقع على روابط لمتاجر خارجية. لسنا مسؤولين عن سياسات الخصوصية لهذه المواقع، وننصح بمراجعتها بشكل منفصل.",
    s4: "التواصل معنا", s4p: "لأي استفسار متعلق بالخصوصية، يمكنك التواصل معنا عبر صفحة تواصل معنا.",
  } : {
    intro: "We respect your privacy and are committed to protecting your personal data. This page explains how information is collected and used when you use Couponeta.",
    s1: "Information We Collect", s1p: "We collect limited information such as IP address and general browsing data (browser type, pages visited) to improve the user experience and analyze performance. We do not collect payment data or sensitive information.",
    s2: "Cookies", s2p: "We use cookies to remember your preferences such as language, and to analyze visitor traffic anonymously.",
    s3: "External Links", s3p: "The site contains links to external stores. We are not responsible for the privacy policies of these sites, and recommend reviewing them separately.",
    s4: "Contact Us", s4p: "For any privacy-related inquiry, you can reach us via the Contact page.",
  };
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("privacy.title")} — ${t("site.name")}`, description: c.intro }),
    h(StaticPageShell, { key: "body", title: t("privacy.title") }, [
      h("p", { key: "intro" }, c.intro),
      h("h2", { key: "h1" }, c.s1), h("p", { key: "p1" }, c.s1p),
      h("h2", { key: "h2" }, c.s2), h("p", { key: "p2" }, c.s2p),
      h("h2", { key: "h3" }, c.s3), h("p", { key: "p3" }, c.s3p),
      h("h2", { key: "h4" }, c.s4), h("p", { key: "p4" }, c.s4p),
    ]),
  ]);
}

function TermsPage() {
  const { t, locale } = useLang();
  const c = locale === "ar" ? {
    intro: "باستخدامك لموقع كوبونيتا، فإنك توافق على الشروط والأحكام التالية.",
    s1: "استخدام الموقع", s1p: "الموقع مخصص لأغراض إعلامية لمساعدتك في العثور على أكواد الخصم والعروض. لا نضمن صلاحية كل كود في جميع الأوقات نظرًا لتغيّر شروط المتاجر باستمرار.",
    s2: "المسؤولية", s2p: "لا يتحمل كوبونيتا أي مسؤولية عن المعاملات التي تتم بينك وبين المتاجر الخارجية. أي نزاع يتعلق بالشراء يجب توجيهه مباشرة إلى المتجر المعني.",
    s3: "الملكية الفكرية", s3p: "جميع المحتويات على الموقع، بما في ذلك التصميم والنصوص، محمية بحقوق الملكية الفكرية ولا يجوز إعادة استخدامها دون إذن.",
    s4: "التعديلات", s4p: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يعني استمرار استخدامك للموقع موافقتك على أي تعديلات.",
  } : {
    intro: "By using Couponeta, you agree to the following terms and conditions.",
    s1: "Use of the Site", s1p: "The site is intended for informational purposes to help you find discount codes and deals. We do not guarantee every code will be valid at all times, since store terms change continuously.",
    s2: "Liability", s2p: "Couponeta bears no responsibility for transactions between you and external stores. Any dispute related to a purchase should be directed to the relevant store.",
    s3: "Intellectual Property", s3p: "All content on the site, including design and text, is protected by intellectual property rights and may not be reused without permission.",
    s4: "Changes", s4p: "We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of any changes.",
  };
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("terms.title")} — ${t("site.name")}`, description: c.intro }),
    h(StaticPageShell, { key: "body", title: t("terms.title") }, [
      h("p", { key: "intro" }, c.intro),
      h("h2", { key: "h1" }, c.s1), h("p", { key: "p1" }, c.s1p),
      h("h2", { key: "h2" }, c.s2), h("p", { key: "p2" }, c.s2p),
      h("h2", { key: "h3" }, c.s3), h("p", { key: "p3" }, c.s3p),
      h("h2", { key: "h4" }, c.s4), h("p", { key: "p4" }, c.s4p),
    ]),
  ]);
}

function AffiliateDisclosurePage() {
  const { t, locale } = useLang();
  const c = locale === "ar" ? {
    intro: "الشفافية مهمة بالنسبة لنا. إليك كيف يعمل نموذج عملنا.",
    s1: "كيف نحقق الدخل", s1p: "قد نحصل على عمولة تسويقية عند قيامك بالشراء عبر بعض الروابط الموجودة في موقعنا، وذلك دون أي تكلفة إضافية عليك. هذه العمولة تأتي من المتجر وليس من العميل.",
    s2: "هل هذا يؤثر على ترتيب الكوبونات؟", s2p: "لا. نحرص على عرض الكوبونات بناءً على صلاحيتها وقيمتها للمستخدم، وليس بناءً على قيمة العمولة.",
    s3: "التزامنا", s3p: "نلتزم بعرض معلومات دقيقة وتحديث حالة الكوبونات بانتظام بغض النظر عن العلاقات التجارية.",
  } : {
    intro: "Transparency matters to us. Here's how our business model works.",
    s1: "How We Earn", s1p: "We may earn an affiliate commission when you make a purchase through some links on our site, at no extra cost to you. This commission comes from the store, not the customer.",
    s2: "Does This Affect Coupon Ranking?", s2p: "No. We display coupons based on their validity and value to the user, not on commission value.",
    s3: "Our Commitment", s3p: "We are committed to displaying accurate information and regularly updating coupon status regardless of business relationships.",
  };
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `${t("affiliateDisclosure.title")} — ${t("site.name")}`, description: c.intro }),
    h(StaticPageShell, { key: "body", title: t("affiliateDisclosure.title") }, [
      h("p", { key: "intro" }, c.intro),
      h("h2", { key: "h1" }, c.s1), h("p", { key: "p1" }, c.s1p),
      h("h2", { key: "h2" }, c.s2), h("p", { key: "p2" }, c.s2p),
      h("h2", { key: "h3" }, c.s3), h("p", { key: "p3" }, c.s3p),
    ]),
  ]);
}

function NotFoundPage() {
  const { t } = useLang();
  return h(React.Fragment, null, [
    h(PageMeta, { key: "meta", title: `404 — ${t("site.name")}`, description: t("notFound.desc") }),
    h("div", { key: "body", className: "container", style: { paddingTop: "80px", paddingBottom: "80px" } },
      h("div", { className: "state-block" }, [
        h(Icon, { key: "i", name: "alertCircle", size: 48, className: "state-icon" }),
        h("h1", { key: "t", style: { fontSize: "22px" } }, t("notFound.title")),
        h("p", { key: "d" }, t("notFound.desc")),
        h(Link, { key: "cta", to: "/", className: "btn btn-primary", style: { marginTop: "8px" } }, t("notFound.cta")),
      ])
    ),
  ]);
}
