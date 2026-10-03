import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import {
  CreateSupplierInput, UpdateSupplierInput,
  CreateItemInput, UpdateItemInput, AdjustStockInput,
} from "../validators/inventory.validator";

// ─── Selects ──────────────────────────────────────────────────────────────────

const SUPPLIER_SELECT = {
  id: true, name: true, contactName: true, phone: true,
  email: true, address: true, isActive: true, createdAt: true,
};

const ITEM_SELECT = {
  id: true, sku: true, name: true, nameBn: true, category: true,
  unit: true, purchasePrice: true, sellingPrice: true,
  stockQty: true, minStock: true, expiryDate: true,
  description: true, isActive: true, createdAt: true, updatedAt: true,
  supplier: { select: { id: true, name: true, phone: true } },
};

const HISTORY_SELECT = {
  id: true, type: true, quantity: true, qtyBefore: true, qtyAfter: true,
  unitCost: true, note: true, refId: true, createdBy: true, createdAt: true,
};

// ─── SKU Generator ────────────────────────────────────────────────────────────

export async function generateSku(category: string): Promise<string> {
  const prefix = category.slice(0, 3).toUpperCase();
  const count  = await prisma.inventoryItem.count();
  return `${prefix}-${String(count + 1).padStart(5, "0")}`;
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export async function listSuppliers(activeOnly = false) {
  return prisma.inventorySupplier.findMany({
    where:   activeOnly ? { isActive: true } : undefined,
    select:  SUPPLIER_SELECT,
    orderBy: { name: "asc" },
  });
}

export async function createSupplier(input: CreateSupplierInput) {
  return prisma.inventorySupplier.create({
    data: {
      name:        input.name,
      contactName: input.contactName || null,
      phone:       input.phone       || null,
      email:       input.email       || null,
      address:     input.address     || null,
    },
    select: SUPPLIER_SELECT,
  });
}

export async function updateSupplier(id: string, input: UpdateSupplierInput) {
  const existing = await prisma.inventorySupplier.findUnique({ where: { id } });
  if (!existing) throw new AppError("সাপ্লায়ার পাওয়া যায়নি।", 404);
  return prisma.inventorySupplier.update({
    where: { id },
    data: {
      ...(input.name        !== undefined ? { name:        input.name }        : {}),
      ...(input.contactName !== undefined ? { contactName: input.contactName || null } : {}),
      ...(input.phone       !== undefined ? { phone:       input.phone       || null } : {}),
      ...(input.email       !== undefined ? { email:       input.email       || null } : {}),
      ...(input.address     !== undefined ? { address:     input.address     || null } : {}),
    },
    select: SUPPLIER_SELECT,
  });
}

export async function toggleSupplier(id: string) {
  const existing = await prisma.inventorySupplier.findUnique({ where: { id } });
  if (!existing) throw new AppError("সাপ্লায়ার পাওয়া যায়নি।", 404);
  return prisma.inventorySupplier.update({
    where: { id },
    data:  { isActive: !existing.isActive },
    select: SUPPLIER_SELECT,
  });
}

// ─── Items ────────────────────────────────────────────────────────────────────

export async function listItems(query: {
  search?: string; category?: string; supplierId?: string;
  isActive?: string; lowStock?: string; expiringSoon?: string;
  page: number; limit: number;
}) {
  const where: any = {};
  if (query.category)   where.category   = query.category;
  if (query.supplierId) where.supplierId = query.supplierId;
  if (query.isActive !== undefined && query.isActive !== "") {
    where.isActive = query.isActive === "true";
  }
  if (query.lowStock === "true") {
    where.stockQty = { lte: prisma.inventoryItem.fields.minStock };
  }
  if (query.expiringSoon === "true") {
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    where.expiryDate = { lte: in30, gte: new Date() };
  }
  if (query.search) {
    where.OR = [
      { name:   { contains: query.search, mode: "insensitive" } },
      { nameBn: { contains: query.search, mode: "insensitive" } },
      { sku:    { contains: query.search, mode: "insensitive" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.inventoryItem.count({ where }),
    prisma.inventoryItem.findMany({
      where, skip, take: query.limit,
      select: ITEM_SELECT,
      orderBy: { updatedAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getItem(id: string) {
  const item = await prisma.inventoryItem.findUnique({ where: { id }, select: ITEM_SELECT });
  if (!item) throw new AppError("আইটেম পাওয়া যায়নি।", 404);
  return item;
}

export async function createItem(input: CreateItemInput, createdBy: string) {
  const existing = await prisma.inventoryItem.findUnique({ where: { sku: input.sku } });
  if (existing) throw new AppError("এই SKU ইতিমধ্যে ব্যবহৃত হয়েছে।", 409);

  const item = await prisma.inventoryItem.create({
    data: {
      sku:           input.sku,
      name:          input.name,
      nameBn:        input.nameBn,
      category:      input.category as any,
      supplierId:    input.supplierId || null,
      unit:          input.unit,
      purchasePrice: input.purchasePrice,
      sellingPrice:  input.sellingPrice,
      stockQty:      input.stockQty,
      minStock:      input.minStock,
      expiryDate:    input.expiryDate ? new Date(input.expiryDate) : null,
      description:   input.description || null,
      createdBy,
    },
    select: ITEM_SELECT,
  });

  // Record initial stock if > 0
  if (input.stockQty > 0) {
    await prisma.stockHistory.create({
      data: {
        itemId:    item.id,
        type:      "PURCHASE",
        quantity:  input.stockQty,
        qtyBefore: 0,
        qtyAfter:  input.stockQty,
        unitCost:  input.purchasePrice || null,
        note:      "প্রাথমিক স্টক",
        createdBy,
      },
    });
  }

  return item;
}

export async function updateItem(id: string, input: UpdateItemInput) {
  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!existing) throw new AppError("আইটেম পাওয়া যায়নি।", 404);
  return prisma.inventoryItem.update({
    where: { id },
    data: {
      ...(input.name          !== undefined ? { name:          input.name }          : {}),
      ...(input.nameBn        !== undefined ? { nameBn:        input.nameBn }        : {}),
      ...(input.category      !== undefined ? { category:      input.category as any } : {}),
      ...(input.supplierId    !== undefined ? { supplierId:    input.supplierId || null } : {}),
      ...(input.unit          !== undefined ? { unit:          input.unit }          : {}),
      ...(input.purchasePrice !== undefined ? { purchasePrice: input.purchasePrice } : {}),
      ...(input.sellingPrice  !== undefined ? { sellingPrice:  input.sellingPrice }  : {}),
      ...(input.minStock      !== undefined ? { minStock:      input.minStock }      : {}),
      ...(input.expiryDate    !== undefined ? { expiryDate:    input.expiryDate ? new Date(input.expiryDate) : null } : {}),
      ...(input.description   !== undefined ? { description:   input.description || null } : {}),
    },
    select: ITEM_SELECT,
  });
}

export async function toggleItem(id: string) {
  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!existing) throw new AppError("আইটেম পাওয়া যায়নি।", 404);
  return prisma.inventoryItem.update({
    where: { id },
    data:  { isActive: !existing.isActive },
    select: ITEM_SELECT,
  });
}

// ─── Stock Adjustment ─────────────────────────────────────────────────────────

export async function adjustStock(id: string, input: AdjustStockInput, createdBy: string) {
  const item = await prisma.inventoryItem.findUnique({ where: { id }, select: { id: true, stockQty: true } });
  if (!item) throw new AppError("আইটেম পাওয়া যায়নি।", 404);

  const isDeduction = ["DISPENSED", "EXPIRED", "DAMAGED"].includes(input.type);
  const delta       = isDeduction ? -input.quantity : input.quantity;
  const newQty      = item.stockQty + delta;

  if (newQty < 0) throw new AppError(`অপর্যাপ্ত স্টক। বর্তমান: ${item.stockQty}`, 400);

  const [updated] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id },
      data:  { stockQty: newQty },
      select: ITEM_SELECT,
    }),
    prisma.stockHistory.create({
      data: {
        itemId:    id,
        type:      input.type as any,
        quantity:  input.quantity,
        qtyBefore: item.stockQty,
        qtyAfter:  newQty,
        unitCost:  input.unitCost ?? null,
        note:      input.note    ?? null,
        refId:     input.refId   ?? null,
        createdBy,
      },
    }),
  ]);

  return updated;
}

// ─── Stock History ────────────────────────────────────────────────────────────

export async function getStockHistory(itemId: string, page = 1, limit = 30) {
  const item = await prisma.inventoryItem.findUnique({ where: { id: itemId }, select: { id: true } });
  if (!item) throw new AppError("আইটেম পাওয়া যায়নি।", 404);

  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.stockHistory.count({ where: { itemId } }),
    prisma.stockHistory.findMany({
      where: { itemId }, skip, take: limit,
      select: HISTORY_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function getAlerts() {
  const now    = new Date();
  const in30   = new Date(); in30.setDate(now.getDate() + 30);
  const in7    = new Date(); in7.setDate(now.getDate() + 7);

  const [lowStock, expiringSoon, expired] = await Promise.all([
    // Items where stockQty <= minStock (raw query workaround)
    prisma.inventoryItem.findMany({
      where: { isActive: true },
      select: { ...ITEM_SELECT },
    }).then((items) => items.filter((i) => i.stockQty <= i.minStock)),

    prisma.inventoryItem.findMany({
      where: { isActive: true, expiryDate: { gte: now, lte: in30 } },
      select: ITEM_SELECT,
      orderBy: { expiryDate: "asc" },
    }),

    prisma.inventoryItem.findMany({
      where: { isActive: true, expiryDate: { lt: now } },
      select: ITEM_SELECT,
      orderBy: { expiryDate: "asc" },
    }),
  ]);

  return { lowStock, expiringSoon, expired };
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getInventorySummary() {
  const now  = new Date();
  const in30 = new Date(); in30.setDate(now.getDate() + 30);

  const [totalItems, activeItems, allItems, expiringSoon, expired] = await Promise.all([
    prisma.inventoryItem.count(),
    prisma.inventoryItem.count({ where: { isActive: true } }),
    prisma.inventoryItem.findMany({ where: { isActive: true }, select: { stockQty: true, minStock: true, purchasePrice: true } }),
    prisma.inventoryItem.count({ where: { isActive: true, expiryDate: { gte: now, lte: in30 } } }),
    prisma.inventoryItem.count({ where: { isActive: true, expiryDate: { lt: now } } }),
  ]);

  const lowStockCount  = allItems.filter((i) => i.stockQty <= i.minStock).length;
  const totalStockValue = allItems.reduce((s, i) => s + i.stockQty * i.purchasePrice, 0);

  return { totalItems, activeItems, lowStockCount, expiringSoon, expired, totalStockValue };
}
