"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addTransaction } from "../store/financeSlice";
import { addCoins } from "../store/gamificationSlice";
import { AppIcon } from "./AppIcon";
import { SimpleConfetti } from "./SimpleConfetti";

interface Props {
  onClose: () => void;
}

const INCOME_SOURCES = ["Allowance", "Salary", "Freelance", "Gift", "Business Income", "Other"];

export function AddTransactionModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.finance.categories);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]?.id || "food");
  const [source, setSource] = useState("Salary");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState<"expense" | "income">("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    dispatch(addTransaction({
      type,
      amount: Number(amount),
      category: type === "income" ? "income" : category,
      source: type === "income" ? source : undefined,
      date,
      note: note || undefined,
    }));

    const coins = type === "income" ? 10 : 5;
    setCoinsEarned(coins);
    setConfettiType(type);
    dispatch(addCoins({ amount: coins, reason: type === "income" ? "Income logged 💰" : "Expense recorded 📝", type: type === "income" ? "income_logged" : "expense_logged" }));
    setSuccess(true);
    setTimeout(() => {
      onClose();
      setTimeout(() => setShowConfetti(true), 200);
    }, 1400);
  };

  return (
    <>
      <SimpleConfetti show={showConfetti} type={confettiType} />
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0F172A" }}>Quick Add</h2>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#FEF2F2" }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex flex-col items-center justify-center py-12 px-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                  className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                >
                  <span style={{ fontSize: "2rem" }}><AppIcon name={type === "income" ? "MoneyBillWave" : "CircleCheck"} size="2x" className={type === "income" ? "text-emerald-500" : "text-emerald-500"} /></span>
                </motion.div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "1.05rem" }}>
                  {type === "income" ? "Income logged!" : "Expense recorded!"}
                </p>
                <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
                  Great job staying on track!
                </p>
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                  className="mt-4 flex items-center gap-2 px-5 py-2 rounded-full"
                  style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 20, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <AppIcon name="Coins" size="lg" className="text-white" />
                  </motion.div>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "1rem" }}>+{coinsEarned} coins earned!</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-4"
              >
                {/* Type toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                  <motion.button
                    type="button"
                    onClick={() => setType("expense")}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                      type === "expense" ? "bg-white shadow text-red-500" : "text-gray-500"
                    }`}
                  >
                    <TrendingDown size={15} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Expense</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setType("income")}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                      type === "income" ? "bg-white shadow text-emerald-500" : "text-gray-500"
                    }`}
                  >
                    <TrendingUp size={15} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Income</span>
                  </motion.button>
                </div>

                {/* Coin hint */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <AppIcon name="Coins" size="sm" className="text-amber-600" />
                  <p style={{ fontSize: "0.75rem", color: "#92400E" }}>
                    Earn <strong>{type === "income" ? "10" : "5"} coins</strong> for logging this {type}!
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                    Amount (₦) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontWeight: 600, fontSize: "1rem" }}>₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 transition-all"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Category / Source */}
                {type === "expense" ? (
                  <div>
                    <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>Category</label>
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map(cat => (
                        <motion.button
                          key={cat.id}
                          type="button"
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setCategory(cat.id)}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
                          style={category === cat.id
                            ? { borderColor: cat.color, backgroundColor: cat.color + "18" }
                            : { borderColor: "#E5E7EB" }
                          }
                        >
                          <span style={{ fontSize: "1.2rem" }}><AppIcon name={cat.icon} style={{ color: cat.color }} /></span>
                          <span style={{ fontSize: "0.6rem", fontWeight: 500, color: category === cat.id ? cat.color : "#6B7280" }}>
                            {cat.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>Source</label>
                    <select
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                    >
                      {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                    Note <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. Jollof rice & drinks"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  {type === "income" ? "Log Income +10" : "Record Expense +5"} <AppIcon name="Coins" size="sm" className="text-white" />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}
