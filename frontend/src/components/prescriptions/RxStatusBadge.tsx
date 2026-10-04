import { RxStatus, RX_STATUS_CONFIG } from "@/types/prescription";

export function RxStatusBadge({ status }: { status: string }) {
  const cfg = RX_STATUS_CONFIG[status as RxStatus] ?? { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
