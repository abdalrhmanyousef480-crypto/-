# كوبونيتا Couponeta — منصة كوبونات وعروض

موقع كوبونات احترافي، ثنائي اللغة (عربي RTL / إنجليزي LTR)، بدون Backend —
كل البيانات في ملفات JS منظمة يسهل تعديلها.

## التشغيل محليًا (Local Preview)

يحتاج المشروع فقط لخادم ملفات ثابت (static server)، لأنه يعتمد على React عبر CDN
بدون خطوة Build:

```bash
cd coupon-site
python3 -m http.server 8080
# افتح http://localhost:8080/index.html
```

أو بأي أداة أخرى: `npx serve .` أو Live Server في VS Code.

## النشر (Deployment)

ارفع محتويات هذا المجلد كما هي إلى أي استضافة ملفات ثابتة:
Netlify, Vercel (static), GitHub Pages, Cloudflare Pages, أو أي خادم ويب عادي.

لا حاجة لخطوة بناء (build step) — الملفات تعمل مباشرة.

> ملاحظة: الموقع يستخدم Client-side hash routing (`#/coupons`, `#/store/iherb`...)
> لذا لا حاجة لإعداد rewrites على السيرفر لدعم مسارات SPA.

## هيكل الملفات

```
index.html              نقطة الدخول — يحمّل كل الملفات بالترتيب الصحيح
styles.css              نظام التصميم الكامل (Design System)

data.js                 ★ كل بيانات الموقع: متاجر، كوبونات، تصنيفات، مقالات
i18n.js                 ★ كل نصوص الواجهة (عربي/إنجليزي)

utils.js                دوال مساعدة (بحث، فلترة، ترتيب، تواريخ)
icons.js                مجموعة الأيقونات (SVG)
app-core.js             الراوتر + Context اللغة + Toast + SEO hooks

components-header.js    الهيدر + قائمة الموبايل + البحث + Bottom Nav
components-footer.js    الفوتر + Breadcrumbs + FAQ + حالات فارغة/خطأ
components-cards.js     CouponCard, StoreCard, CategoryCard, BlogCard
components-filters.js   شريط الفلاتر (Desktop) + Bottom Sheet (Mobile)

pages-home.js           الرئيسية + صفحة كل الكوبونات
pages-stores.js         صفحة كل المتاجر + صفحة متجر واحد
pages-categories.js     صفحة كل التصنيفات + صفحة تصنيف واحد
pages-coupon-detail.js  صفحة الكوبون المنفردة
pages-blog.js           صفحة المدونة + صفحة المقال
pages-static.js         من نحن، تواصل معنا، سياسات، 404

app.js                  تجميع كل شيء + الراوتر الرئيسي

robots.txt, sitemap.xml SEO — الـ sitemap مولّد تلقائيًا من data.js
generate-sitemap.js     شغّله بعد أي تعديل على data.js: node generate-sitemap.js
```

## كيف أضيف متجرًا جديدًا؟

افتح `data.js` وأضف كائنًا جديدًا في مصفوفة `STORES`:

```js
{ id: "example", slug: "example", category: "fashion", featured: false,
  name: "Example Store", website: "https://example.com",
  logo: "https://logo.clearbit.com/example.com",
  desc: { ar: "وصف المتجر بالعربي", en: "Store description in English" } },
```

## كيف أضيف كوبونًا جديدًا؟

أضف كائنًا في مصفوفة `COUPONS` (لاحظ `store` يجب أن يطابق `id` متجر موجود):

```js
{ id: "c17", store: "example", slug: "example-15-off",
  code: "SAVE15", type: "code", discount: "15%",
  title: { ar: "خصم 15%", en: "15% off" },
  desc: { ar: "...", en: "..." },
  terms: { ar: "...", en: "..." },
  verified: true, active: true, featured: false,
  expirationDate: "2026-12-31",
  affiliateUrl: "https://example.com/promo/SAVE15",
  storeUrl: "https://example.com" },
```

بعد أي إضافة، شغّل `node generate-sitemap.js` لتحديث خريطة الموقع.

## ربط Analytics لاحقًا

كل الأحداث المهمة تُسجَّل عبر دالة واحدة في `utils.js`:

```js
trackEvent("code_reveal" | "code_copy" | "affiliate_click" | "coupon_view", { ... });
```

اربطها بأي مزوّد تحليلات (GA4, Plausible...) بإضافة السطر المناسب داخل هذه الدالة.

## ملاحظات تقنية

- **بدون خطوة Build**: React يُحمَّل عبر CDN (unpkg) — الأمر لتبسيط النشر الفوري.
  للمشاريع الأكبر يُنصح بالانتقال لـ Next.js/Vite مع نفس مكونات JS تقريبًا.
- **التوجيه (Routing)**: Hash-based (`#/...`) لتفادي أي إعداد سيرفر إضافي.
- **الحالة (State)**: كل شيء في React state/localStorage — لا حاجة لقاعدة بيانات.
- **اللغة الافتراضية**: العربية (RTL)، محفوظة في `localStorage`.
