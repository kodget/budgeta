import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  source?: string;
  date: string;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface BudgetSettings {
  mode: "global" | "category";
  globalLimit: number;
  categoryLimits: Record<string, number>;
}

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetSettings;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food", color: "#F97316", icon: "Utensils" },
  { id: "transport", name: "Transport", color: "#3B82F6", icon: "Car" },
  { id: "bills", name: "Bills", color: "#8B5CF6", icon: "FileInvoice" },
  { id: "personal", name: "Personal", color: "#EC4899", icon: "User" },
  { id: "miscellaneous", name: "Miscellaneous", color: "#6B7280", icon: "Box" },
];

const DEFAULT_BUDGET: BudgetSettings = {
  mode: "category",
  globalLimit: 120000,
  categoryLimits: {
    food: 30000,
    transport: 20000,
    bills: 25000,
    personal: 15000,
    miscellaneous: 10000,
  },
};

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "income", amount: 150000, category: "income", source: "Salary", date: "2026-03-01", note: "March salary" },
  { id: "t2", type: "expense", amount: 1500, category: "food", date: "2026-03-01", note: "Jollof rice & drinks" },
  { id: "t3", type: "expense", amount: 800, category: "transport", date: "2026-03-02", note: "Bus fare to campus" },
  { id: "t4", type: "expense", amount: 4000, category: "bills", date: "2026-03-02", note: "DSTV subscription" },
  { id: "t5", type: "expense", amount: 5500, category: "food", date: "2026-03-03", note: "Weekly groceries" },
  { id: "t6", type: "expense", amount: 2500, category: "transport", date: "2026-03-04", note: "Uber rides" },
  { id: "t7", type: "expense", amount: 1000, category: "personal", date: "2026-03-05", note: "Airtime recharge" },
  { id: "t8", type: "expense", amount: 3000, category: "bills", date: "2026-03-05", note: "Internet data bundle" },
  { id: "t9", type: "expense", amount: 3200, category: "food", date: "2026-03-06", note: "Restaurant with friends" },
  { id: "t10", type: "expense", amount: 500, category: "transport", date: "2026-03-07", note: "Bus fare" },
  { id: "t11", type: "expense", amount: 1800, category: "food", date: "2026-03-07", note: "Suya & cold drinks" },
  { id: "t12", type: "income", amount: 15000, category: "income", source: "Freelance", date: "2026-03-07", note: "Logo design gig" },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const initialState: FinanceState = {
  transactions: loadFromStorage("ff_transactions", SEED_TRANSACTIONS),
  categories: loadFromStorage("ff_categories", DEFAULT_CATEGORIES),
  budget: loadFromStorage("ff_budget", DEFAULT_BUDGET),
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, "id">>) => {
      const newTransaction: Transaction = { ...action.payload, id: `t_${Date.now()}` };
      state.transactions.unshift(newTransaction);
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_transactions", JSON.stringify(state.transactions));
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_transactions", JSON.stringify(state.transactions));
      }
    },
    addCategory: (state, action: PayloadAction<Omit<Category, "id">>) => {
      const newCategory: Category = { ...action.payload, id: `cat_${Date.now()}` };
      state.categories.push(newCategory);
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_categories", JSON.stringify(state.categories));
      }
    },
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<Category> }>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload.updates };
        if (typeof window !== "undefined") {
          localStorage.setItem("ff_categories", JSON.stringify(state.categories));
        }
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_categories", JSON.stringify(state.categories));
      }
    },
    updateBudget: (state, action: PayloadAction<Partial<BudgetSettings>>) => {
      state.budget = { ...state.budget, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_budget", JSON.stringify(state.budget));
      }
    },
  },
});

export const { addTransaction, deleteTransaction, addCategory, updateCategory, deleteCategory, updateBudget } = financeSlice.actions;
export default financeSlice.reducer;
