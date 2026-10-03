"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { DoctorAdmin } from "@/types/doctor";

interface Props {
  doctor:    DoctorAdmin;
  onConfirm: (data: { email: string; password: string }) => Promise<void>;
  onClose:   () => void;
}

export function AssignDoctorAccountModal({ doctor, onConfirm, onClose }: Props) {
  const [email, setEmail]       = useState(doctor.email || "");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("ইমেইল ও পাসওয়ার্ড দিন"); return; }
    if (password.length < 6)  { setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"); return; }
    setLoading(true); setError("");
    try {
      await onConfirm({ email, password });
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setLoading(false); }
  }

  return (
    <Modal open onClose={onClose} title="লগইন অ্যাকাউন্ট তৈরি করুন" size="sm">
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-800">{doctor.nameBn}</span>-এর জন্য DOCTOR রোলে একটি লগইন অ্যাকাউন্ট তৈরি হবে।
      </p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ইমেইল</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৬ অক্ষর"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>বাতিল</Button>
          <Button type="submit" loading={loading}>তৈরি করুন</Button>
        </div>
      </form>
    </Modal>
  );
}
