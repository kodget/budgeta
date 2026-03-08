"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetSettings;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateBudget: (b: Partial<BudgetSettings>) => void;
  totalIncome: number;
  totalExpenses: number;
  safeToSpend: number;
  expensesByCategory: Record<string, number>;
  currentMonth: string;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

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
  { id: "t1",  type: "income",  amount: 150000, category: "income",      source: "Salary",    date: "2026-03-01", note: "March salary" },
  { id: "t2",  type: "expense", amount: 1500,   category: "food",        date: "2026-03-01",  note: "Jollof rice & drinks" },
  { id: "t3",  type: "expense", amount: 800,    category: "transport",   date: "2026-03-02",  note: "Bus fare to campus" },
  { id: "t4",  type: "expense", amount: 4000,   category: "bills",       date: "2026-03-02",  note: "DSTV subscription" },
  { id: "t5",  type: "expense", amount: 5500,   category: "food",        date: "2026-03-03",  note: "Weekly groceries" },
  { id: "t6",  type: "expense", amount: 2500,   category: "transport",   date: "2026-03-04",  note: "Uber rides" },
  { id: "t7",  type: "expense", amount: 1000,   category: "personal",    date: "2026-03-05",  note: "Airtime recharge" },
  { id: "t8",  type: "expense", amount: 3000,   category: "bills",       date: "2026-03-05",  note: "Internet data bundle" },
  { id: "t9",  type: "expense", amount: 3200,   category: "food",        date: "2026-03-06",  note: "Restaurant with friends" },
  { id: "t10", type: "expense", amount: 500,    category: "transport",   date: "2026-03-07",  note: "Bus fare" },
  { id: "t11", type: "expense", amount: 1800,   category: "food",        date: "2026-03-07",  note: "Suya & cold drinks" },
  { id: "t12", type: "income",  amount: 15000,  category: "income",      source: "Freelance", date: "2026-03-07", note: "Logo design gig" },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    load("ff_transactions", SEED_TRANSACTIONS)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    load("ff_categories", DEFAULT_CATEGORIES)
  );
  const [budget, setBudget] = useState<BudgetSettings>(() =>
    load("ff_budget", DEFAULT_BUDGET)
  );

  useEffect(() => { localStorage.setItem("ff_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("ff_categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("ff_budget", JSON.stringify(budget)); }, [budget]);

  const currentMonth = "2026-03";

  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const totalIncome = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const safeToSpend = totalIncome - totalExpenses;

  const expensesByCategory: Record<string, number> = {};
  monthlyTransactions.filter(t => t.type === "expense").forEach(t => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const newT: Transaction = { ...t, id: `t_${Date.now()}` };
    setTransactions(prev => [newT, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCategory = useCallback((c: Omit<Category, "id">) => {
    const newC: Category = { ...c, id: `cat_${Date.now()}` };
    setCategories(prev => [...prev, newC]);
  }, []);

  const updateCategory = useCallback((id: string, c: Partial<Category>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...c } : cat));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateBudget = useCallback((b: Partial<BudgetSettings>) => {
    setBudget(prev => ({ ...prev, ...b }));
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions, categories, budget,
      addTransaction, deleteTransaction,
      addCategory, updateCategory, deleteCategory,
      updateBudget,
      totalIncome, totalExpenses, safeToSpend,
      expensesByCategory, currentMonth,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
