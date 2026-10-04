"use client";

import { Suspense } from "react";
import { AppointmentForm } from "./AppointmentForm";
import { useLang } from "@/context/LangContext";

export function AppointmentSection() {
  const { t } = useLang();

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-gray-50 min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("অ্যাপয়েন্টমেন্ট অনুরোধ", "Appointment Request")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {t(
                "ফর্মটি পূরণ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
                "Fill out the form. We will contact you shortly."
              )}
            </p>
          </div>
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-xl" />}>
            <AppointmentForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
