import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CreateIncomeInput, CreateExpenseInput } from "../validators/finance.validator";

// ─── Selects ──────────────────────────────────────────────────────────────────

const INCOME_SELECT  = { id:true, category:true, description:true, amount:true, invoiceId:true, date:true, note:true, createdBy:true, createdAt:true, updatedAt:true };
const EXPENSE_SELECT = { id:true, category:true, description:true, amount:true, date:true, note:true, attachment:true, createdBy:true, createdAt:true, updatedAt:true };

// ─── Date helpers ─────────────────────────────────────────────────────────────

function dateRange(from?: string, to?: string) {
  const filter: any = {};
  if (from) filter.gte = new Date(from);
  if (to)   filter.lte = new Date(new Date(to).setHours(23,59,59,999));
  return Object.keys(filter).length ? filter : undefined;
}

// ─── Income ───────────────────────────────────────────────────────────────────

export async function createIncome(input: CreateIncomeInput, createdBy: string) {
  return prisma.incomeEntry.create({
    data: {
      category:    input.category as any,
      description: input.description,
      amount:      input.amount,
      invoiceId:   input.invoiceId || null,
      date:        new Date(input.date),
      note:        input.note || null,
      createdBy,
    },
    select: INCOME_SELECT,
  });
}

export async function listIncome(query: {
  category?: string; dateFrom?: string; dateTo?: string;
  page: number; limit: number;
}) {
  const where: any = {};
  if (query.category) where.category = query.category;
  const dr = dateRange(query.dateFrom, query.dateTo);
  if (dr) where.date = dr;

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.incomeEntry.count({ where }),
    prisma.incomeEntry.findMany({ where, skip, take: query.limit, select: INCOME_SELECT, orderBy: { date: "desc" } }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function deleteIncome(id: string) {
  const entry = await prisma.incomeEntry.findUnique({ where: { id } });
  if (!entry) throw new AppError("আয়ের এন্ট্রি পাওয়া যায়নি।", 404);
  return prisma.incomeEntry.delete({ where: { id } });
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export async function createExpense(input: CreateExpenseInput, createdBy: string) {
  return prisma.expenseEntry.create({
    data: {
      category:    input.category as any,
      description: input.description,
      amount:      input.amount,
      date:        new Date(input.date),
      note:        input.note || null,
      attachment:  input.attachment || null,
      createdBy,
    },
    select: EXPENSE_SELECT,
  });
}

export async function listExpenses(query: {
  category?: string; dateFrom?: string; dateTo?: string;
  page: number; limit: number;
}) {
  const where: any = {};
  if (query.category) where.category = query.category;
  const dr = dateRange(query.dateFrom, query.dateTo);
  if (dr) where.date = dr;

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.expenseEntry.count({ where }),
    prisma.expenseEntry.findMany({ where, skip, take: query.limit, select: EXPENSE_SELECT, orderBy: { date: "desc" } }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function deleteExpense(id: string) {
  const entry = await prisma.expenseEntry.findUnique({ where: { id } });
  if (!entry) throw new AppError("ব্যয়ের এন্ট্রি পাওয়া যায়নি।", 404);
  return prisma.expenseEntry.delete({ where: { id } });
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getFinanceSummary(dateFrom?: string, dateTo?: string) {
  const dr = dateRange(dateFrom, dateTo);
  const where = dr ? { date: dr } : {};

  const [incomeAgg, expenseAgg, incomeByCategory, expenseByCategory] = await Promise.all([
    prisma.incomeEntry.aggregate({ where, _sum: { amount: true }, _count: true }),
    prisma.expenseEntry.aggregate({ where, _sum: { amount: true }, _count: true }),
    prisma.incomeEntry.groupBy({ by: ["category"], where, _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } } }),
    prisma.expenseEntry.groupBy({ by: ["category"], where, _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } } }),
  ]);

  const totalIncome  = incomeAgg._sum.amount  || 0;
  const totalExpense = expenseAgg._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netAmount:   totalIncome - totalExpense,
    incomeCount:  incomeAgg._count,
    expenseCount: expenseAgg._count,
    incomeByCategory:  incomeByCategory.map((r)  => ({ category: r.category,  amount: r._sum.amount || 0 })),
    expenseByCategory: expenseByCategory.map((r) => ({ category: r.category,  amount: r._sum.amount || 0 })),
  };
}

// ─── Daily report ─────────────────────────────────────────────────────────────

export async function getDailyReport(dateFrom: string, dateTo: string) {
  const start = new Date(dateFrom);
  const end   = new Date(new Date(dateTo).setHours(23,59,59,999));

  const [incomes, expenses] = await Promise.all([
    prisma.incomeEntry.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true, amount: true },
    }),
    prisma.expenseEntry.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true, amount: true },
    }),
  ]);

  // Group by date string
  const map = new Map<string, { income: number; expense: number }>();
  for (const r of incomes) {
    const k = r.date.toISOString().split("T")[0];
    const v = map.get(k) || { income: 0, expense: 0 };
    v.income += r.amount;
    map.set(k, v);
  }
  for (const r of expenses) {
    const k = r.date.toISOString().split("T")[0];
    const v = map.get(k) || { income: 0, expense: 0 };
    v.expense += r.amount;
    map.set(k, v);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, income: v.income, expense: v.expense, net: v.income - v.expense }));
}

// ─── Monthly report ───────────────────────────────────────────────────────────

export async function getMonthlyReport(year: number) {
  const start = new Date(`${year}-01-01`);
  const end   = new Date(`${year}-12-31T23:59:59`);

  const [incomes, expenses] = await Promise.all([
    prisma.incomeEntry.findMany({ where: { date: { gte: start, lte: end } }, select: { date: true, amount: true } }),
    prisma.expenseEntry.findMany({ where: { date: { gte: start, lte: end } }, select: { date: true, amount: true } }),
  ]);

  const map = new Map<number, { income: number; expense: number }>();
  for (let m = 1; m <= 12; m++) map.set(m, { income: 0, expense: 0 });

  for (const r of incomes)  { const m = r.date.getMonth() + 1; map.get(m)!.income  += r.amount; }
  for (const r of expenses) { const m = r.date.getMonth() + 1; map.get(m)!.expense += r.amount; }

  return Array.from(map.entries()).map(([month, v]) => ({
    month, income: v.income, expense: v.expense, net: v.income - v.expense,
  }));
}
