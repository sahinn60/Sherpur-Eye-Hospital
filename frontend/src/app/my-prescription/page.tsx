"use client";

import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { Search, FileText, Printer, User, Calendar, Stethoscope } from "lucide-react";
import { buildRxHTML } from "@/components/clinic/rxPrintBuilder";

const API = process.env.NEXT_PUBLIC_API_URL;

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

export default function MyPrescriptionPage() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) { setResults([]); setSearched(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/public/search?q=${encodeURIComponent(query.trim())}`;
        const res = await fetch(url);
        const json = await res.json();
        setResults(json.data || []);
        setSearched(true);
      } catch { setResults([]); setSearched(true); }
      finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  async function handlePrint(rx: any) {
    try {
      const res = await fetch(`${API}/prescriptions/admin/hospital-settings`);
      const json = await res.json();
      const hosp = json.data || {};
      const settings = rx.doctor?.prescriptionSettings ?? {};
      const html = buildRxHTML(rx, settings, hosp, true);
      const win = window.open("", "_blank", "width=900,height=1200");
      if (win) { win.document.write(html); win.document.close(); win.focus(); setTimeout(() => win.print(), 600); }
    } catch {}
  }

  return (
    <PublicLayout>
      <PageHero
        tag="প্রেসক্রিপশন"
        title="আপনার প্রেসক্রিপশন দেখুন"
        subtitle="নাম, ফোন নম্বর বা রোগী আইডি দিয়ে সার্চ করুন"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "প্রেসক্রিপশন" }]}
      />

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-4">

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">নাম / ফোন নম্বর / রোগী আইডি লিখুন</p>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="যেমন: সাহিন আহমেদ / 01700... / PAT-2026-0001"
                className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">কমপক্ষে ২ অক্ষর লিখুন</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-28 bg-white rounded-2xl border border-gray-200 animate-pulse" />)}
            </div>
          )}

          {/* No results */}
          {!loading && searched && results.length === 0 && (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">কোনো প্রেসক্রিপশন পাওয়া যায়নি</p>
              <p className="text-sm text-gray-400 mt-1">নাম, ফোন বা রোগী আইডি সঠিকভাবে লিখুন</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !searched && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={36} className="text-blue-400" />
              </div>
              <p className="text-gray-500 font-medium">আপনার তথ্য দিয়ে সার্চ করুন</p>
              <p className="text-sm text-gray-400 mt-1">শুধুমাত্র চূড়ান্ত (Finalized) প্রেসক্রিপশন দেখা যাবে</p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{results.length}টি প্রেসক্রিপশন পাওয়া গেছে</p>
              {results.map((rx) => (
                <div key={rx.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Patient info */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                          <User size={14} className="text-blue-500" />
                          {rx.patient?.nameBn}
                        </div>
                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{rx.patient?.patientId}</span>
                        <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">চূড়ান্ত</span>
                      </div>

                      {/* Rx info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                        <span className="font-mono">Rx# {rx.rxNo}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {fmt(rx.createdAt)}</span>
                        {rx.doctor?.nameBn && <span>ডা. {rx.doctor.nameBn}</span>}
                      </div>

                      {rx.diagnosis && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">রোগ: {rx.diagnosis}</p>
                      )}

                      {rx.items?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rx.items.slice(0, 4).map((item: any, i: number) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.medicineName}</span>
                          ))}
                          {rx.items.length > 4 && <span className="text-xs text-gray-400">+{rx.items.length - 4} আরো</span>}
                        </div>
                      )}

                      {rx.followUpDate && (
                        <p className="text-xs text-emerald-600 mt-2">ফলো-আপ: {fmt(rx.followUpDate)}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handlePrint(rx)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
                    >
                      <Printer size={13} /> প্রিন্ট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
