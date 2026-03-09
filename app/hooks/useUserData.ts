import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { initializeUserData } from '../store/financeSlice';

export function useUserData() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("budgeta_current_user") || "{}");
    
    if (user.email && user.onboardingCompleted) {
      // Initialize user-specific data if needed
      const userEmail = user.email;
      
      // Check if user data exists, if not initialize it
      const existingTransactions = localStorage.getItem(`ff_transactions_${userEmail}`);
      const existingCategories = localStorage.getItem(`ff_categories_${userEmail}`);
      const existingBudget = localStorage.getItem(`ff_budget_${userEmail}`);
      const existingGamification = localStorage.getItem(`ff_gamification_${userEmail}`);
      
      if (!existingTransactions || !existingCategories || !existingBudget) {
        // Initialize with empty/default data
        const defaultCategories = [
          { id: "food", name: "Food", color: "#F97316", icon: "Utensils" },
          { id: "transport", name: "Transport", color: "#3B82F6", icon: "Car" },
          { id: "bills", name: "Bills", color: "#8B5CF6", icon: "FileInvoice" },
          { id: "personal", name: "Personal", color: "#EC4899", icon: "User" },
          { id: "miscellaneous", name: "Miscellaneous", color: "#6B7280", icon: "Box" },
        ];
        
        const defaultBudget = {
          mode: "global" as const,
          globalLimit: user.budget?.globalLimit || 120000,
          categoryLimits: user.budget?.categoryLimits || {},
        };
        
        dispatch(initializeUserData({
          transactions: [],
          categories: defaultCategories,
          budget: defaultBudget
        }));
      }
      
      // Initialize gamification data for new users
      if (!existingGamification) {
        const freshGamificationData = {
          totalCoinsEarned: 0,
          availableCoins: 0,
          streak: 0,
          coinHistory: [],
          claimedMilestones: [],
          celebration: null,
          pendingCoinReward: null,
        };
        localStorage.setItem(`ff_gamification_${userEmail}`, JSON.stringify(freshGamificationData));
      } else {
        // Clear any existing celebration for existing users to prevent annoying popups
        const existingData = JSON.parse(existingGamification);
        if (existingData.celebration) {
          existingData.celebration = null;
          localStorage.setItem(`ff_gamification_${userEmail}`, JSON.stringify(existingData));
        }
      }
    }
  }, [dispatch]);
}