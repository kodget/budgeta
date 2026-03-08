import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const initialState: GamificationState = loadFromStorage("ff_gamification", {
  totalCoinsEarned: 1097,
  availableCoins: 847,
  streak: 3,
  coinHistory: SEED_COIN_HISTORY,
  claimedMilestones: ["m1"],
  celebration: null,
  pendingCoinReward: null,
});

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    addCoins: (state, action: PayloadAction<{ amount: number; reason: string; type: CoinEntry["type"] }>) => {
      const entry: CoinEntry = {
        id: `c_${Date.now()}`,
        amount: action.payload.amount,
        reason: action.payload.reason,
        date: new Date().toISOString().split("T")[0],
        type: action.payload.type,
      };
      state.totalCoinsEarned += action.payload.amount;
      state.availableCoins += action.payload.amount;
      state.coinHistory.unshift(entry);
      state.pendingCoinReward = action.payload.amount;
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_gamification", JSON.stringify(state));
      }
    },
    claimMilestone: (state, action: PayloadAction<Milestone>) => {
      const milestone = action.payload;
      state.availableCoins -= milestone.coinsRequired;
      state.claimedMilestones.push(milestone.id);
      state.coinHistory.unshift({
        id: `claim_${Date.now()}`,
        amount: -milestone.coinsRequired,
        reason: `${milestone.icon} ${milestone.label} redeemed → ${milestone.reward}`,
        date: new Date().toISOString().split("T")[0],
        type: "claimed",
      });
      state.celebration = {
        title: `${milestone.icon} ${milestone.label} Unlocked!`,
        message: `You just redeemed ${milestone.reward}!`,
        subMessage: `${milestone.coinsRequired} coins converted to real cash. Amazing work!`,
        coinsEarned: 0,
        type: "milestone",
        milestone,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("ff_gamification", JSON.stringify(state));
      }
    },
    dismissCelebration: (state) => {
      state.celebration = null;
    },
    triggerCelebration: (state, action: PayloadAction<CelebrationData>) => {
      state.celebration = action.payload;
    },
    clearPendingCoin: (state) => {
      state.pendingCoinReward = null;
    },
  },
});

export const { addCoins, claimMilestone, dismissCelebration, triggerCelebration, clearPendingCoin } = gamificationSlice.actions;
export default gamificationSlice.reducer;
