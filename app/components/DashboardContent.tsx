"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, ChevronRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addCoins, triggerCelebration } from "../store/gamificationSlice";
import { selectTotalIncome, selectTotalExpenses, selectSafeToSpend, selectExpensesByCategory, selectCurrentMonth, selectMonthlyTransactions } from "../store/selectors";
import { AppIcon } from "../components/AppIcon";
import { SimpleConfetti } from "../components/SimpleConfetti";

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function getBudgetStatus(spent: number, limit: number) {
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  if (pct >= 100) return { color: "#EF4444", label: "Exceeded",   bg: "#FEF2F2", textColor: "#DC2626" };
  if (pct >= 75)  return { color: "#F97316", label: "Approaching", bg: "#FFF7ED", textColor: "#EA580C" };
  return              { color: "#22C55E", label: "Safe",         bg: "#F0FDF4", textColor: "#16A34A" };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1,  y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function DashboardContent() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(state => state.finance.transactions);
  const categories = useAppSelector(state => state.finance.categories);
  const budget = useAppSelector(state => state.finance.budget);
  const totalIncome = useAppSelector(selectTotalIncome);
  const totalExpenses = useAppSelector(selectTotalExpenses);
  const safeToSpend = useAppSelector(selectSafeToSpend);
  const expensesByCategory = useAppSelector(selectExpensesByCategory);
  const currentMonth = selectCurrentMonth();
  const streak = useAppSelector(state => state.gamification.streak);
  const [testConfetti, setTestConfetti] = useState(false);

  const celebrationFired = useRef(false);

  useEffect(() => {
    const storageKey = "ff_weekly_cel_2026_03_w1";
    if (celebrationFired.current || localStorage.getItem(storageKey)) return;

    const weeklyBudget = budget.mode === "global"
      ? budget.globalLimit / 4
      : Object.values(budget.categoryLimits).reduce((a, b) => a + b, 0) / 4;

    const week1Expenses = transactions
      .filter(t => t.type === "expense" && t.date >= "2026-03-01" && t.date <= "2026-03-07")
      .reduce((s, t) => s + t.amount, 0);

    if (week1Expenses <= weeklyBudget) {
      celebrationFired.current = true;
      localStorage.setItem(storageKey, "1");
      const delay = setTimeout(() => {
        dispatch(addCoins({ amount: 50, reason: "Weekly budget met — Week 1, March 🎯", type: "weekly_budget" }));
        dispatch(triggerCelebration({
          title: "Week 1 Budget Achieved! 🎯",
          message: "You stayed within your weekly spending limit!",
          subMessage: `Spent ${fmt(week1Expenses)} of ${fmt(weeklyBudget)} weekly budget. Incredible discipline!`,
          coinsEarned: 50,
          type: "weekly",
        }));
      }, 1200);
      return () => clearTimeout(delay);
    }
  }, []);

  const monthlyTx = transactions.filter(t => t.date.startsWith(currentMonth));
  const dailyAvg = totalExpenses / 7;

  const pieData = categories
    .map(cat => ({ name: cat.name, value: expensesByCategory[cat.id] || 0, color: cat.color, icon: cat.icon }))
    .filter(d => d.value > 0);

  const today = new Date("2026-03-07");
  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const total = transactions.filter(t => t.date === dateStr && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { day: d.toLocaleDateString("en-NG", { weekday: "short" }), amount: total };
  });

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const globalSpentPct = budget.globalLimit > 0 ? Math.min((totalExpenses / budget.globalLimit) * 100, 100) : 0;
  const globalStatus = getBudgetStatus(totalExpenses, budget.globalLimit);

  const weeklyBudget = budget.globalLimit / 4;
  const weeklyPct = Math.min((totalExpenses / weeklyBudget) * 100, 100);
  const weeklyStatus = weeklyPct < 75 ? "on-track" : weeklyPct < 100 ? "approaching" : "over";

  const getCategoryForTx = (catId: string) => categories.find(c => c.id === catId);

  const allCategoriesGreen = categories.every(
    cat => (expensesByCategory[cat.id] || 0) < (budget.categoryLimits[cat.id] || Infinity) * 0.75
  );

  return (
    <>
      <SimpleConfetti show={testConfetti} type="milestone" />
      <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 space-y-5 max-w-full mx-auto"
    >
      <motion.div variants={cardVariant} className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#0F172A" }}>Dashboard</h1>
          <p className="text-gray-500" style={{ fontSize: "1.15rem" }}>March 2026 · Week 1</p>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariant}
        className="rounded-2xl overflow-hidden"
        style={{
          background: weeklyStatus === "on-track"
            ? "linear-gradient(135deg, #064E3B, #065F46)"
            : weeklyStatus === "approaching"
            ? "linear-gradient(135deg, #7C2D12, #9A3412)"
            : "linear-gradient(135deg, #7F1D1D, #991B1B)",
        }}
      >
        <div className="p-5 relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute right-0 top-0 w-40 h-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={weeklyStatus === "on-track" ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AppIcon 
                    name={weeklyStatus === "on-track" ? "Bullseye" : weeklyStatus === "approaching" ? "TriangleExclamation" : "CircleExclamation"} 
                    size="xl" 
                    className={weeklyStatus === "on-track" ? "text-emerald-300" : weeklyStatus === "approaching" ? "text-amber-300" : "text-red-300"}
                  />
                </motion.div>
                <span className="text-white/70" style={{ fontSize: "1.1rem" }}>Week 1 · Budget Check</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-white" style={{ fontWeight: 700, fontSize: "1.4rem" }}>
                  {weeklyStatus === "on-track"
                    ? "You're killing it this week!"
                    : weeklyStatus === "approaching"
                    ? "Slow down a bit…"
                    : "Budget exceeded this week"}
                </p>
                {weeklyStatus === "on-track" && <AppIcon name="Fire" size="lg" className="text-orange-400" />}
              </div>
              <p className="text-white/60 mt-1" style={{ fontSize: "1.1rem" }}>
                {fmt(totalExpenses)} of {fmt(weeklyBudget)} weekly budget used
              </p>
              <div className="mt-3 bg-white/15 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyPct}%` }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: weeklyStatus === "on-track"
                      ? "linear-gradient(90deg,#34D399,#6EE7B7)"
                      : weeklyStatus === "approaching"
                      ? "linear-gradient(90deg,#FBBF24,#FDE68A)"
                      : "linear-gradient(90deg,#FCA5A5,#FECACA)",
                  }}
                />
              </div>
            </div>
            {weeklyStatus === "on-track" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                transition={{ delay: 0.5, type: "spring" }}
                className="ml-4 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.3)" }}
              >
                <div className="flex items-center gap-1">
                  <p className="text-emerald-300" style={{ fontWeight: 700, fontSize: "1rem" }}>+50</p>
                  <AppIcon name="Coins" size="sm" className="text-amber-400" />
                </div>
                <p className="text-emerald-400/70" style={{ fontSize: "0.875rem" }}>earned!</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(15,23,42,0.2)" }}
          className="col-span-2 bg-[#0F172A] rounded-2xl p-5 text-white relative overflow-hidden cursor-default"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/20 rounded-full -translate-y-8 translate-x-8"
          />
          <div className="absolute right-8 bottom-0 w-20 h-20 bg-emerald-500/10 rounded-full translate-y-6" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-emerald-400" />
              <span style={{ fontSize: "1.1rem", color: "#94A3B8" }}>Safe to Spend</span>
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}
            >
              {fmt(Math.max(safeToSpend, 0))}
            </motion.p>
            <p className="mt-2 text-white/50" style={{ fontSize: "1rem" }}>
              {fmt(totalIncome)} income · {fmt(totalExpenses)} spent
            </p>
            <div className="mt-3 bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((safeToSpend / totalIncome) * 100, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="h-1.5 rounded-full bg-emerald-400"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(16,185,129,0.15)" }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-default"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={15} className="text-emerald-600" />
            </div>
            <span className="text-gray-500" style={{ fontSize: "1.1rem" }}>Income</span>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0F172A" }}>{fmt(totalIncome)}</p>
          <p className="text-emerald-600 mt-1" style={{ fontSize: "1rem" }}>
            +{monthlyTx.filter(t => t.type === "income").length} this month
          </p>
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(239,68,68,0.15)" }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-default"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown size={15} className="text-red-500" />
            </div>
            <span className="text-gray-500" style={{ fontSize: "1.1rem" }}>Expenses</span>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0F172A" }}>{fmt(totalExpenses)}</p>
          <p className="text-red-500 mt-1" style={{ fontSize: "1rem" }}>
            {monthlyTx.filter(t => t.type === "expense").length} transactions
          </p>
        </motion.div>
      </div>

      {allCategoriesGreen && (
        <motion.div
          variants={cardVariant}
          className="flex items-center gap-3 rounded-xl px-4 py-3 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <AppIcon name="Fire" size="xl" className="text-orange-500" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p style={{ fontWeight: 700, color: "#fff", fontSize: "1.15rem" }}>
                Great job staying within budget, Tunde! · {streak} month streak
              </p>
              <AppIcon name="Fire" size="lg" className="text-orange-500" />
            </div>
            <p className="text-white/50" style={{ fontSize: "1rem" }}>All categories are in the green zone. Keep the momentum!</p>
          </div>
          <Link
            href="/rewards"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs hover:text-amber-200 transition-colors flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)", fontWeight: 600 }}
          >
            <AppIcon name="Coins" size="sm" className="text-amber-400" />
            <span className="text-amber-300">Rewards</span>
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <h3 style={{ color: "#0F172A", marginBottom: "1rem" }}>Spending Breakdown</h3>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <AppIcon name="ChartPie" size="3x" className="text-gray-300" />
              <p className="text-gray-400" style={{ fontSize: "1.15rem" }}>No expenses yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${entry.name}-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v as number)} contentStyle={{ fontSize: "0.8rem", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={`legend-${d.name}-${i}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span style={{ fontSize: "1.1rem", color: "#374151" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0F172A" }}>{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#0F172A" }}>Budget Progress</h3>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: globalStatus.bg, color: globalStatus.textColor, fontWeight: 600, fontSize: "0.95rem" }}
            >
              {globalStatus.label}
            </span>
          </div>

          {budget.mode === "global" && (
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: "1.1rem", color: "#6B7280" }}>Monthly Limit</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0F172A" }}>
                  {fmt(totalExpenses)} / {fmt(budget.globalLimit)}
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalSpentPct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: globalStatus.color }}
                />
              </div>
              <p style={{ fontSize: "1rem", color: "#9CA3AF", marginTop: "0.4rem" }}>
                {fmt(Math.max(budget.globalLimit - totalExpenses, 0))} remaining
              </p>
            </div>
          )}

          <div className="space-y-3">
            {categories.map(cat => {
              const spent = expensesByCategory[cat.id] || 0;
              const limit = budget.categoryLimits[cat.id] || 0;
              const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
              const status = getBudgetStatus(spent, limit);
              if (limit === 0 && spent === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <AppIcon name={cat.icon} style={{ color: cat.color }} />
                      <span style={{ fontSize: "1.1rem", color: "#374151", fontWeight: 500 }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: "1rem", color: status.textColor, fontWeight: 600 }}>
                      {fmt(spent)}{limit > 0 ? ` / ${fmt(limit)}` : ""}
                    </span>
                  </div>
                  {limit > 0 && (
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={cardVariant}
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <h3 style={{ color: "#0F172A", marginBottom: "1rem" }}>Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
              <Tooltip formatter={(v) => [fmt(v as number), "Spent"]} contentStyle={{ fontSize: "0.8rem", borderRadius: "8px" }} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2 text-gray-500" style={{ fontSize: "1rem" }}>
            <span>Daily avg: {fmt(Math.round(dailyAvg))}</span>
            <span>7 days</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={cardVariant}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: "#0F172A" }}>Recent Transactions</h3>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
            style={{ fontSize: "1.1rem", fontWeight: 500 }}
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-1">
          {recentTx.map((tx, idx) => {
            const cat = getCategoryForTx(tx.category);
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.07 }}
                whileHover={{ backgroundColor: "#F9FAFB" }}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-default"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                  style={{ backgroundColor: tx.type === "income" ? "#F0FDF4" : ((cat?.color || "#6B7280") + "18") }}
                >
                  <AppIcon 
                    name={tx.type === "income" ? "MoneyBillWave" : (cat?.icon || "Box")} 
                    style={{ color: tx.type === "income" ? "#16A34A" : cat?.color || "#6B7280" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "1.15rem", fontWeight: 500, color: "#0F172A" }} className="truncate">
                    {tx.note || (tx.type === "income" ? tx.source : cat?.name) || "Transaction"}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: "1rem" }}>
                    {tx.type === "income" ? tx.source : cat?.name} · {new Date(tx.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span style={{ fontSize: "1.15rem", fontWeight: 600, color: tx.type === "income" ? "#16A34A" : "#EF4444" }}>
                  {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </motion.div>
    </>
  );
}
