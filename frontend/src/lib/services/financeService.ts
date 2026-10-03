import api from "@/lib/api";
import {
  IncomeEntry, ExpenseEntry, FinanceListResponse,
  FinanceSummary, DailyRow, MonthlyRow,
} from "@/types/finance";

const base = "/finance";

export async function fetchIncome(p: { category?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number } = {}): Promise<FinanceListResponse<IncomeEntry>> {
  return (await api.get(`${base}/income`, { params: p })).data.data;
}
export async function addIncome(data: { category: string; description: string; amount: number; date: string; invoiceId?: string; note?: string }): Promise<IncomeEntry> {
  return (await api.post(`${base}/income`, data)).data.data;
}
export async function removeIncome(id: string): Promise<void> {
  await api.delete(`${base}/income/${id}`);
}

export async function fetchExpenses(p: { category?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number } = {}): Promise<FinanceListResponse<ExpenseEntry>> {
  return (await api.get(`${base}/expenses`, { params: p })).data.data;
}
export async function addExpense(data: { category: string; description: string; amount: number; date: string; note?: string; attachment?: string }): Promise<ExpenseEntry> {
  return (await api.post(`${base}/expenses`, data)).data.data;
}
export async function removeExpense(id: string): Promise<void> {
  await api.delete(`${base}/expenses/${id}`);
}

export async function fetchFinanceSummary(dateFrom?: string, dateTo?: string): Promise<FinanceSummary> {
  return (await api.get(`${base}/summary`, { params: { dateFrom, dateTo } })).data.data;
}
export async function fetchDailyReport(dateFrom: string, dateTo: string): Promise<DailyRow[]> {
  return (await api.get(`${base}/report/daily`, { params: { dateFrom, dateTo } })).data.data;
}
export async function fetchMonthlyReport(year: number): Promise<MonthlyRow[]> {
  return (await api.get(`${base}/report/monthly`, { params: { year } })).data.data;
}
