"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Trash2, Plus } from "lucide-react";
import { ClientLayout } from "../components/ClientLayout";
import { AppIcon } from "../components/AppIcon";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { deleteTransaction } from "../store/financeSlice";
import { selectTotalIncome, selectTotalExpenses } from "../store/selectors";
import type { Transaction } from "../store/financeSlice";

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(state => state.finance.transactions);
  const categories = useAppSelector(state => state.finance.categories);
  const totalIncome = useAppSelector(selectTotalIncome);
  const totalExpenses = useAppSelector(selectTotalExpenses);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const getCat = (id: string) => categories.find((c) => c.id === id);

  const filtered = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          (t.note || "").toLowerCase().includes(s) ||
          (t.source || "").toLowerCase().includes(s) ||
          (getCat(t.category)?.name || "").toLowerCase().includes(s)
        );
      }
      return true;
    });

  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach((t) => {
    grouped[t.date] = grouped[t.date] ? [...grouped[t.date], t] : [t];
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  function formatDate(d: string) {
    const date = new Date(d);
    const today = new Date("2026-03-07");
    const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" });
  }

  return (
    <ClientLayout>
      <div className="p-4 md:p-6 space-y-5 ">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 style={{ color: "#0F172A" }}>Transactions</h1>
            <p className="text-gray-500" style={{ fontSize: "1.15rem" }}>{transactions.length} total entries</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Total Transactions</p>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "1.4rem" }}>{transactions.length}</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Income</p>
            <p style={{ fontWeight: 700, color: "#16A34A", fontSize: "1.4rem" }}>{fmt(totalIncome)}</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500" style={{ fontSize: "1rem" }}>Expenses</p>
            <p style={{ fontWeight: 700, color: "#EF4444", fontSize: "1.4rem" }}>{fmt(totalExpenses)}</p>
          </motion.div>
        </motion.div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400" style={{ fontSize: "1.15rem" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${showFilters ? "bg-emerald-50 border-emerald-300 text-emerald-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              <Filter size={15} />
              <span style={{ fontSize: "1.15rem" }}>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
              <div className="flex gap-1">
                {(["all", "income", "expense"] as const).map((t) => (
                  <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1 rounded-full transition-colors capitalize ${filterType === t ? "bg-[#0F172A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={{ fontSize: "1.1rem" }}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setFilterCategory("all")} className={`px-3 py-1 rounded-full transition-colors ${filterCategory === "all" ? "bg-[#0F172A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={{ fontSize: "1.1rem" }}>
                  All categories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${filterCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={{ fontSize: "1.1rem", backgroundColor: filterCategory === cat.id ? cat.color : undefined }}>
                    <span><AppIcon name={cat.icon} style={{ color: cat.color }} /></span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <AppIcon name="Inbox" size="3x" className="text-gray-300 mx-auto" />
              <p style={{ fontWeight: 600, color: "#0F172A", marginTop: "1rem", fontSize: "1.15rem" }}>No transactions found</p>
              <p className="text-gray-400" style={{ fontSize: "1.15rem", marginTop: "0.25rem" }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#6B7280" }}>{formatDate(date)}</span>
                  <span className="text-gray-400" style={{ fontSize: "1rem" }}>{grouped[date].length} {grouped[date].length === 1 ? "entry" : "entries"}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {grouped[date].map((tx) => {
                    const cat = getCat(tx.category);
                    return (
                      <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ backgroundColor: tx.type === "income" ? "#F0FDF4" : (cat?.color || "#6B7280") + "18" }}>
                          <AppIcon name={tx.type === "income" ? "MoneyBillWave" : (cat?.icon || "Box")} style={{ color: tx.type === "income" ? "#16A34A" : cat?.color || "#6B7280" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p style={{ fontSize: "1.15rem", fontWeight: 500, color: "#0F172A" }} className="truncate">
                              {tx.note || (tx.type === "income" ? tx.source : cat?.name) || "Transaction"}
                            </p>
                            <span className="flex-shrink-0 px-2 py-0.5 rounded-full" style={{ fontSize: "0.95rem", fontWeight: 500, backgroundColor: tx.type === "income" ? "#F0FDF4" : (cat?.color || "#6B7280") + "15", color: tx.type === "income" ? "#16A34A" : cat?.color || "#6B7280" }}>
                              {tx.type === "income" ? tx.source : cat?.name}
                            </span>
                          </div>
                          <p className="text-gray-400" style={{ fontSize: "1rem" }}>{tx.type === "income" ? "Income" : "Expense"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: tx.type === "income" ? "#16A34A" : "#EF4444" }}>
                            {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                          </span>
                          <button onClick={() => dispatch(deleteTransaction(tx.id))} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
