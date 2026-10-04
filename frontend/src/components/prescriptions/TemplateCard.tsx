"use client";

import { FileText, Edit2, Trash2, Share2, Lock, Copy } from "lucide-react";
import { PrescriptionTemplate } from "@/types/prescription";
import { TemplateCategoryBadge } from "./TemplateCategoryBadge";

interface Props {
  template:    PrescriptionTemplate;
  onEdit:      (t: PrescriptionTemplate) => void;
  onDelete:    (t: PrescriptionTemplate) => void;
  onDuplicate: (t: PrescriptionTemplate) => void;
  onApply?:    (t: PrescriptionTemplate) => void;
  canEdit:     boolean;
}

export function TemplateCard({ template, onEdit, onDelete, onDuplicate, onApply, canEdit }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{template.nameBn}</p>
              <TemplateCategoryBadge category={template.category} />
              {template.isShared
                ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Share2 size={10} /> Shared</span>
                : <span className="flex items-center gap-1 text-xs text-gray-400"><Lock size={10} /> Private</span>
              }
            </div>
            <p className="text-xs text-gray-400 mb-2">{template.name}</p>
            {template.diagnosis && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                <span className="font-medium">Dx:</span> {template.diagnosis}
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {template.items.slice(0, 4).map((item, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {item.medicineName}
                </span>
              ))}
              {template.items.length > 4 && (
                <span className="text-xs text-gray-400">+{template.items.length - 4} more</span>
              )}
            </div>
            {template.followUpDays && (
              <p className="text-xs text-emerald-600 mt-1.5">
                Follow-up: {template.followUpDays}d
                {template.followUpNote ? ` — ${template.followUpNote}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onApply && (
            <button onClick={() => onApply(template)}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Use
            </button>
          )}
          <button onClick={() => onDuplicate(template)} title="Duplicate"
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Copy size={13} />
          </button>
          {canEdit && (
            <>
              <button onClick={() => onEdit(template)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => onDelete(template)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
