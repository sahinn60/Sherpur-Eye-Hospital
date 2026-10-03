"use client";

import { useEffect, useState } from "react";
import { Service } from "@/types/service";
import { fetchServices, fetchServiceById } from "@/lib/services/serviceService";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useServices() {
  const [state, setState] = useState<FetchState<Service[]>>({ data: null, loading: true, error: null });

  useEffect(() => {
    fetchServices()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        console.error("[useServices]", err);
        setState({ data: null, loading: false, error: err?.response?.data?.message || err?.message || "Failed to load services" });
      });
  }, []);

  return state;
}

export function useServiceById(id: string) {
  const [state, setState] = useState<FetchState<Service>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    fetchServiceById(id)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        console.error("[useServiceById]", err);
        setState({ data: null, loading: false, error: err?.response?.data?.message || err?.message || "Service not found" });
      });
  }, [id]);

  return state;
}
