"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "@/components/ui";

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

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    setIsLocked(false);
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
      <main className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <span className="text-3xl">👁️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">শেরপুর আধুনিক চক্ষু হাসপাতাল</h1>
          <p className="text-primary-300 text-sm mt-1">ম্যানেজমেন্ট পোর্টাল</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">লগইন করুন</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              id="email"
              type="email"
              label="ইমেইল"
              placeholder="admin@sherpureyehospital.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              label="পাসওয়ার্ড"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register("password")}
            />

            {serverError && (
              <div className={`rounded-lg px-4 py-3 text-sm ${isLocked ? "bg-orange-50 text-orange-700 border border-orange-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {isLocked && <span className="font-semibold block mb-0.5">🔒 অ্যাকাউন্ট লক</span>}
                {serverError}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-1">
              লগইন করুন
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            এই পোর্টালটি শুধুমাত্র অনুমোদিত কর্মীদের জন্য।
          </p>
        </div>
      </div>
    </main>
  );
}
