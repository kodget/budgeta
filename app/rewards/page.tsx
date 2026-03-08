"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { claimMilestone as claimMilestoneAction } from "../store/gamificationSlice";
import { selectTotalExpenses, selectNextMilestone, selectProgressToNextMilestone, MILESTONES } from "../store/selectors";
import type { Milestone } from "../store/gamificationSlice";
import { ClientLayout } from "../components/ClientLayout";
import { AppIcon } from "../components/AppIcon";
import { SimpleConfetti } from "../components/SimpleConfetti";

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, v => Math.round(v).toLocaleString());

  useEffect(() => {
    const ctrl = animate(motionVal, value, { duration: 1.2, ease: "easeOut" });
    return ctrl.stop;
  }, [value, motionVal]);

  return <motion.span>{rounded}</motion.span>;
}

const TIER_STYLES: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  bronze:  { bg: "#FEF3C7", border: "#D97706", text: "#92400E", gradient: "linear-gradient(135deg,#CD7F32,#F59E0B)" },
  silver:  { bg: "#F3F4F6", border: "#9CA3AF", text: "#374151", gradient: "linear-gradient(135deg,#9CA3AF,#E5E7EB)" },
  gold:    { bg: "#FFFBEB", border: "#F59E0B", text: "#78350F", gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)" },
  diamond: { bg: "#EFF6FF", border: "#3B82F6", text: "#1E3A8A", gradient: "linear-gradient(135deg,#3B82F6,#06B6D4)" },
  crown:   { bg: "#FDF4FF", border: "#A855F7", text: "#581C87", gradient: "linear-gradient(135deg,#A855F7,#EC4899)" },
};

function MilestoneCard({ milestone, available, isClaimed, onClaim }: {
  milestone: Milestone;
  available: number;
  isClaimed: boolean;
  onClaim: () => void;
}) {
  const style = TIER_STYLES[milestone.tier];
  const canClaim = !isClaimed && available >= milestone.coinsRequired;
  const pct = Math.min((available / milestone.coinsRequired) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isClaimed ? { y: -4 } : {}}
      className="relative rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: isClaimed ? "#F0FDF4" : style.bg,
        borderColor: isClaimed ? "#86EFAC" : style.border,
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: isClaimed ? "linear-gradient(135deg,#22C55E,#10B981)" : style.gradient }}
          >
            {isClaimed ? <AppIcon name="CircleCheck" size="2x" style={{ color: "white" }} /> : <AppIcon name={milestone.icon} size="2x" style={{ color: "white" }} />}
          </div>
          {isClaimed && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700" style={{ fontWeight: 600 }}>
              Claimed
            </span>
          )}
          {canClaim && !isClaimed && (
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ fontWeight: 600, background: style.gradient }}
            >
              Ready! <AppIcon name="Star" size="sm" style={{ color: "white" }} />
            </motion.span>
          )}
        </div>

        <p style={{ fontWeight: 700, color: isClaimed ? "#065F46" : style.text, fontSize: "0.95rem" }}>
          {milestone.label}
        </p>
        <p className="mt-0.5" style={{ fontWeight: 800, fontSize: "1.1rem", color: isClaimed ? "#16A34A" : style.text }}>
          {milestone.reward} cash
        </p>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.75rem" }}>
          Requires {milestone.coinsRequired.toLocaleString()} <AppIcon name="Coins" size="sm" className="text-gray-400" />
        </p>

        {!isClaimed && (
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Progress</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: style.text }}>{pct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: style.gradient }}
              />
            </div>
          </div>
        )}

        {canClaim && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClaim}
            className="mt-3 w-full py-2 rounded-xl text-white text-sm"
            style={{ fontWeight: 700, background: style.gradient }}
          >
            Redeem {milestone.reward} →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function RewardsPage() {
  const dispatch = useAppDispatch();
  const availableCoins = useAppSelector(state => state.gamification.availableCoins);
  const totalCoinsEarned = useAppSelector(state => state.gamification.totalCoinsEarned);
  const streak = useAppSelector(state => state.gamification.streak);
  const coinHistory = useAppSelector(state => state.gamification.coinHistory);
  const claimedMilestones = useAppSelector(state => state.gamification.claimedMilestones);
  const nextMilestone = useAppSelector(selectNextMilestone);
  const progressToNextMilestone = useAppSelector(selectProgressToNextMilestone);
  const budget = useAppSelector(state => state.finance.budget);
  const totalExpenses = useAppSelector(selectTotalExpenses);
  const milestones = MILESTONES;
  const [showConfetti, setShowConfetti] = useState(false);

  const claimMilestone = (milestone: Milestone) => {
    dispatch(claimMilestoneAction(milestone));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const weeklyBudget = budget.globalLimit / 4;
  const weeklyPct = Math.min((totalExpenses / weeklyBudget) * 100, 100);
  const weekStatus = weeklyPct < 75 ? "on-track" : weeklyPct < 100 ? "approaching" : "over";

  const typeIcons: Record<string, string> = {
    expense_logged: "PenToSquare", income_logged: "MoneyBillWave", weekly_budget: "Bullseye",
    monthly_budget: "Trophy", streak: "Fire", logging: "Bolt", claimed: "Gift",
  };

  const earnedThisMonth = coinHistory
    .filter(c => c.date.startsWith("2026-03") && c.amount > 0)
    .reduce((s, c) => s + c.amount, 0);

  return (
    <>
      <SimpleConfetti show={showConfetti} type="milestone" />
      <ClientLayout>
      <div className="p-4 md:p-6 space-y-6 ">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ color: "#0F172A" }}>Rewards</h1>
          <p className="text-gray-500" style={{ fontSize: "0.875rem" }}>Your financial journey & achievements</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, #10B981, transparent)", transform: "translate(30%, -30%)" }}
          />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AppIcon name="Coins" size="xl" className="text-amber-400" />
                  </motion.div>
                  <span className="text-white/60" style={{ fontSize: "1.1rem" }}>Available Coins</span>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2 w-2 h-2 bg-amber-400 rounded-full"
                  />
                </div>
                <div className="flex items-end gap-3">
                  <p style={{ fontWeight: 900, fontSize: "3rem", color: "#FBBF24", lineHeight: 1 }}>
                    <AnimatedNumber value={availableCoins} />
                  </p>
                  <div className="pb-1">
                    <p className="text-white/40" style={{ fontSize: "1rem" }}>of {totalCoinsEarned.toLocaleString()} earned</p>
                  </div>
                </div>
                <p className="text-white/50 mt-1" style={{ fontSize: "1.1rem" }}>
                  +{earnedThisMonth} coins earned in March 2026
                </p>
              </div>

              <div className="flex gap-4">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <AppIcon name="Fire" size="2x" className="text-orange-500" />
                  </motion.div>
                  <p style={{ fontWeight: 800, color: "#FB923C", fontSize: "1.8rem", lineHeight: 1 }}>{streak}</p>
                  <p className="text-white/50" style={{ fontSize: "1rem" }}>month streak</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <Trophy size={18} className="text-amber-400 mx-auto mb-1" />
                  <p style={{ fontWeight: 800, color: "#FCD34D", fontSize: "1.8rem", lineHeight: 1 }}>
                    {claimedMilestones.length}
                  </p>
                  <p className="text-white/50" style={{ fontSize: "1rem" }}>milestones</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <Star size={18} className="text-purple-400 mx-auto mb-1" />
                  <p style={{ fontWeight: 800, color: "#C4B5FD", fontSize: "1.8rem", lineHeight: 1 }}>
                    {coinHistory.filter(c => c.amount > 0).length}
                  </p>
                  <p className="text-white/50" style={{ fontSize: "1rem" }}>rewards</p>
                </div>
              </div>
            </div>

            {nextMilestone && (
              <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AppIcon name={nextMilestone.icon} size="lg" className="text-white" />
                    <span className="text-white" style={{ fontWeight: 600, fontSize: "1.15rem" }}>{nextMilestone.label}</span>
                  </div>
                  <span className="text-amber-400" style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {availableCoins} / {nextMilestone.coinsRequired} <AppIcon name="Coins" className="text-amber-400" />
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextMilestone}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #10B981, #FBBF24)" }}
                  />
                </div>
                <p className="text-white/40 mt-1" style={{ fontSize: "1rem" }}>
                  {Math.max(nextMilestone.coinsRequired - availableCoins, 0)} more coins → {nextMilestone.reward}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 style={{ color: "#0F172A" }}>Milestones & Cash Rewards</h3>
              <p className="text-gray-500" style={{ fontSize: "1.1rem" }}>Convert coins into real cash</p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600">
              <AppIcon name="Coins" className="text-amber-600" />
              <span style={{ fontWeight: 700, fontSize: "1.15rem" }}>{availableCoins.toLocaleString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map(m => (
              <MilestoneCard
                key={m.id}
                milestone={m}
                available={availableCoins}
                isClaimed={claimedMilestones.includes(m.id)}
                onClaim={() => claimMilestone(m)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 style={{ color: "#0F172A" }}>How to Earn Coins</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { icon: "PenToSquare", label: "Log an expense", reward: "+5", desc: "Every transaction you record" },
              { icon: "MoneyBillWave", label: "Log income", reward: "+10", desc: "When you receive money" },
              { icon: "Bullseye", label: "Weekly budget goal", reward: "+50", desc: "Spend under weekly limit" },
              { icon: "Trophy", label: "Monthly budget goal", reward: "+200", desc: "Finish month under budget" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AppIcon name={item.icon} size="lg" className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p style={{ fontWeight: 500, color: "#0F172A", fontSize: "1.15rem" }}>{item.label}</p>
                  <p className="text-gray-400" style={{ fontSize: "1rem" }}>{item.desc}</p>
                </div>
                <span className="px-2 py-1 rounded-lg flex items-center gap-1" style={{ fontWeight: 700, background: "#FFFBEB", color: "#92400E", fontSize: "1rem" }}>
                  {item.reward} <AppIcon name="Coins" className="text-amber-600" size="sm" />
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 style={{ color: "#0F172A" }}>Coin History</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {coinHistory.slice(0, 12).map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <AppIcon name={typeIcons[entry.type] || "Coins"} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "1.1rem", color: "#0F172A", fontWeight: 500 }}>
                    {entry.reason}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: "1rem" }}>
                    {new Date(entry.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span style={{ fontWeight: 700, fontSize: "1.15rem", color: entry.amount > 0 ? "#F59E0B" : "#EF4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {entry.amount > 0 ? "+" : ""}{entry.amount} <AppIcon name="Coins" size="sm" className="text-amber-500" />
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      </ClientLayout>
    </>
  );
}
