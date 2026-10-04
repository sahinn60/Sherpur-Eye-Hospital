"use client";

import { Suspense } from "react";
import { AppointmentForm } from "./AppointmentForm";
import { useLang } from "@/context/LangContext";

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-md" />
        ))}
      </div>
      <div className="h-24 bg-gray-200 rounded-md" />
      <div className="h-12 bg-gray-200 rounded-xl" />
    </div>
  );
}

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
          <Suspense fallback={<FormSkeleton />}>
            <AppointmentForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
