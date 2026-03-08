"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface CoinEntry {
  id: string;
  amount: number;
  reason: string;
  date: string;
  type: "expense_logged" | "income_logged" | "weekly_budget" | "monthly_budget" | "streak" | "logging" | "claimed";
}

export interface Milestone {
  id: string;
  coinsRequired: number;
  reward: string;
  cashValue: number;
  icon: string;
  label: string;
  tier: "bronze" | "silver" | "gold" | "diamond" | "crown";
}

export interface StreakMonth {
  month: string;
  label: string;
  achieved: boolean;
  inProgress: boolean;
}

export interface CelebrationData {
  title: string;
  message: string;
  subMessage?: string;
  coinsEarned: number;
  type: "weekly" | "monthly" | "milestone" | "streak" | "tracking";
  milestone?: Milestone;
}

interface GamificationState {
  totalCoinsEarned: number;
  availableCoins: number;
  streak: number;
  coinHistory: CoinEntry[];
  claimedMilestones: string[];
  celebration: CelebrationData | null;
  pendingCoinReward: number | null;
}

interface GamificationContextType extends GamificationState {
  addCoins: (amount: number, reason: string, type: CoinEntry["type"]) => void;
  claimMilestone: (milestone: Milestone) => void;
  dismissCelebration: () => void;
  triggerCelebration: (data: CelebrationData) => void;
  clearPendingCoin: () => void;
  milestones: Milestone[];
  streakMonths: StreakMonth[];
  nextMilestone: Milestone | null;
  progressToNextMilestone: number;
}

export const MILESTONES: Milestone[] = [
  { id: "m1", coinsRequired: 250, reward: "₦1,250", cashValue: 1250, icon: "🥉", label: "Bronze Saver", tier: "bronze" },
  { id: "m2", coinsRequired: 500, reward: "₦2,500", cashValue: 2500, icon: "🥈", label: "Silver Saver", tier: "silver" },
  { id: "m3", coinsRequired: 1000, reward: "₦5,000", cashValue: 5000, icon: "🥇", label: "Gold Saver", tier: "gold" },
  { id: "m4", coinsRequired: 2500, reward: "₦12,500", cashValue: 12500, icon: "💎", label: "Diamond Saver", tier: "diamond" },
  { id: "m5", coinsRequired: 5000, reward: "₦25,000", cashValue: 25000, icon: "👑", label: "Finance King", tier: "crown" },
];

const STREAK_MONTHS: StreakMonth[] = [
  { month: "2025-10", label: "Oct", achieved: false, inProgress: false },
  { month: "2025-11", label: "Nov", achieved: false, inProgress: false },
  { month: "2025-12", label: "Dec", achieved: true, inProgress: false },
  { month: "2026-01", label: "Jan", achieved: true, inProgress: false },
  { month: "2026-02", label: "Feb", achieved: true, inProgress: false },
  { month: "2026-03", label: "Mar", achieved: false, inProgress: true },
];

const SEED_COIN_HISTORY: CoinEntry[] = [
  { id: "c1", amount: 200, reason: "Monthly budget achieved — Feb 2026 🏆", date: "2026-02-28", type: "monthly_budget" },
  { id: "c2", amount: 75, reason: "3-month streak bonus 🔥", date: "2026-02-28", type: "streak" },
  { id: "c3", amount: 50, reason: "Weekly budget met — Week 4, Feb", date: "2026-02-24", type: "weekly_budget" },
  { id: "c4", amount: 50, reason: "Weekly budget met — Week 3, Feb", date: "2026-02-17", type: "weekly_budget" },
  { id: "c5", amount: 50, reason: "Weekly budget met — Week 2, Feb", date: "2026-02-10", type: "weekly_budget" },
  { id: "c6", amount: 50, reason: "Weekly budget met — Week 1, Feb", date: "2026-02-03", type: "weekly_budget" },
  { id: "c7", amount: 200, reason: "Monthly budget achieved — Jan 2026 🏆", date: "2026-01-31", type: "monthly_budget" },
  { id: "c8", amount: 50, reason: "2-month streak bonus 🔥", date: "2026-01-31", type: "streak" },
  { id: "c9", amount: 50, reason: "Weekly budget met — Week 4, Jan", date: "2026-01-27", type: "weekly_budget" },
  { id: "c10", amount: 50, reason: "Weekly budget met — Week 3, Jan", date: "2026-01-20", type: "weekly_budget" },
  { id: "c11", amount: 38, reason: "Daily tracking bonus — Jan 2026", date: "2026-01-14", type: "logging" },
  { id: "c12", amount: 200, reason: "Monthly budget achieved — Dec 2025 🏆", date: "2025-12-31", type: "monthly_budget" },
  { id: "c13", amount: 25, reason: "1-month streak bonus 🔥", date: "2025-12-31", type: "streak" },
  { id: "c14", amount: 9, reason: "Transactions logged — Dec 2025", date: "2025-12-28", type: "logging" },
  { id: "c15", amount: -250, reason: "🥉 Bronze milestone redeemed → ₦1,250", date: "2026-01-05", type: "claimed" },
];

const DEFAULT_STATE: GamificationState = {
  totalCoinsEarned: 1097,
  availableCoins: 847,
  streak: 3,
  coinHistory: SEED_COIN_HISTORY,
  claimedMilestones: ["m1"],
  celebration: null,
  pendingCoinReward: null,
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(() => load("ff_gamification", DEFAULT_STATE));

  useEffect(() => {
    localStorage.setItem("ff_gamification", JSON.stringify(state));
  }, [state]);

  const nextMilestone = MILESTONES.find(m => !state.claimedMilestones.includes(m.id)) ?? null;
  const progressToNextMilestone = nextMilestone
    ? Math.min((state.availableCoins / nextMilestone.coinsRequired) * 100, 100)
    : 100;

  const addCoins = useCallback((amount: number, reason: string, type: CoinEntry["type"]) => {
    const entry: CoinEntry = { id: `c_${Date.now()}`, amount, reason, date: new Date().toISOString().split("T")[0], type };
    setState(prev => ({
      ...prev,
      totalCoinsEarned: prev.totalCoinsEarned + amount,
      availableCoins: prev.availableCoins + amount,
      coinHistory: [entry, ...prev.coinHistory],
      pendingCoinReward: amount,
    }));
  }, []);

  const claimMilestone = useCallback((milestone: Milestone) => {
    setState(prev => ({
      ...prev,
      availableCoins: prev.availableCoins - milestone.coinsRequired,
      claimedMilestones: [...prev.claimedMilestones, milestone.id],
      coinHistory: [{
        id: `claim_${Date.now()}`,
        amount: -milestone.coinsRequired,
        reason: `${milestone.icon} ${milestone.label} redeemed → ${milestone.reward}`,
        date: new Date().toISOString().split("T")[0],
        type: "claimed",
      }, ...prev.coinHistory],
      celebration: {
        title: `${milestone.icon} ${milestone.label} Unlocked!`,
        message: `You just redeemed ${milestone.reward}!`,
        subMessage: `${milestone.coinsRequired} coins converted to real cash. Amazing work!`,
        coinsEarned: 0,
        type: "milestone",
        milestone,
      },
    }));
  }, []);

  const dismissCelebration = useCallback(() => {
    setState(prev => ({ ...prev, celebration: null }));
  }, []);

  const triggerCelebration = useCallback((data: CelebrationData) => {
    setState(prev => ({ ...prev, celebration: data }));
  }, []);

  const clearPendingCoin = useCallback(() => {
    setState(prev => ({ ...prev, pendingCoinReward: null }));
  }, []);

  return (
    <GamificationContext.Provider value={{
      ...state,
      addCoins, claimMilestone, dismissCelebration, triggerCelebration, clearPendingCoin,
      milestones: MILESTONES,
      streakMonths: STREAK_MONTHS,
      nextMilestone,
      progressToNextMilestone,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
