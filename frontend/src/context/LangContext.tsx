"use client";

import { createContext, useContext, useState } from "react";

type Lang = "bn" | "en";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (bn: string, en: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("bn");

  function toggle() {
    setLang((prev) => (prev === "bn" ? "en" : "bn"));
  }

  function t(bn: string, en: string) {
    return lang === "bn" ? bn : en;
  }

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
