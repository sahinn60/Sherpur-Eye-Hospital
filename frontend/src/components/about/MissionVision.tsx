"use client";

import { useLang } from "@/context/LangContext";
import { MISSION_VISION } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

export function MissionVision() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          tag={t("উদ্দেশ্য ও দৃষ্টিভঙ্গি", "Purpose & Vision")}
          title={t("আমরা কী বিশ্বাস করি", "What We Believe In")}
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-primary-900 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-700 opacity-30 -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-5 text-2xl">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t(MISSION_VISION.missionTitleBn, MISSION_VISION.missionTitleEn)}
              </h3>
              <p className="text-primary-200 leading-relaxed text-lg">
                {t(MISSION_VISION.missionBn, MISSION_VISION.missionEn)}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white border-2 border-primary-100 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-50 -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5 text-2xl">
                🌟
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t(MISSION_VISION.visionTitleBn, MISSION_VISION.visionTitleEn)}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t(MISSION_VISION.visionBn, MISSION_VISION.visionEn)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
