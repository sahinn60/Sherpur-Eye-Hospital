"use client";

import { Trash2, GripVertical } from "lucide-react";
import type { RxItem } from "@/lib/services/prescriptionService";

const inp = "w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white";

const FREQ = ["দিনে ১ বার","দিনে ২ বার","দিনে ৩ বার","সকাল-রাত","সকাল-দুপুর-রাত","প্রয়োজনে","সাপ্তাহিক"];
const DUR  = ["৩ দিন","৫ দিন","৭ দিন","১০ দিন","১৪ দিন","১ মাস","২ মাস","চলমান"];
const EYES = [{ v: "", l: "N/A" },{ v: "RE", l: "ডান চোখ" },{ v: "LE", l: "বাম চোখ" },{ v: "BE", l: "উভয় চোখ" }];

interface Props {
  item: RxItem;
  index: number;
  onChange: (i: number, k: keyof RxItem, v: string) => void;
  onRemove: (i: number) => void;
  canRemove: boolean;
}

export function MedRow({ item, index, onChange, onRemove, canRemove }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
        <span className="text-xs font-bold text-gray-400 w-5">{index + 1}</span>
        <div className="flex-1">
          <input
            value={item.medicineName}
            onChange={(e) => onChange(index, "medicineName", e.target.value)}
            placeholder="ওষুধের নাম (যেমন: Timolol 0.5% Eye Drop)"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
          />
        </div>
        {canRemove && (
          <button type="button" onClick={() => onRemove(index)}
            className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-7">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">শক্তি</label>
          <input value={item.strength || ""} onChange={(e) => onChange(index, "strength", e.target.value)}
            placeholder="0.5%, 500mg" className={inp} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">ডোজ ফর্ম</label>
          <input value={item.dosageForm || ""} onChange={(e) => onChange(index, "dosageForm", e.target.value)}
            placeholder="Eye Drop, Tablet" className={inp} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">চোখ</label>
          <select value={item.eye || ""} onChange={(e) => onChange(index, "eye", e.target.value)} className={inp}>
            {EYES.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">মাত্রা</label>
          <input value={item.dose || ""} onChange={(e) => onChange(index, "dose", e.target.value)}
            placeholder="১ ফোঁটা" className={inp} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">সময়</label>
          <select value={item.frequency || ""} onChange={(e) => onChange(index, "frequency", e.target.value)} className={inp}>
            <option value="">নির্বাচন করুন</option>
            {FREQ.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">মেয়াদ</label>
          <select value={item.duration || ""} onChange={(e) => onChange(index, "duration", e.target.value)} className={inp}>
            <option value="">নির্বাচন করুন</option>
            {DUR.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] text-gray-400 mb-0.5">নির্দেশনা</label>
          <input value={item.instructions || ""} onChange={(e) => onChange(index, "instructions", e.target.value)}
            placeholder="খাবার পরে / ঘুমানোর আগে" className={inp} />
        </div>
      </div>
    </div>
  );
}
