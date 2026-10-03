"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { fetchDoctors, fetchDoctorById } from "@/lib/services/doctorService";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDoctors() {
  const [state, setState] = useState<FetchState<Doctor[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchDoctors()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load doctors";
        console.error("[useDoctors] error:", err);
        setState({ data: null, loading: false, error: msg });
      });
  }, []);

  return state;
}

export function useDoctorById(id: string) {
  const [state, setState] = useState<FetchState<Doctor>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    fetchDoctorById(id)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Doctor not found";
        console.error("[useDoctorById] error:", err);
        setState({ data: null, loading: false, error: msg });
      });
  }, [id]);

  return state;
}
