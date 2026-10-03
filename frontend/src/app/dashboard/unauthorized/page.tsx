"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">অ্যাক্সেস নেই</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        এই পেজটি দেখার অনুমতি আপনার নেই। প্রয়োজনে অ্যাডমিনের সাথে যোগাযোগ করুন।
      </p>
      <Link
        href="/dashboard"
        className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  );
}
