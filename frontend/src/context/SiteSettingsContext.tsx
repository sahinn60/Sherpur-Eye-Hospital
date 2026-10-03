"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchPublicSettings } from "@/lib/services/cmsService";
import type { HospitalSettings } from "@/types/cms";
import { HOSPITAL_INFO, STATS } from "@/lib/config/siteConfig";

// Fallback defaults from siteConfig so the site works even before DB is seeded
const DEFAULTS: HospitalSettings = {
  hospital_name_bn: HOSPITAL_INFO.nameBn,
  hospital_name_en: HOSPITAL_INFO.nameEn,
  tagline_bn:       HOSPITAL_INFO.taglineBn,
  tagline_en:       HOSPITAL_INFO.taglineEn,
  phone:            HOSPITAL_INFO.phone,
  emergency:        HOSPITAL_INFO.emergency,
  email:            HOSPITAL_INFO.email,
  address_bn:       HOSPITAL_INFO.addressBn,
  address_en:       HOSPITAL_INFO.addressEn,
  map_embed_url:    HOSPITAL_INFO.mapEmbedUrl,
  hours_bn:         HOSPITAL_INFO.hoursBn,
  hours_en:         HOSPITAL_INFO.hoursEn,
  friday_bn:        HOSPITAL_INFO.fridayBn,
  friday_en:        HOSPITAL_INFO.fridayEn,
  social_facebook:  HOSPITAL_INFO.socialFacebook,
  social_youtube:   HOSPITAL_INFO.socialYoutube,
  social_instagram: "",
  hero_badge_bn:    "শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র",
  hero_badge_en:    "Modern Eye Care Center in Sherpur",
  hero_title_bn:    "আপনার দৃষ্টিশক্তি আমাদের দায়িত্ব",
  hero_title_en:    "Your Vision, Our Responsibility",
  hero_desc_bn:     "শেরপুর আধুনিক চক্ষু হাসপাতালে আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের মাধ্যমে আপনার চোখের সর্বোত্তম যত্ন নিশ্চিত করি।",
  hero_desc_en:     "At Sherpur Adhunik Eye Hospital, we ensure the best care for your eyes through modern technology and experienced doctors.",
  stat1_value_bn:   STATS[0].valueBn,  stat1_value_en: STATS[0].valueEn,
  stat1_label_bn:   STATS[0].labelBn,  stat1_label_en: STATS[0].labelEn,
  stat2_value_bn:   STATS[1].valueBn,  stat2_value_en: STATS[1].valueEn,
  stat2_label_bn:   STATS[1].labelBn,  stat2_label_en: STATS[1].labelEn,
  stat3_value_bn:   STATS[2].valueBn,  stat3_value_en: STATS[2].valueEn,
  stat3_label_bn:   STATS[2].labelBn,  stat3_label_en: STATS[2].labelEn,
  stat4_value_bn:   STATS[3].valueBn,  stat4_value_en: STATS[3].valueEn,
  stat4_label_bn:   STATS[3].labelBn,  stat4_label_en: STATS[3].labelEn,
  about_title_bn:   "আমাদের সম্পর্কে",
  about_title_en:   "About Us",
  about_desc_bn:    "শেরপুর আধুনিক চক্ষু হাসপাতাল শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত।",
  about_desc_en:    "Sherpur Adhunik Eye Hospital is dedicated to eye care for the people of Sherpur district.",
  about_mission_bn: "সাশ্রয়ী মূল্যে সর্বোচ্চ মানের চক্ষু সেবা প্রদান করা।",
  about_mission_en: "To provide the highest quality eye care at affordable prices.",
  about_vision_bn:  "শেরপুর জেলায় অন্ধত্বমুক্ত সমাজ গড়ে তোলা।",
  about_vision_en:  "To build a blindness-free society in Sherpur district.",
};

interface SiteSettingsCtx {
  s: HospitalSettings;
  loading: boolean;
}

const Ctx = createContext<SiteSettingsCtx>({ s: DEFAULTS, loading: true });

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<HospitalSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings()
      .then((map) => setS({ ...DEFAULTS, ...map } as HospitalSettings))
      .catch(() => {/* keep defaults */})
      .finally(() => setLoading(false));
  }, []);

  return <Ctx.Provider value={{ s, loading }}>{children}</Ctx.Provider>;
}

export function useSiteSettings() {
  return useContext(Ctx);
}
