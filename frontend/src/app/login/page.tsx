"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

const schema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(""); setIsLocked(false);
    try {
      await login(data.email, data.password);
      router.replace("/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "লগইন ব্যর্থ হয়েছে";
      if (status === 423) setIsLocked(true);
      setServerError(message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f0f2f5" }}>
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex" style={{ background: "#f0f2f5" }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
            👁️
          </div>
          <div>
            <p className="text-sm font-bold text-white">শেরপুর আধুনিক চক্ষু হাসপাতাল</p>
            <p className="text-xs" style={{ color: "#93c5fd" }}>ও ফ্যাকো সেন্টার</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-8"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
            👁️
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            স্বাগতম<br />ম্যানেজমেন্ট পোর্টালে
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#93c5fd" }}>
            শেরপুর আধুনিক চক্ষু হাসপাতালের সম্পূর্ণ ব্যবস্থাপনা এক জায়গায়।
            রোগী, চিকিৎসক, কর্মচারী ও অর্থ সব কিছু পরিচালনা করুন।
          </p>

          <div className="flex flex-col gap-3 mt-8">
            {[
              "রোগী ও অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা",
              "কর্মচারী ও উপস্থিতি ট্র্যাকিং",
              "বিলিং ও আর্থিক রিপোর্ট",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(59,130,246,0.3)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "#60a5fa" }} />
                </div>
                <span className="text-sm" style={{ color: "#bfdbfe" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 relative z-10">
          <ShieldCheck size={14} style={{ color: "#60a5fa" }} />
          <p className="text-xs" style={{ color: "#64748b" }}>
            SSL সুরক্ষিত • শুধুমাত্র অনুমোদিত কর্মীদের জন্য
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
              👁️
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#0f172a" }}>শেরপুর আধুনিক চক্ষু হাসপাতাল</p>
              <p className="text-xs" style={{ color: "#64748b" }}>ম্যানেজমেন্ট পোর্টাল</p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>লগইন করুন</h1>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                  ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                  <input
                    type="email"
                    placeholder="admin@sherpureyehospital.com"
                    autoComplete="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      border: errors.email ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "white"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                  />
                </div>
                {errors.email && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      border: errors.password ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      background: "#f9fafb",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.background = "white"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.password ? "#ef4444" : "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#9ca3af" }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.password.message}</p>}
              </div>

              {/* Error */}
              {serverError && (
                <div className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: isLocked ? "#fff7ed" : "#fef2f2",
                    border: `1px solid ${isLocked ? "#fed7aa" : "#fecaca"}`,
                    color: isLocked ? "#c2410c" : "#dc2626",
                  }}>
                  {isLocked && <span className="font-semibold block mb-0.5">🔒 অ্যাকাউন্ট লক</span>}
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mt-2"
                style={{
                  background: isSubmitting ? "#93c5fd" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  boxShadow: isSubmitting ? "none" : "0 4px 12px rgba(59,130,246,0.4)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    লগইন হচ্ছে...
                  </span>
                ) : "লগইন করুন →"}
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: "#9ca3af" }}>
              এই পোর্টালটি শুধুমাত্র অনুমোদিত কর্মীদের জন্য।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
