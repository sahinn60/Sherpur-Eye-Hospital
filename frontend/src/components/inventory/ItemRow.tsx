"use client";

import { Edit2, History, TrendingUp, TrendingDown, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import {
  InventoryItem, INVENTORY_CATEGORY_BN, INVENTORY_CATEGORY_COLOR,
} from "@/types/inventory";

interface Props {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onHistory: (item: InventoryItem) => void;
  onStockIn: (item: InventoryItem) => void;
  onStockOut: (item: InventoryItem) => void;
  onToggle: (item: InventoryItem) => void;
  canWrite: boolean;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function expiryStatus(d: string | null): "expired" | "soon" | "ok" | null {
  if (!d) return null;
  const diff = (new Date(d).getTime() - Date.now()) / 86400000;
  if (diff < 0)  return "expired";
  if (diff <= 30) return "soon";
  return "ok";
}

export function ItemRow({ item, onEdit, onHistory, onStockIn, onStockOut, onToggle, canWrite }: Props) {
  const isLow    = item.stockQty <= item.minStock;
  const expSt    = expiryStatus(item.expiryDate);

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${!item.isActive ? "opacity-50" : ""}`}>
      {/* Item */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{item.nameBn}</p>
            <p className="text-xs text-gray-400 truncate">{item.name}</p>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className="px-4 py-3">
        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.sku}</span>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INVENTORY_CATEGORY_COLOR[item.category]}`}>
          {INVENTORY_CATEGORY_BN[item.category]}
        </span>
      </td>

      {/* Supplier */}
      <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">
        {item.supplier?.name || "—"}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold ${isLow ? "text-red-600" : "text-gray-900"}`}>
            {item.stockQty}
          </span>
          <span className="text-xs text-gray-400">{item.unit}</span>
          {isLow && <AlertTriangle size={13} className="text-red-500 shrink-0" />}
        </div>
        <p className="text-xs text-gray-400">ন্যূনতম: {item.minStock}</p>
      </td>

      {/* Price */}
      <td className="px-4 py-3 hidden xl:table-cell">
        <p className="text-xs text-gray-600">ক্রয়: ৳{item.purchasePrice.toFixed(0)}</p>
        <p className="text-xs text-gray-600">বিক্রয়: ৳{item.sellingPrice.toFixed(0)}</p>
      </td>

      {/* Expiry */}
      <td className="px-4 py-3 hidden md:table-cell">
        {item.expiryDate ? (
          <span className={`text-xs font-medium ${
            expSt === "expired" ? "text-red-600" :
            expSt === "soon"    ? "text-amber-600" : "text-gray-600"
          }`}>
            {expSt === "expired" ? "⚠ " : expSt === "soon" ? "⏰ " : ""}
            {fmtDate(item.expiryDate)}
          </span>
        ) : <span className="text-xs text-gray-400">—</span>}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {canWrite && (
            <>
              <button onClick={() => onStockIn(item)} title="স্টক যোগ"
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                <TrendingUp size={14} />
              </button>
              <button onClick={() => onStockOut(item)} title="স্টক কমান"
                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                <TrendingDown size={14} />
              </button>
              <button onClick={() => onEdit(item)} title="সম্পাদনা"
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Edit2 size={14} />
              </button>
              <button onClick={() => onToggle(item)} title={item.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                {item.isActive ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
              </button>
            </>
          )}
          <button onClick={() => onHistory(item)} title="ইতিহাস"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <History size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
