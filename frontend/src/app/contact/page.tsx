"use client";

import { useState } from "react";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";
import { Phone, Mail, MapPin, Clock, Send, Facebook, Youtube, Instagram } from "lucide-react";
import { submitContactMessage } from "@/lib/services/cmsService";

export default function ContactPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();

  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitContactMessage(form);
      setSent(true);
      setForm({ name: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError(t("বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Failed to send. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  const contacts = [
    {
      icon: <Phone size={20} className="text-primary-600" />,
      labelBn: "ফোন নম্বর", labelEn: "Phone",
      valueBn: s.phone, valueEn: s.phone,
      href: `tel:${s.phone}`,
    },
    {
      icon: <Phone size={20} className="text-red-500" />,
      labelBn: "জরুরি নম্বর", labelEn: "Emergency",
      valueBn: s.emergency, valueEn: s.emergency,
      href: `tel:${s.emergency}`,
    },
    {
      icon: <Mail size={20} className="text-primary-600" />,
      labelBn: "ইমেইল", labelEn: "Email",
      valueBn: s.email, valueEn: s.email,
      href: `mailto:${s.email}`,
    },
    {
      icon: <MapPin size={20} className="text-primary-600" />,
      labelBn: "ঠিকানা", labelEn: "Address",
      valueBn: s.address_bn, valueEn: s.address_en,
      href: undefined,
    },
    {
      icon: <Clock size={20} className="text-primary-600" />,
      labelBn: "সময়সূচি", labelEn: "Hours",
      valueBn: `${s.hours_bn}\n${s.friday_bn}`,
      valueEn: `${s.hours_en}\n${s.friday_en}`,
      href: undefined,
    },
  ];

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white transition-all";

  return (
    <PublicLayout>
      <PageHero
        tag={t("যোগাযোগ / Contact", "Contact")}
        title={t("আমাদের সাথে যোগাযোগ করুন", "Get in Touch With Us")}
        subtitle={t("চোখের যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন।", "Contact us for any eye-related concerns.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("যোগাযোগ", "Contact") }]}
        bgImage={s.hero_contact_image || undefined}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left — contact info */}
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
                {t("যোগাযোগের তথ্য", "Contact Information")}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-6">
                {t("আমরা সাহায্য করতে প্রস্তুত", "We're Ready to Help")}
              </h2>

              <div className="space-y-5 mb-8">
                {contacts.map((c, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                        {t(c.labelBn, c.labelEn)}
                      </p>
                      {c.href ? (
                        <a href={c.href} className="text-gray-800 font-medium text-sm hover:text-primary-600 transition-colors whitespace-pre-line">
                          {t(c.valueBn, c.valueEn)}
                        </a>
                      ) : (
                        <p className="text-gray-800 font-medium text-sm whitespace-pre-line">{t(c.valueBn, c.valueEn)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3">{t("সোশ্যাল মিডিয়া", "Social Media")}</p>
                <div className="flex gap-3">
                  {s.social_facebook && (
                    <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <Facebook size={18} className="text-blue-600" />
                    </a>
                  )}
                  {s.social_youtube && (
                    <a href={s.social_youtube} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <Youtube size={18} className="text-red-600" />
                    </a>
                  )}
                  {s.social_instagram && (
                    <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors">
                      <Instagram size={18} className="text-pink-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right — contact form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{t("বার্তা পাঠান", "Send a Message")}</h3>
                <p className="text-sm text-gray-500 mt-1">{t("ফর্মটি পূরণ করুন, আমরা যত দ্রুত সম্ভব যোগাযোগ করব।", "Fill out the form and we’ll get back to you as soon as possible.")}</p>
              </div>

              {sent && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  {t("আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।", "Your message was sent successfully. We’ll contact you shortly.")}
                </div>
              )}
              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("আপনার নাম", "Your Name")}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder={t("যেমন: মোহাম্মদ আলি", "e.g. Mohammad Ali")}
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("ফোন নম্বর", "Phone Number")}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder={t("যেমন: 01700-000000", "e.g. 01700-000000")}
                      className={inp}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("বিষয়", "Subject")}
                    <span className="text-gray-400 text-xs font-normal ml-1">({t("ঐচ্ছিক", "optional")})</span>
                  </label>
                  <input
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder={t("যেমন: চোখের পরীক্ষা সম্পর্কে জানতে চাই", "e.g. Inquiry about eye examination")}
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("আপনার বার্তা", "Your Message")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={t(
                      "আপনার সমস্যা বা জিজ্ঞাসা বিস্তারিতভাবে লিখুন...নন্যেমন: আমার ডান চোখে ধীরে ধীরে দেখতে সমস্যা হচ্ছে, ফ্যাকো অপারেশনের খরচ সম্পর্কে জানতে চাই।",
                      "Describe your concern or question in detail...\ne.g. I am having trouble seeing clearly with my right eye and would like to know about phaco surgery costs."
                    )}
                    className={`${inp} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  <Send size={16} />
                  {submitting ? t("পাঠানো হচ্ছে...", "Sending...") : t("বার্তা পাঠান", "Send Message")}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  {t("সাধারণত ২৪ ঘন্টার মধ্যে সাড়া দেওয়া হয়। জরুরি সমস্যায় সরাসরি ফোন করুন।", "We usually respond within 24 hours. For urgent issues, please call directly.")}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-72 md:h-96">
            <iframe
              src={s.map_embed_url || `https://maps.google.com/maps?q=Sherpur+Adhunik+Eye+Hospital+Sherpur+Bangladesh&output=embed&hl=bn`}
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("হাসপাতালের অবস্থান", "Hospital Location")}
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
