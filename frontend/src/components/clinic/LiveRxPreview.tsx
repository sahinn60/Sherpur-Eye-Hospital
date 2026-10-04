"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { buildRxHTML } from "./rxPrintBuilder";
import { fetchHospitalRxSettings, HospitalRxSettings } from "@/lib/services/adminPrescriptionService";
import { fetchRxSettings, DoctorPrescriptionSettings } from "@/lib/services/prescriptionService";
import type { RxItem } from "@/lib/services/prescriptionService";

export interface LivePreviewData {
  // Patient
  patient?: {
    id: string; patientId: string; nameBn: string; nameEn: string;
    phone: string; age?: number | null; gender: string; address?: string | null;
  } | null;
  // Doctor
  doctorId?: string;
  // Clinical
  chiefComplaint?: string;
  history?: string;
  vaRightEye?: string;
  vaLeftEye?: string;
  iopRightEye?: string;
  iopLeftEye?: string;
  refractionRE?: string;
  refractionLE?: string;
  examNotes?: string;
  diagnosis?: string;
  investigations?: string;
  advice?: string;
  instructions?: string;
  followUpDate?: string;
  followUpNote?: string;
  items?: RxItem[];
}

interface Props {
  data: LivePreviewData;
  doctorSettings?: Partial<DoctorPrescriptionSettings> | null;
}

export function LiveRxPreview({ data, doctorSettings }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hospital, setHospital] = useState<HospitalRxSettings>({});
  const [liveSettings, setLiveSettings] = useState<Partial<DoctorPrescriptionSettings>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load hospital + doctor settings once
  useEffect(() => {
    fetchHospitalRxSettings().then(setHospital).catch(() => {});
    fetchRxSettings().then((s) => { if (s) setLiveSettings(s); }).catch(() => {});
  }, []);

  const effectiveSettings = doctorSettings ?? liveSettings;

  const writePreview = useCallback(() => {
    if (!iframeRef.current) return;
    const now = new Date().toISOString();
    const rxData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      id: "preview",
      rxNo: "PREVIEW",
      rxType: "clinical" as const,
      status: "DRAFT" as const,
      items: data.items || [],
    };
    const html = buildRxHTML(rxData as any, effectiveSettings, hospital, false);
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [data, effectiveSettings, hospital]);

  // Debounce preview updates 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(writePreview, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [writePreview]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Prescription Preview"
      className="w-full h-full border-0 bg-white"
      style={{ minHeight: 0 }}
    />
  );
}
