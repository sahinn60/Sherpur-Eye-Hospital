"use client";

import { useEffect, useState, useMemo } from "react";
import { buildRxHTML } from "./rxPrintBuilder";
import { fetchHospitalRxSettings, fetchDoctorRxSettings, HospitalRxSettings } from "@/lib/services/adminPrescriptionService";
import { fetchRxSettings, DoctorPrescriptionSettings } from "@/lib/services/prescriptionService";
import type { RxItem } from "@/lib/services/prescriptionService";

export interface LivePreviewData {
  patient?: {
    id: string; patientId: string; nameBn: string; nameEn: string;
    phone: string; age?: number | null; gender: string; address?: string | null;
  } | null;
  doctorId?: string;
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
  const [hospital, setHospital] = useState<HospitalRxSettings>({});
  const [liveSettings, setLiveSettings] = useState<Partial<DoctorPrescriptionSettings>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchHospitalRxSettings(),
      fetchRxSettings(),
    ]).then(([hospResult, settingsResult]) => {
      if (hospResult.status === "fulfilled") setHospital(hospResult.value);
      if (settingsResult.status === "fulfilled" && settingsResult.value) {
        setLiveSettings(settingsResult.value);
      }
      setReady(true);
    });
  }, []);

  // Fetch selected doctor's settings when doctorId changes
  useEffect(() => {
    if (!data.doctorId) {
      setLiveSettings({});
      return;
    }
    fetchDoctorRxSettings(data.doctorId).then((s) => {
      setLiveSettings(s ?? {});
    }).catch(() => { setLiveSettings({}); });
  }, [data.doctorId]);

  const effectiveSettings = useMemo(
    () => doctorSettings ?? liveSettings,
    [doctorSettings, liveSettings]
  );

  const html = useMemo(() => {
    if (!ready) return "";
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
    return buildRxHTML(rxData as any, effectiveSettings, hospital, false);
  }, [data, effectiveSettings, hospital, ready]);

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <iframe
      title="Live Prescription Preview"
      srcDoc={html}
      className="w-full h-full border-0 bg-white"
      style={{ minHeight: 0 }}
    />
  );
}
