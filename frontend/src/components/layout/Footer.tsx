"use client";

import Link from "next/link";
import { Eye, Phone, Mail, MapPin, Facebook, Youtube, Instagram } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { NAV_LINKS } from "@/lib/navLinks";

export function Footer() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">
                  {t(s.hospital_name_bn, s.hospital_name_en)}
                </p>
                <p className="text-primary-400 text-xs">
                  {t(s.tagline_bn, s.tagline_en)}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t(
                "শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি আধুনিক চক্ষু হাসপাতাল।",
                "A modern eye hospital dedicated to eye care for the people of Sherpur district."
              )}
            </p>
            <div className="flex gap-3">
              {s.social_facebook && (
                <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {s.social_youtube && (
                <a href={s.social_youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors">
                  <Youtube size={16} />
                </a>
              )}
              {s.social_instagram && (
                <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("দ্রুত লিংক", "Quick Links")}</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {s[link.iconKey] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s[link.iconKey]} alt="" width={14} height={14} style={{ width: 14, height: 14, objectFit: "contain", opacity: 0.7 }} />
                    )}
                    {t(link.bn, link.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("আমাদের সেবা", "Our Services")}</h3>
            <ul className="space-y-2">
              {[
                { bn: "ফ্যাকো ক্যাটারেক্ট সার্জারি", en: "Phaco Cataract Surgery" },
                { bn: "রেটিনা চিকিৎসা", en: "Retina Treatment" },
                { bn: "গ্লুকোমা চিকিৎসা", en: "Glaucoma Treatment" },
                { bn: "শিশু চক্ষু চিকিৎসা", en: "Pediatric Eye Care" },
                { bn: "চশমার পাওয়ার পরীক্ষা", en: "Refraction & Glasses" },
                { bn: "জরুরি চক্ষু সেবা", en: "Emergency Eye Care" },
              ].map((svc) => (
                <li key={svc.en}>
                  <Link href="/services" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {t(svc.bn, svc.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("যোগাযোগ", "Contact")}</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span>{t(s.address_bn, s.address_en)}</span>
              </li>
              <li>
                <a href={`tel:${s.phone}`} className="flex gap-3 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  <Phone size={16} className="text-primary-400 flex-shrink-0" />
                  {s.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="flex gap-3 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  <Mail size={16} className="text-primary-400 flex-shrink-0" />
                  <span className="break-all">{s.email}</span>
                </a>
              </li>
              <li className="text-sm text-gray-400 pt-1">
                <p className="text-gray-500 text-xs mb-1">{t("সময়সূচি", "Hours")}</p>
                <p>{t(s.hours_bn, s.hours_en)}</p>
                <p className="mt-1">{t(s.friday_bn, s.friday_en)}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {year} {t(`${s.hospital_name_bn}। সর্বস্বত্ব সংরক্ষিত।`, `${s.hospital_name_en}. All rights reserved.`)}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">{t("গোপনীয়তা নীতি", "Privacy Policy")}</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">{t("শর্তাবলী", "Terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
