"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { useLang } from "./providers/lang-provider";
import { TopBar } from "./topbar";
import { Download } from "lucide-react";

const LINKS = {
  cookbook_fr: "/pdfs/cotex-cookbook-fr.pdf",
  cookbook_ar: "/pdfs/cotex-cookbook-ar.pdf",
  catalogue_multi: "/pdfs/cotex-catalogue.pdf",
};

// ✅ YOUR REAL PATHS (based on your screenshot)
const IMAGES = {
  hero1: "/images/cotex-01.jpg",
  hero2: "/images/cotex-02.jpg",

  // Keep these if they exist in your folders
  dishes: [
    "/images/dishes/dish-1.png",
    "/images/dishes/dish-2.png",
    "/images/dishes/dish-3.png",
  ],
  products: [
    "/images/products/pro-01.jpg",
    "/images/products/pro-02.jpg",
    "/images/products/pro-03.jpg",
  ],
};

const BG = {
  a: "#0653ec",
  b: "#ff9602",
};

// ✅ Keeps content ABOVE bottom navigation on all screens (safe-area + nav height)
const NAV_SAFE_PB = "pb-[calc(env(safe-area-inset-bottom)+120px)]";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * ✅ PUSHED UP GRADIENT (more color higher, less 50/50 split)
 * To push even more UP: reduce 35% -> 30% and 58% -> 50%
 */
function overlayGradient(colorHex: string) {
  const { r, g, b } = hexToRgb(colorHex);
  return `linear-gradient(to top,
    rgba(${r},${g},${b},1.50) 0%,
    rgba(${r},${g},${b},0.50) 50%,
    rgba(${r},${g},${b},0.10) 80%,
    rgba(${r},${g},${b},0.0) 100%,
    rgba(0,0,0,0.10) 72%,
    rgba(0,0,0,0.00) 86%
  )`;
}

export function SnapCatalog() {
  const { dir, t, lang } = useLang();
  const isRTL = dir === "rtl";

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [page, setPage] = React.useState<0 | 1>(0);
  const lockRef = React.useRef(false);

  // ---------- PRELOADER ----------
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const urls = [IMAGES.hero1, IMAGES.hero2, ...IMAGES.dishes, ...IMAGES.products, "/logo.png"];

    let done = 0;
    const mark = () => {
      done += 1;
      if (done >= urls.length && !cancelled) setReady(true);
    };

    urls.forEach((src) => {
      const img = new Image();
      img.onload = mark;
      img.onerror = mark;
      img.src = src;
    });

    const tmr = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(tmr);
    };
  }, []);

  // ---------- Browser theme-color ----------
  const bgSolid = page === 0 ? BG.a : BG.b;

  React.useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", bgSolid);
  }, [bgSolid]);

  // ---------- MOBILE “step by step” swipe ----------
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = endY - startY;
      if (Math.abs(dy) < 40) return;

      if (lockRef.current) return;
      lockRef.current = true;

      const next: 0 | 1 = dy < 0 ? 1 : 0;
      el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
      setPage(next);

      window.setTimeout(() => (lockRef.current = false), 850);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchend", onTouchEnd as any);
    };
  }, []);

  // ---------- Desktop wheel “1 wheel = 1 page” ----------
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockRef.current) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return;

      lockRef.current = true;

      const next: 0 | 1 = delta > 0 ? 1 : 0;
      el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
      setPage(next);

      window.setTimeout(() => (lockRef.current = false), 780);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [page]);

  // ---------- Sync page from scroll ----------
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const h = el.clientHeight;
      const y = el.scrollTop;
      setPage((y >= h * 0.5 ? 1 : 0) as 0 | 1);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (p: 0 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: p * el.clientHeight, behavior: "smooth" });
    setPage(p);
  };

  // ✅ Page visibility ONLY
  const page1Opacity = page === 0 ? 1 : 0;
  const page2Opacity = page === 1 ? 1 : 0;

  // ✅ Hero
  const hero = page === 0 ? IMAGES.hero1 : IMAGES.hero2;

  const cookbookFrLabel =
    lang === "ar" ? "تحميل (FR)" : lang === "en" ? "Download (FR)" : "Télécharger (FR)";
  const cookbookArLabel =
    lang === "ar" ? "تحميل (AR)" : lang === "en" ? "Download (AR)" : "Télécharger (AR)";

  return (
    <div className="relative isolate">
      {/* ✅ HERO */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hero}
          className="fixed inset-0 z-0"
          initial={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* ✅ OVERLAY */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: overlayGradient(BG.a) }}
          animate={{ opacity: page === 0 ? 1 : 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: overlayGradient(BG.b) }}
          animate={{ opacity: page === 1 ? 1 : 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        />
      </div>

      {/* Preloader */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 z-[9999] grid place-items-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: bgSolid }}
          >
            <motion.img
              src="/logo.png"
              alt="Loading"
              className="h-24 w-24"
              animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 1.05 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TopBar activePage={page} onGoCatalog1={() => goTo(0)} onGoCatalog2={() => goTo(1)} />



      {/* Scroller */}
      <div
        ref={scrollerRef}
        className={[
          "relative z-30 h-[100svh] overflow-y-scroll snap-y snap-mandatory no-scrollbar",
          "lg:w-1/2",
          isRTL ? "lg:ml-auto" : "",
        ].join(" ")}
      >
        {/* PAGE 1 */}
        <section className="snap-start h-[100svh] flex items-end lg:items-center">
          <div className={`w-full px-6 sm:px-10 ${NAV_SAFE_PB} lg:pb-0`}>
            <motion.div style={{ opacity: page1Opacity }} className="max-w-xl space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{t.title1}</h1>
              <p className="text-white/90 text-base sm:text-lg">{t.desc1}</p>
              <p className="text-white/80 text-sm sm:text-base">{t.hint1}</p>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <a href={LINKS.cookbook_fr} download className="block">
                  <Button className="w-full h-11 text-sm bg-white text-black hover:bg-white/90">
                    <span className="inline-flex items-center gap-2">
                      <Download size={16} /> {cookbookFrLabel}
                    </span>
                  </Button>
                </a>

                <a href={LINKS.cookbook_ar} download className="block">
                  <Button className="w-full h-11 text-sm border border-white/55 bg-white/10 text-white hover:bg-white/15">
                    <span className="inline-flex items-center gap-2">
                      <Download size={16} /> {cookbookArLabel}
                    </span>
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PAGE 2 */}
<section className="snap-start h-[100svh] flex items-end lg:items-center">
  <div className={`w-full px-6 sm:px-10 ${NAV_SAFE_PB} lg:pb-0`}>
    <motion.div style={{ opacity: page2Opacity }} className="max-w-xl space-y-4">
      <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{t.title2}</h2>
      <p className="text-white/90 text-base sm:text-lg">{t.desc2}</p>
      <p className="text-white/80 text-sm sm:text-base">{t.hint2}</p>

      <div className="pt-3">
        <a href={LINKS.catalogue_multi} download className="block">
          <Button className="w-full h-12 text-base bg-black/70 text-white hover:bg-black/60">
            <span className="inline-flex items-center gap-2">
              <Download size={18} /> {t.download2}
            </span>
          </Button>
        </a>
      </div>
    </motion.div>
  </div>
</section>
      </div>
    </div>
  );
}

function FloatImg({
  src,
  className,
  size,
}: {
  src: string;
  className: string;
  size: "md" | "lg" | "xl";
}) {
  const wh = size === "xl" ? "92px" : size === "lg" ? "74px" : "58px";

  return (
    <motion.img
      src={src}
      alt=""
      className={`absolute ${className}`}
      style={{
        width: wh,
        height: wh,
        borderRadius: 9999,
        objectFit: "cover",
        boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
      }}
      animate={{ scale: [1, 1.04, 1], rotate: [-1.2, 1.2, -1.2] }}
      transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
    />
  );
}