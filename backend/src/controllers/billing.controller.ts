import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/billing.service";
import { createInvoiceSchema, addPaymentSchema, updateInvoiceStatusSchema } from "../validators/billing.validator";
import { auditCtx } from "../utils/auditCtx";
import { writeAudit } from "../services/audit.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, status, dateFrom, dateTo, patientId, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Invoices", await svc.listInvoices({
      search, status, dateFrom, dateTo, patientId,
      page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createInvoiceSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    const invoice = await svc.createInvoice(parsed.data, req.user!.userId);
    writeAudit({ ctx: auditCtx(req, req.user!.userId), action: "CREATE", module: "invoice", recordId: invoice.id, recordLabel: `${invoice.invoiceNo} — ${invoice.patientName}` });
    res.status(201).json(successResponse("ইনভয়েস তৈরি হয়েছে।", invoice));
  } catch (e) { next(e); }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Invoice", await svc.getInvoice(req.params.id)));
  } catch (e) { next(e); }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateInvoiceStatusSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    const invoice = await svc.updateInvoiceStatus(req.params.id, parsed.data);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "STATUS_CHANGE", module: "invoice", recordId: req.params.id, recordLabel: invoice.invoiceNo });
    res.json(successResponse("স্ট্যাটাস আপডেট হয়েছে।", invoice));
  } catch (e) { next(e); }
}

export async function addPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = addPaymentSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    const result = await svc.addPayment(req.params.id, parsed.data, req.user!.userId);
    writeAudit({ ctx: auditCtx(req, req.user!.userId), action: "CREATE", module: "payment", recordId: req.params.id, meta: { amount: parsed.data.amount, method: parsed.data.method } });
    res.json(successResponse("পেমেন্ট যোগ হয়েছে।", result));
  } catch (e) { next(e); }
}

export async function getDueSummary(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Due summary", await svc.getDueSummary()));
  } catch (e) { next(e); }
}
