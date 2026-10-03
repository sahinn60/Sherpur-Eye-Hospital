export type InvoiceStatus   = "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
export type PaymentMethod   = "CASH" | "CARD" | "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "OTHER";
export type InvoiceItemType = "CONSULTATION" | "TEST" | "PROCEDURE" | "SURGERY" | "MEDICINE" | "OTHER";

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; text: string; border: string }> = {
  DRAFT:          { label: "ড্রাফট",      bg: "bg-gray-100",    text: "text-gray-600",    border: "border-gray-200" },
  ISSUED:         { label: "ইস্যু হয়েছে", bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200" },
  PARTIALLY_PAID: { label: "আংশিক পরিশোধ",bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200" },
  PAID:           { label: "পরিশোধিত",    bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200" },
  CANCELLED:      { label: "বাতিল",        bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200" },
};

export const PAYMENT_METHOD_BN: Record<PaymentMethod, string> = {
  CASH:          "নগদ",
  CARD:          "কার্ড",
  BKASH:         "বিকাশ",
  NAGAD:         "নগদ (Nagad)",
  ROCKET:        "রকেট",
  BANK_TRANSFER: "ব্যাংক ট্রান্সফার",
  OTHER:         "অন্যান্য",
};

export const ITEM_TYPE_BN: Record<InvoiceItemType, string> = {
  CONSULTATION: "পরামর্শ ফি",
  TEST:         "পরীক্ষা ফি",
  PROCEDURE:    "প্রক্রিয়া ফি",
  SURGERY:      "অপারেশন ফি",
  MEDICINE:     "ওষুধ",
  OTHER:        "অন্যান্য",
};

export interface InvoiceItem {
  id:          string;
  type:        InvoiceItemType;
  description: string;
  quantity:    number;
  unitPrice:   number;
  totalPrice:  number;
  sortOrder:   number;
}

export interface Payment {
  id:            string;
  amount:        number;
  method:        PaymentMethod;
  transactionId: string | null;
  note:          string | null;
  paidAt:        string;
  receivedBy:    string | null;
  createdAt:     string;
}

export interface Invoice {
  id:            string;
  invoiceNo:     string;
  patientId:     string | null;
  patientName:   string;
  patientPhone:  string;
  patientAge:    number | null;
  visitId:       string | null;
  appointmentId: string | null;
  subtotal:      number;
  discountType:  string;
  discountValue: number;
  discountAmt:   number;
  totalAmount:   number;
  paidAmount:    number;
  dueAmount:     number;
  status:        InvoiceStatus;
  notes:         string | null;
  issuedAt:      string;
  createdBy:     string | null;
  createdAt:     string;
  updatedAt:     string;
  patient: { id: string; patientId: string; nameBn: string; phone: string; age: number | null; gender: string; address: string | null } | null;
  doctor:  { id: string; nameBn: string; nameEn: string; designationBn: string; qualificationBn: string; phone: string | null } | null;
  items:    InvoiceItem[];
  payments: Payment[];
}

export interface InvoiceListResponse {
  items:      Invoice[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface DueSummary {
  totalInvoiced: number;
  totalPaid:     number;
  totalDue:      number;
  overdueCount:  number;
}
