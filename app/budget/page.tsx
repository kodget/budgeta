"use client";

import { useState } from "react";
import { Edit2, Check, X, AlertTriangle, TrendingDown, Info } from "lucide-react";
import { ClientLayout } from "../components/ClientLayout";
import { AppIcon } from "../components/AppIcon";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateBudget } from "../store/financeSlice";
import { selectTotalExpenses, selectExpensesByCategory } from "../store/selectors";

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function getBudgetStatus(spent: number, limit: number) {
  if (limit <= 0) return { color: "#9CA3AF", label: "No limit", pct: 0, bg: "#F9FAFB", textColor: "#6B7280" };
  const pct = Math.min((spent / limit) * 100, 100);
  if (pct >= 100) return { color: "#EF4444", label: "Exceeded", pct, bg: "#FEF2F2", textColor: "#DC2626" };
  if (pct >= 75) return { color: "#F97316", label: "Approaching", pct, bg: "#FFF7ED", textColor: "#EA580C" };
  return { color: "#22C55E", label: "Safe", pct, bg: "#F0FDF4", textColor: "#16A34A" };
}

export default function BudgetPage() {
  const dispatch = useAppDispatch();
  const budget = useAppSelector(state => state.finance.budget);
  const categories = useAppSelector(state => state.finance.categories);
  const expensesByCategory = useAppSelector(selectExpensesByCategory);
  const totalExpenses = useAppSelector(selectTotalExpenses);

  const [editingGlobal, setEditingGlobal] = useState(false);
  const [globalInput, setGlobalInput] = useState(String(budget.globalLimit));
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catInput, setCatInput] = useState("");

  const globalStatus = getBudgetStatus(totalExpenses, budget.globalLimit);

  const saveGlobal = () => {
    const val = Number(globalInput);
    if (!isNaN(val) && val >= 0) dispatch(updateBudget({ globalLimit: val }));
    setEditingGlobal(false);
  };

  const saveCat = (catId: string) => {
    const val = Number(catInput);
    if (!isNaN(val) && val >= 0) {
      dispatch(updateBudget({
        categoryLimits: { ...budget.categoryLimits, [catId]: val },
      }));
    }
    setEditingCatId(null);
  };

  const totalCategoryBudget = Object.values(budget.categoryLimits).reduce((a, b) => a + b, 0);

  return (
    <ClientLayout>
      <div className="p-4 md:p-6 space-y-5 ">
        <div>
          <h1 style={{ color: "#0F172A" }}>Budget</h1>
          <p className="text-gray-500" style={{ fontSize: "1.15rem" }}>Manage your spending limits for March 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 style={{ color: "#0F172A", marginBottom: "0.5rem" }}>Budget Mode</h3>
          <p className="text-gray-500 mb-4" style={{ fontSize: "1.15rem" }}>
            Choose how you want to track your spending limits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => dispatch(updateBudget({ mode: "global" }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                budget.mode === "global"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontWeight: 600, color: budget.mode === "global" ? "#065F46" : "#0F172A", fontSize: "1.15rem" }}>
                    Option A — Global Budget
                  </p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: "1.1rem" }}>
                    Set a single monthly spending limit for all expenses combined.
                  </p>
                </div>
                {budget.mode === "global" && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 ml-2">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={() => dispatch(updateBudget({ mode: "category" }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                budget.mode === "category"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontWeight: 600, color: budget.mode === "category" ? "#065F46" : "#0F172A", fontSize: "1.15rem" }}>
                    Option B — Category Budgets
                  </p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: "1.1rem" }}>
                    Set individual spending limits for each category.
                  </p>
                </div>
                {budget.mode === "category" && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 ml-2">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {budget.mode === "global" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ color: "#0F172A" }}>Monthly Spending Limit</h3>
              {!editingGlobal ? (
                <button
                  onClick={() => { setGlobalInput(String(budget.globalLimit)); setEditingGlobal(true); }}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                  style={{ fontSize: "1.15rem", fontWeight: 500 }}
                >
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={saveGlobal} className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700" style={{ fontSize: "1.15rem", fontWeight: 500 }}>
                    <Check size={14} /> Save
                  </button>
                  <button onClick={() => setEditingGlobal(false)} className="flex items-center gap-1 text-gray-400 hover:text-gray-600" style={{ fontSize: "1.15rem" }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {editingGlobal ? (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontWeight: 600 }}>₦</span>
                <input
                  type="number"
                  value={globalInput}
                  onChange={e => setGlobalInput(e.target.value)}
                  className="w-full border border-emerald-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
                  style={{ fontSize: "1.1rem", fontWeight: 600 }}
                  autoFocus
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p style={{ fontSize: "2rem", fontWeight: 700, color: "#0F172A" }}>{fmt(budget.globalLimit)}</p>
                <p className="text-gray-500 mt-0.5" style={{ fontSize: "1.1rem" }}>per month</p>
              </div>
            )}

            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: "1.1rem", color: "#6B7280" }}>
                  Spent: {fmt(totalExpenses)}
                </span>
                <span style={{ fontSize: "1.1rem", fontWeight: 600, color: globalStatus.textColor }}>
                  {globalStatus.pct.toFixed(0)}% used · {globalStatus.label}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${globalStatus.pct}%`, backgroundColor: globalStatus.color }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>₦0</span>
                <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>{fmt(budget.globalLimit)}</span>
              </div>
            </div>

            {globalStatus.label === "Exceeded" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                <p style={{ fontSize: "1.1rem", color: "#DC2626" }}>
                  You've exceeded your monthly budget by <strong>{fmt(totalExpenses - budget.globalLimit)}</strong>. Consider reducing spending.
                </p>
              </div>
            )}
            {globalStatus.label === "Approaching" && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <AlertTriangle size={16} className="text-orange-500 flex-shrink-0" />
                <p style={{ fontSize: "1.1rem", color: "#EA580C" }}>
                  You're approaching your budget limit. <strong>{fmt(budget.globalLimit - totalExpenses)}</strong> remaining.
                </p>
              </div>
            )}
          </div>
        )}

        {budget.mode === "category" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 style={{ color: "#0F172A" }}>Category Limits</h3>
                <p className="text-gray-500 mt-0.5" style={{ fontSize: "1.1rem" }}>
                  Total allocated: {fmt(totalCategoryBudget)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: "1rem" }}>
                <Info size={12} />
                <span>Click Edit to update limits</span>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {categories.map(cat => {
                const spent = expensesByCategory[cat.id] || 0;
                const limit = budget.categoryLimits[cat.id] || 0;
                const status = getBudgetStatus(spent, limit);
                const isEditing = editingCatId === cat.id;

                return (
                  <div key={cat.id} className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: cat.color + "15" }}
                      >
                        <AppIcon name={cat.icon} size="lg" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 600, color: "#0F172A", fontSize: "1.15rem" }}>{cat.name}</span>
                            <span
                              className="px-2 py-0.5 rounded-full"
                              style={{ fontSize: "0.95rem", fontWeight: 600, backgroundColor: status.bg, color: status.textColor }}
                            >
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <div className="relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                                  <input
                                    type="number"
                                    value={catInput}
                                    onChange={e => setCatInput(e.target.value)}
                                    className="w-32 border border-emerald-300 rounded-lg pl-6 pr-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-emerald-50"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === "Enter") saveCat(cat.id); if (e.key === "Escape") setEditingCatId(null); }}
                                  />
                                </div>
                                <button onClick={() => saveCat(cat.id)} className="text-emerald-500 hover:text-emerald-600">
                                  <Check size={16} />
                                </button>
                                <button onClick={() => setEditingCatId(null)} className="text-gray-400 hover:text-gray-500">
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setCatInput(String(limit)); setEditingCatId(cat.id); }}
                                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                                style={{ fontSize: "1.1rem", fontWeight: 500 }}
                              >
                                <Edit2 size={13} /> Edit
                              </button>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <>
                            <div className="flex justify-between mb-1">
                              <span style={{ fontSize: "1.1rem", color: "#6B7280" }}>
                                {fmt(spent)} spent
                              </span>
                              <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0F172A" }}>
                                {limit > 0 ? fmt(limit) + " limit" : "No limit set"}
                              </span>
                            </div>
                            {limit > 0 && (
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${status.pct}%`, backgroundColor: status.color }}
                                />
                              </div>
                            )}
                            {limit > 0 && (
                              <p style={{ fontSize: "1rem", color: "#9CA3AF", marginTop: "0.25rem" }}>
                                {status.label === "Exceeded"
                                  ? `Over by ${fmt(spent - limit)}`
                                  : `${fmt(limit - spent)} remaining (${(100 - status.pct).toFixed(0)}%)`}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-[#0F172A] rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingDown size={16} className="text-emerald-400" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "1.15rem" }}>Budgeting Tip</p>
              <p className="text-white/60 mt-1" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                The 50/30/20 rule: Spend 50% on needs (Food, Bills, Transport), 
                30% on wants (Personal), and save 20%. With your income of <strong className="text-white">₦165,000</strong>, 
                that's ₦82,500 for needs, ₦49,500 for wants, and ₦33,000 for savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
