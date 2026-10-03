"use client";

import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <SiteSettingsProvider>
        <AuthProvider>{children}</AuthProvider>
      </SiteSettingsProvider>
    </LangProvider>
  );
}
