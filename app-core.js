/* ============================================================
   APP CORE — routing, language context, shared hooks
   ============================================================ */
const { useState, useEffect, useContext, createContext, useRef, useCallback, useMemo } = React;

/* ---------- Simple hash router ---------- */
function parseHash() {
  let hash = window.location.hash.replace(/^#/, "") || "/";
  const [path, query] = hash.split("?");
  const params = new URLSearchParams(query || "");
  return { path: path || "/", params };
}

function useRoute() {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const onChange = () => { setRoute(parseHash()); scrollToTop(); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

function navigate(path) {
  window.location.hash = path;
}

function Link({ to, children, className, onClick, ...rest }) {
  return h("a", {
    href: `#${to}`,
    className,
    onClick: (e) => { if (onClick) onClick(e); },
    ...rest,
  }, children);
}

/* ---------- Language context ---------- */
const LangContext = createContext(null);
function useLang() { return useContext(LangContext); }

function LangProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem("couponeta_locale") || "ar");

  useEffect(() => {
    localStorage.setItem("couponeta_locale", locale);
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }, [locale]);

  const t = useMemo(() => makeT(locale), [locale]);
  const toggleLocale = () => setLocale((l) => (l === "ar" ? "en" : "ar"));

  const value = { locale, t, toggleLocale, setLocale };
  return h(LangContext.Provider, { value }, children);
}

/* ---------- Toast ---------- */
const ToastContext = createContext(null);
function useToast() { return useContext(ToastContext); }

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return h(ToastContext.Provider, { value: showToast }, [
    children,
    toast && h("div", {
      key: "toast",
      role: "status",
      "aria-live": "polite",
      style: {
        position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
        background: "var(--color-primary)", color: "#fff", padding: "12px 22px",
        borderRadius: "999px", fontSize: "14px", fontWeight: 600, zIndex: 500,
        boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: "8px",
      },
    }, [
      h(Icon, { key: "i", name: "checkCircle", size: 18 }),
      toast,
    ]),
  ]);
}

/* ---------- Clipboard hook ---------- */
function useCopyCode() {
  const showToast = useToast();
  const { t } = useLang();
  return useCallback((code, couponId) => {
    if (!code) return;
    const doCopy = () => {
      showToast(t("coupon.copied"));
      trackEvent("code_copy", { couponId, code });
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).then(doCopy).catch(() => fallbackCopy(code, doCopy));
    } else {
      fallbackCopy(code, doCopy);
    }
  }, [showToast, t]);
}
function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  cb();
}

/* ---------- Scroll lock for drawers/modals ---------- */
function useScrollLock(locked) {
  useEffect(() => {
    if (locked) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [locked]);
}

/* ---------- SEO head manager ---------- */
function useSEO({ title, description, canonical, ogImage, jsonLd }) {
  const { locale } = useLang();
  useEffect(() => {
    if (title) document.title = title;
    setMeta("description", description);
    setMetaProp("og:title", title);
    setMetaProp("og:description", description);
    setMetaProp("og:type", "website");
    setMetaProp("og:image", ogImage || DEFAULT_OG_IMAGE);
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", canonical || window.location.href);

    // JSON-LD structured data
    let script = document.getElementById("jsonld-dynamic");
    if (script) script.remove();
    if (jsonLd) {
      script = document.createElement("script");
      script.id = "jsonld-dynamic";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, jsonLd, locale]);
}
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&q=80";
function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setMetaProp(prop, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setMetaName(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
