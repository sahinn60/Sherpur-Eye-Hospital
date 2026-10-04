"use client";

import { use } from "react";
import { RouteGuard } from "@/components/auth";
import { NewPrescriptionEditor } from "@/components/patients/NewPrescriptionEditor";

export default function NewPrescriptionPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      <NewPrescriptionEditor patientId={patientId} />
    </RouteGuard>
  );
}
