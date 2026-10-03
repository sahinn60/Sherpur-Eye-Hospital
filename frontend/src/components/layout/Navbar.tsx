"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { HospitalLogo } from "./HospitalLogo";
import { NAV_LINKS } from "@/lib/navLinks";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-shadow duration-200",
        scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <HospitalLogo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                )}
              >
                {t(link.bn, link.en)}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/appointment"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <CalendarCheck size={16} />
              {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={open} pathname={pathname} t={t} />
    </header>
  );
}

function MobileDrawer({
  open,
  pathname,
  t,
}: {
  open: boolean;
  pathname: string;
  t: (bn: string, en: string) => string;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-white z-40 lg:hidden shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-primary-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">চ</span>
            </div>
            <span className="text-sm font-bold text-primary-900">
              {t("শেরপুর চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-3 py-4 gap-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {t(link.bn, link.en)}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <Link
            href="/appointment"
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <CalendarCheck size={18} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
        </div>
      </div>
    </>
  );
}
