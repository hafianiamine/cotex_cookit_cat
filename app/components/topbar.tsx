"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLang, Lang } from "./providers/lang-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, UtensilsCrossed, Package } from "lucide-react";

export function TopBar({
  onGoCatalog1,
  onGoCatalog2,
  activePage,
}: {
  onGoCatalog1?: () => void;
  onGoCatalog2?: () => void;
  activePage?: 0 | 1;
}) {
  const { lang, setLang, t } = useLang();
  const [mounted, setMounted] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => setMounted(true), []);

  const label = useMemo(() => {
    if (hint) return hint;
    return activePage === 1 ? t.catalog2 : t.catalog1;
  }, [hint, activePage, t.catalog1, t.catalog2]);

  const flashHint = (text: string) => {
    setHint(text);
    window.setTimeout(() => setHint(""), 900);
  };

  const cycleLang = () => {
    const order: Lang[] = ["fr", "en", "ar"];
    const idx = order.indexOf(lang);
    const next = order[(idx + 1) % order.length];
    setLang(next);
    flashHint(next.toUpperCase());
  };

  const go1 = () => {
    onGoCatalog1?.();
    flashHint(t.catalog1);
  };

  const go2 = () => {
    onGoCatalog2?.();
    flashHint(t.catalog2);
  };

  if (!mounted) return null;

  return (
    <div
      className={[
        "fixed left-1/2 z-50 -translate-x-1/2",
        "bottom-6 sm:top-5 sm:bottom-auto",
        "w-auto", // ✅ no forced width
      ].join(" ")}
    >
      <Pill label={label} onLang={cycleLang} onC1={go1} onC2={go2} activePage={activePage} />
    </div>
  );
}

function Pill({
  label,
  onLang,
  onC1,
  onC2,
  activePage,
}: {
  label: string;
  onLang: () => void;
  onC1: () => void;
  onC2: () => void;
  activePage?: 0 | 1;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full", // ✅ shrink to content
        "px-1.5 py-1.5",
        "bg-white",
        "border border-black/15",
        "shadow-xl",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5">
        <IconBtn onClick={onLang} active={false} icon={<Languages size={16} />} />
        <IconBtn onClick={onC1} active={activePage === 0} icon={<UtensilsCrossed size={16} />} />
        <IconBtn onClick={onC2} active={activePage === 1} icon={<Package size={16} />} />
      </div>

      <div className="mx-1.5 h-5 w-px bg-black/15" />

      <div className="min-w-[78px] pr-2 text-[11px] font-semibold text-black text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {label}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function IconBtn({
  onClick,
  icon,
  active,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative grid place-items-center",
        "h-8 w-8 rounded-full",
        "transition",
        "text-black",
        active ? "bg-black/10" : "bg-transparent",
        "hover:bg-black/5",
      ].join(" ")}
      aria-label="nav"
    >
      {icon}
      {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-black" />}
    </button>
  );
}
