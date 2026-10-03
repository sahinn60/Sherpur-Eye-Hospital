export type IncomeCategory  = "CONSULTATION"|"TEST"|"SURGERY"|"PROCEDURE"|"MEDICINE"|"OTHER";
export type ExpenseCategory = "SALARY"|"EQUIPMENT"|"MEDICINE"|"ELECTRICITY"|"MAINTENANCE"|"RENT"|"CLEANING"|"FOOD"|"OTHER";

export const INCOME_CATEGORY_BN: Record<IncomeCategory, string> = {
  CONSULTATION: "পরামর্শ ফি", TEST: "পরীক্ষা ফি", SURGERY: "অপারেশন ফি",
  PROCEDURE: "প্রক্রিয়া ফি", MEDICINE: "ওষুধ বিক্রয়", OTHER: "অন্যান্য",
};

export const EXPENSE_CATEGORY_BN: Record<ExpenseCategory, string> = {
  SALARY: "বেতন", EQUIPMENT: "যন্ত্রপাতি", MEDICINE: "ওষুধ ক্রয়",
  ELECTRICITY: "বিদ্যুৎ", MAINTENANCE: "রক্ষণাবেক্ষণ",
  RENT: "ভাড়া", CLEANING: "পরিষ্কার", FOOD: "খাবার", OTHER: "অন্যান্য",
};

export const INCOME_CATEGORY_COLOR: Record<IncomeCategory, string> = {
  CONSULTATION: "bg-blue-100 text-blue-700",   TEST:      "bg-purple-100 text-purple-700",
  SURGERY:      "bg-red-100 text-red-700",      PROCEDURE: "bg-orange-100 text-orange-700",
  MEDICINE:     "bg-green-100 text-green-700",  OTHER:     "bg-gray-100 text-gray-600",
};

export const EXPENSE_CATEGORY_COLOR: Record<ExpenseCategory, string> = {
  SALARY:      "bg-indigo-100 text-indigo-700", EQUIPMENT:   "bg-cyan-100 text-cyan-700",
  MEDICINE:    "bg-teal-100 text-teal-700",     ELECTRICITY: "bg-yellow-100 text-yellow-700",
  MAINTENANCE: "bg-orange-100 text-orange-700", RENT:        "bg-pink-100 text-pink-700",
  CLEANING:    "bg-lime-100 text-lime-700",     FOOD:        "bg-amber-100 text-amber-700",
  OTHER:       "bg-gray-100 text-gray-600",
};

export interface IncomeEntry {
  id: string; category: IncomeCategory; description: string;
  amount: number; invoiceId: string | null; date: string;
  note: string | null; createdBy: string | null; createdAt: string; updatedAt: string;
}

export interface ExpenseEntry {
  id: string; category: ExpenseCategory; description: string;
  amount: number; date: string; note: string | null;
  attachment: string | null; createdBy: string | null; createdAt: string; updatedAt: string;
}

export interface FinanceListResponse<T> {
  items: T[]; total: number; page: number; limit: number; totalPages: number;
}

export interface CategoryAmount { category: string; amount: number; }

export interface FinanceSummary {
  totalIncome: number; totalExpense: number; netAmount: number;
  incomeCount: number; expenseCount: number;
  incomeByCategory: CategoryAmount[]; expenseByCategory: CategoryAmount[];
}

export interface DailyRow  { date: string;  income: number; expense: number; net: number; }
export interface MonthlyRow { month: number; income: number; expense: number; net: number; }
