"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { fetchActiveNotices } from "@/lib/services/cmsService";
import type { Notice } from "@/types/cms";

export function NoticeTicker() {
  const { t } = useLang();
  const [notices,   setNotices]   = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchActiveNotices().then(setNotices).catch(() => {});
  }, []);

  if (dismissed || notices.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={t("নোটিশ", "Notices")}
      aria-live="polite"
      className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-amber-700 shrink-0 text-xs whitespace-nowrap">
          <Bell size={13} aria-hidden="true" />
          {t("নোটিশ", "Notice")}
        </span>

        <div className="flex-1 overflow-hidden" aria-hidden="true">
          {/* Duplicate items so the loop is seamless */}
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...notices, ...notices].map((n, i) => (
              <span key={`${n.id}-${i}`} className="inline-flex items-center gap-1">
                {n.link ? (
                  <Link href={n.link} className="hover:underline text-amber-800">
                    {t(n.textBn, n.textEn || n.textBn)}
                  </Link>
                ) : (
                  <span>{t(n.textBn, n.textEn || n.textBn)}</span>
                )}
                <span className="text-amber-400 mx-2" aria-hidden="true">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Screen-reader accessible notice list */}
        <ul className="sr-only">
          {notices.map((n) => (
            <li key={n.id}>{t(n.textBn, n.textEn || n.textBn)}</li>
          ))}
        </ul>

        <button
          onClick={() => setDismissed(true)}
          aria-label={t("নোটিশ বন্ধ করুন", "Dismiss notices")}
          className="shrink-0 text-amber-500 hover:text-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
