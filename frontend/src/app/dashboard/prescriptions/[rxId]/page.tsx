"use client";
import { useParams } from "next/navigation";
import PrescriptionEditor from "../_editor";
export default function EditRxPage() {
  const { rxId } = useParams<{ rxId: string }>();
  return <PrescriptionEditor rxId={rxId} />;
}
