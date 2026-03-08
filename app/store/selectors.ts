import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const MILESTONES = [
  { id: "m1", coinsRequired: 250, reward: "₦1,250", cashValue: 1250, icon: "🥉", label: "Bronze Saver", tier: "bronze" as const },
  { id: "m2", coinsRequired: 500, reward: "₦2,500", cashValue: 2500, icon: "🥈", label: "Silver Saver", tier: "silver" as const },
  { id: "m3", coinsRequired: 1000, reward: "₦5,000", cashValue: 5000, icon: "🥇", label: "Gold Saver", tier: "gold" as const },
  { id: "m4", coinsRequired: 2500, reward: "₦12,500", cashValue: 12500, icon: "💎", label: "Diamond Saver", tier: "diamond" as const },
  { id: "m5", coinsRequired: 5000, reward: "₦25,000", cashValue: 25000, icon: "👑", label: "Finance King", tier: "crown" as const },
];

export const STREAK_MONTHS = [
  { month: "2025-10", label: "Oct", achieved: false, inProgress: false },
  { month: "2025-11", label: "Nov", achieved: false, inProgress: false },
  { month: "2025-12", label: "Dec", achieved: true, inProgress: false },
  { month: "2026-01", label: "Jan", achieved: true, inProgress: false },
  { month: "2026-02", label: "Feb", achieved: true, inProgress: false },
  { month: "2026-03", label: "Mar", achieved: false, inProgress: true },
];

const selectTransactions = (state: RootState) => state.finance.transactions;

export const selectCurrentMonth = () => "2026-03";

export const selectMonthlyTransactions = createSelector(
  [selectTransactions],
  (transactions) => transactions.filter(t => t.date.startsWith("2026-03"))
);

export const selectTotalIncome = createSelector(
  [selectMonthlyTransactions],
  (transactions) => transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
);

export const selectTotalExpenses = createSelector(
  [selectMonthlyTransactions],
  (transactions) => transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
);

export const selectSafeToSpend = createSelector(
  [selectTotalIncome, selectTotalExpenses],
  (income, expenses) => income - expenses
);

export const selectExpensesByCategory = createSelector(
  [selectMonthlyTransactions],
  (transactions) => {
    const result: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      result[t.category] = (result[t.category] || 0) + t.amount;
    });
    return result;
  }
);

const selectAvailableCoins = (state: RootState) => state.gamification.availableCoins;
const selectClaimedMilestones = (state: RootState) => state.gamification.claimedMilestones;

export const selectNextMilestone = createSelector(
  [selectClaimedMilestones],
  (claimed) => MILESTONES.find(m => !claimed.includes(m.id)) ?? null
);

export const selectProgressToNextMilestone = createSelector(
  [selectAvailableCoins, selectNextMilestone],
  (coins, milestone) => milestone ? Math.min((coins / milestone.coinsRequired) * 100, 100) : 100
);
