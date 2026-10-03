import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CreateInvoiceInput, AddPaymentInput, UpdateInvoiceStatusInput } from "../validators/billing.validator";

// ─── ID Generator ─────────────────────────────────────────────────────────────

async function generateInvoiceNo(): Promise<string> {
  const year   = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last   = await prisma.invoice.findFirst({
    where:   { invoiceNo: { startsWith: prefix } },
    orderBy: { invoiceNo: "desc" },
    select:  { invoiceNo: true },
  });
  const seq = last ? parseInt(last.invoiceNo.split("-")[2] || "0", 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

// ─── Select ───────────────────────────────────────────────────────────────────

const INVOICE_SELECT = {
  id: true, invoiceNo: true,
  patientId: true, patientName: true, patientPhone: true, patientAge: true,
  visitId: true, appointmentId: true,
  subtotal: true, discountType: true, discountValue: true, discountAmt: true,
  totalAmount: true, paidAmount: true, dueAmount: true,
  status: true, notes: true, issuedAt: true, createdBy: true,
  createdAt: true, updatedAt: true,
  patient: { select: { id: true, patientId: true, nameBn: true, phone: true, age: true, gender: true, address: true } },
  doctor:  { select: { id: true, nameBn: true, nameEn: true, designationBn: true, qualificationBn: true, phone: true } },
  items:   { select: { id: true, type: true, description: true, quantity: true, unitPrice: true, totalPrice: true, sortOrder: true }, orderBy: { sortOrder: "asc" as const } },
  payments:{ select: { id: true, amount: true, method: true, transactionId: true, note: true, paidAt: true, receivedBy: true, createdAt: true } },
};

// ─── Compute totals ───────────────────────────────────────────────────────────

function computeTotals(items: { quantity: number; unitPrice: number }[], discountType: string, discountValue: number) {
  const subtotal    = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discountAmt = discountType === "PERCENT"
    ? Math.round((subtotal * discountValue) / 100 * 100) / 100
    : Math.min(discountValue, subtotal);
  const totalAmount = Math.max(0, subtotal - discountAmt);
  return { subtotal, discountAmt, totalAmount };
}

// ─── Create Invoice ───────────────────────────────────────────────────────────

export async function createInvoice(input: CreateInvoiceInput, createdBy: string) {
  const invoiceNo = await generateInvoiceNo();
  const { subtotal, discountAmt, totalAmount } = computeTotals(input.items, input.discountType, input.discountValue);

  return prisma.invoice.create({
    data: {
      invoiceNo,
      patientId:     input.patientId    || null,
      patientName:   input.patientName,
      patientPhone:  input.patientPhone,
      patientAge:    input.patientAge   ?? null,
      visitId:       input.visitId      || null,
      appointmentId: input.appointmentId|| null,
      doctorId:      input.doctorId     || null,
      discountType:  input.discountType,
      discountValue: input.discountValue,
      discountAmt,
      subtotal,
      totalAmount,
      paidAmount:    0,
      dueAmount:     totalAmount,
      status:        "ISSUED",
      notes:         input.notes || null,
      createdBy,
      items: {
        create: input.items.map((item, i) => ({
          type:        item.type,
          description: item.description,
          quantity:    item.quantity,
          unitPrice:   item.unitPrice,
          totalPrice:  item.quantity * item.unitPrice,
          sortOrder:   item.sortOrder ?? i,
        })),
      },
    },
    select: INVOICE_SELECT,
  });
}

// ─── List Invoices ────────────────────────────────────────────────────────────

export async function listInvoices(query: {
  search?: string; status?: string; dateFrom?: string; dateTo?: string;
  patientId?: string; page: number; limit: number;
}) {
  const where: any = {};
  if (query.status)    where.status = query.status;
  if (query.patientId) where.patientId = query.patientId;
  if (query.dateFrom || query.dateTo) {
    where.issuedAt = {};
    if (query.dateFrom) where.issuedAt.gte = new Date(query.dateFrom);
    if (query.dateTo)   where.issuedAt.lte = new Date(new Date(query.dateTo).setHours(23,59,59,999));
  }
  if (query.search) {
    where.OR = [
      { invoiceNo:    { contains: query.search, mode: "insensitive" } },
      { patientName:  { contains: query.search, mode: "insensitive" } },
      { patientPhone: { contains: query.search } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.invoice.count({ where }),
    prisma.invoice.findMany({
      where, skip, take: query.limit,
      select: INVOICE_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

// ─── Get Invoice ──────────────────────────────────────────────────────────────

export async function getInvoice(id: string) {
  const inv = await prisma.invoice.findFirst({
    where: { OR: [{ id }, { invoiceNo: id }] },
    select: INVOICE_SELECT,
  });
  if (!inv) throw new AppError("ইনভয়েস পাওয়া যায়নি।", 404);
  return inv;
}

// ─── Update Status ────────────────────────────────────────────────────────────

export async function updateInvoiceStatus(id: string, input: UpdateInvoiceStatusInput) {
  const inv = await prisma.invoice.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!inv) throw new AppError("ইনভয়েস পাওয়া যায়নি।", 404);
  if (inv.status === "PAID") throw new AppError("পরিশোধিত ইনভয়েস পরিবর্তন করা যাবে না।", 400);
  return prisma.invoice.update({
    where: { id },
    data:  { status: input.status },
    select: INVOICE_SELECT,
  });
}

// ─── Add Payment ──────────────────────────────────────────────────────────────

export async function addPayment(invoiceId: string, input: AddPaymentInput, receivedBy: string) {
  const inv = await prisma.invoice.findUnique({
    where:  { id: invoiceId },
    select: { id: true, totalAmount: true, paidAmount: true, dueAmount: true, status: true },
  });
  if (!inv)                        throw new AppError("ইনভয়েস পাওয়া যায়নি।", 404);
  if (inv.status === "CANCELLED")  throw new AppError("বাতিল ইনভয়েসে পেমেন্ট যোগ করা যাবে না।", 400);
  if (input.amount > inv.dueAmount + 0.01)
    throw new AppError(`বকেয়া পরিমাণ ৳${inv.dueAmount.toFixed(2)} এর বেশি পেমেন্ট করা যাবে না।`, 400);

  const newPaid = Math.round((inv.paidAmount + input.amount) * 100) / 100;
  const newDue  = Math.round((inv.totalAmount - newPaid) * 100) / 100;
  const newStatus = newDue <= 0 ? "PAID" : "PARTIALLY_PAID";

  const [payment] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        invoiceId,
        amount:        input.amount,
        method:        input.method as any,
        transactionId: input.transactionId || null,
        note:          input.note || null,
        receivedBy,
      },
    }),
    prisma.invoice.update({
      where: { id: invoiceId },
      data:  { paidAmount: newPaid, dueAmount: Math.max(0, newDue), status: newStatus },
    }),
  ]);

  return getInvoice(invoiceId);
}

// ─── Due Summary ──────────────────────────────────────────────────────────────

export async function getDueSummary() {
  const [totalInvoiced, totalPaid, totalDue, overdueCount] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
    prisma.invoice.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { paidAmount: true } }),
    prisma.invoice.aggregate({ where: { status: { in: ["ISSUED","PARTIALLY_PAID"] } }, _sum: { dueAmount: true } }),
    prisma.invoice.count({ where: { status: { in: ["ISSUED","PARTIALLY_PAID"] }, dueAmount: { gt: 0 } } }),
  ]);
  return {
    totalInvoiced: totalInvoiced._sum.totalAmount || 0,
    totalPaid:     totalPaid._sum.paidAmount      || 0,
    totalDue:      totalDue._sum.dueAmount        || 0,
    overdueCount,
  };
}
