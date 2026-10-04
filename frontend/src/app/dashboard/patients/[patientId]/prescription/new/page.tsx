"use client";

import { RouteGuard } from "@/components/auth";
import { NewPrescriptionEditor } from "@/components/patients/NewPrescriptionEditor";

export default function NewPrescriptionPage({
  params,
}: {
  params: { patientId: string };
}) {
  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      <NewPrescriptionEditor patientId={params.patientId} />
    </RouteGuard>
  );
}
