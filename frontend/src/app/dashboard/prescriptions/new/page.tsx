"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewPrescriptionPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/prescriptions"); }, [router]);
  return null;
}
