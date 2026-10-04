"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck, Phone, Globe } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { HospitalLogo } from "./HospitalLogo";
import { NAV_LINKS } from "@/lib/navLinks";
import { cn } from "@/lib/utils";

// Fixed-size nav icon — same size always, PNG upload or nothing
function NavIcon({ src, size = 18 }: { src: string; size?: number }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
}

export function Navbar() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 bg-white transition-shadow duration-200", scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100")}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-1 min-w-0">
            <HospitalLogo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  pathname === link.href ? "text-primary-700 bg-primary-50" : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                )}
              >
                <NavIcon src={s[link.iconKey]} size={18} />
                {t(link.bn, link.en)}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 ml-3">
            <Link
              href="/appointment"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <CalendarCheck size={16} />
              {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex-shrink-0 ml-2 w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <MobileDrawer open={open} pathname={pathname} t={t} onClose={() => setOpen(false)} />
    </header>
  );
}

function MobileDrawer({
  open, pathname, t, onClose,
}: {
  open: boolean;
  pathname: string;
  t: (bn: string, en: string) => string;
  onClose: () => void;
}) {
  const { lang, toggle } = useLang();
  const { s } = useSiteSettings();

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-primary-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">চ</span>
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-primary-900">{t("শেরপুর চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}</p>
              <p className="text-[10px] text-primary-600">{t("ও ফ্যাকো সেন্টার", "& Phaco Center")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-3 py-3 gap-0.5 overflow-y-auto flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href ? "bg-primary-600 text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {s[link.iconKey] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s[link.iconKey]} alt="" width={20} height={20} style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }} />
              ) : (
                <span className="w-5 h-5 flex-shrink-0" />
              )}
              {t(link.bn, link.en)}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white space-y-2.5">
          <button
            onClick={toggle}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors hover:bg-gray-50 text-sm"
          >
            <Globe size={15} />
            {lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
          </button>
          <a
            href={`tel:${s.phone}`}
            className="flex items-center justify-center gap-2 w-full border border-primary-200 text-primary-700 font-medium py-2.5 rounded-xl transition-colors hover:bg-primary-50 text-sm"
          >
            <Phone size={15} />
            {s.phone}
          </a>
          <Link
            href="/appointment"
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <CalendarCheck size={16} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
        </div>
      </div>
    </>
  );
}
