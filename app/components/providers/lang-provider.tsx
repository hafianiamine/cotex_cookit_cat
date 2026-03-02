"use client";

import React from "react";

export type Lang = "fr" | "en" | "ar";

type Dict = {
  // Page 1 (Cookbook)
  title1: string;
  desc1: string;
  hint1: string;
  downloadFR: string;
  downloadAR: string;

  // Page 2 (Products)
  title2: string;
  desc2: string;
  hint2: string;
  download2: string;

  catalog1: string;
  catalog2: string;
};

const DICTS: Record<Lang, Dict> = {
  fr: {
    title1: "Livre de cuisine Cotex Cookit",
    desc1: "Recettes Cotex — téléchargez votre livre en un clic.",
    hint1: "Choisissez une langue, puis téléchargez.",
    downloadFR: "Télécharger (FR)",
    downloadAR: "Télécharger (AR)",

    title2: "Catalogue produits Cotex",
    desc2: "Catalogue complet (FR / AR / EN) dans un seul fichier.",
    hint2: "Téléchargez le catalogue multi-langues.",
    download2: "Télécharger le catalogue",

    catalog1: "Catalogue 1",
    catalog2: "Catalogue 2",
  },
  en: {
    title1: "Cotex Cookit Cookbook",
    desc1: "Cotex recipes — download the cookbook in one click.",
    hint1: "Choose a language, then download.",
    downloadFR: "Download (FR)",
    downloadAR: "Download (AR)",

    title2: "Cotex Products Catalog",
    desc2: "Full catalog (FR / AR / EN) in a single file.",
    hint2: "Download the multi-language catalog.",
    download2: "Download catalog",

    catalog1: "Catalog 1",
    catalog2: "Catalog 2",
  },
  ar: {
    title1: "كتاب طبخ كوتكس كوكِت",
    desc1: "وصفات كوتكس — حمّل كتاب الطبخ بنقرة واحدة.",
    hint1: "اختر اللغة ثم قم بالتحميل.",
    downloadFR: "تحميل (FR)",
    downloadAR: "تحميل (AR)",

    title2: "كتالوج منتجات كوتكس",
    desc2: "كتالوج كامل (FR / AR / EN) في ملف واحد.",
    hint2: "حمّل الكتالوج متعدد اللغات.",
    download2: "تحميل الكتالوج",

    catalog1: "كتالوج 1",
    catalog2: "كتالوج 2",
  },
};

const LangContext = React.createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "ltr" | "rtl";
  t: Dict;
}>({
  lang: "fr",
  setLang: () => {},
  dir: "ltr",
  t: DICTS.fr,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("fr");
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const t = DICTS[lang];

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, dir, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return React.useContext(LangContext);
}
