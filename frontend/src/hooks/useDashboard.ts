"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export interface DashboardStats {
  cards: {
    totalPatients: number;
    totalDoctors: number;
    totalEmployees: number;
    todayAppointments: number;
    pendingAppointments: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
  };
  recentAppointments: {
    id: string;
    requestId: string;
    patientName: string;
    preferredDate: string;
    preferredTime: string;
    status: string;
    doctor: { nameBn: string; nameEn: string } | null;
  }[];
  statusBreakdown: { status: string; count: number }[];
  weeklyAppointments: { date: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
}

interface State {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setState({ data: res.data.data, loading: false, error: null }))
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to load dashboard";
        setState({ data: null, loading: false, error: msg });
      });
  }, []);

  return state;
}
