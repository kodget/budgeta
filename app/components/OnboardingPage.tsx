"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Wallet, Target, PlusCircle, BarChart3, Check, Sparkles } from "lucide-react";

const displayFont: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const bodyFont: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };
const LIME = "#AAFF4D";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: string;
  component?: React.ReactNode;
}

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem("budgeta_current_user") || "{}");
    setUserName(user.firstName || "there");
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: `${getGreeting()}, ${userName}! 👋`,
      description: "Welcome to Budgeta! Let's get you set up with a quick 3-step tour so you can start tracking your naira like a pro.",
      icon: Sparkles,
      action: "Let's start!"
    },
    {
      id: 1,
      title: "What's your monthly income?",
      description: "This helps us suggest realistic budget limits and track your savings rate. Don't worry, you can change this anytime.",
      icon: Wallet,
      component: (
        <div className="w-full max-w-sm">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₦</span>
            <input
              type="number"
              placeholder="150,000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl text-white placeholder-white/30 outline-none text-lg text-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.1)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600
              }}
              onFocus={e => e.target.style.borderColor = LIME + "60"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <p className="text-white/40 text-sm mt-2 text-center">Enter your monthly income in Naira</p>
        </div>
      )
    },
    {
      id: 2,
      title: "Set your monthly spending limit",
      description: "We recommend spending no more than 80% of your income. This leaves room for savings and unexpected expenses.",
      icon: Target,
      component: (
        <div className="w-full max-w-sm">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₦</span>
            <input
              type="number"
              placeholder={monthlyIncome ? (parseInt(monthlyIncome) * 0.8).toLocaleString() : "120,000"}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl text-white placeholder-white/30 outline-none text-lg text-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.1)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600
              }}
              onFocus={e => e.target.style.borderColor = LIME + "60"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          {monthlyIncome && (
            <div className="mt-3 text-center">
              <p className="text-white/60 text-sm">
                Recommended: ₦{(parseInt(monthlyIncome) * 0.8).toLocaleString()} 
                <span className="text-white/40"> (80% of income)</span>
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 3,
      title: "You're all set! 🎉",
      description: "Your budget is configured and ready to go. Now you can start tracking transactions, set savings goals, and watch your wealth grow.",
      icon: Check,
      action: "Enter Budgeta"
    }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !monthlyIncome) {
      return; // Don't proceed without income
    }
    if (currentStep === 2 && !monthlyBudget) {
      return; // Don't proceed without budget
    }
    
    if (currentStep === steps.length - 1) {
      // Save onboarding data and redirect to dashboard
      setLoading(true);
      
      // Initialize user's financial data
      const initialData = {
        budget: {
          mode: "global" as const,
          globalLimit: parseInt(monthlyBudget) || 100000,
          categoryLimits: {}
        },
        income: parseInt(monthlyIncome) || 150000,
        onboardingCompleted: true
      };
      
      // Update user data
      const user = JSON.parse(localStorage.getItem("budgeta_current_user") || "{}");
      const updatedUser = { ...user, ...initialData, isFirstTime: false };
      localStorage.setItem("budgeta_current_user", JSON.stringify(updatedUser));
      
      // Initialize user-specific empty data
      const userEmail = user.email;
      if (userEmail) {
        // Initialize empty transactions for this user
        localStorage.setItem(`ff_transactions_${userEmail}`, JSON.stringify([]));
        
        // Initialize budget settings for this user
        localStorage.setItem(`ff_budget_${userEmail}`, JSON.stringify(initialData.budget));
        
        // Initialize default categories for this user
        const defaultCategories = [
          { id: "food", name: "Food", color: "#F97316", icon: "Utensils" },
          { id: "transport", name: "Transport", color: "#3B82F6", icon: "Car" },
          { id: "bills", name: "Bills", color: "#8B5CF6", icon: "FileInvoice" },
          { id: "personal", name: "Personal", color: "#EC4899", icon: "User" },
          { id: "miscellaneous", name: "Miscellaneous", color: "#6B7280", icon: "Box" },
        ];
        localStorage.setItem(`ff_categories_${userEmail}`, JSON.stringify(defaultCategories));
      }
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return monthlyIncome.trim() !== "";
    if (currentStep === 2) return monthlyBudget.trim() !== "";
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
         style={{ ...bodyFont, background: "#09090B" }}>
      
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
           style={{ background: `radial-gradient(circle, ${LIME}15, transparent)` }} />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    background: index <= currentStep ? LIME : "rgba(255,255,255,0.2)" 
                  }} 
                />
                {index < steps.length - 1 && (
                  <div 
                    className="w-8 h-0.5 mx-1 transition-all duration-300"
                    style={{ 
                      background: index < currentStep ? LIME : "rgba(255,255,255,0.1)" 
                    }} 
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                 style={{ background: `${LIME}18`, border: `2px solid ${LIME}40` }}>
              {(() => {
                const IconComponent = steps[currentStep].icon;
                return <IconComponent className="w-8 h-8" style={{ color: LIME }} />;
              })()}
            </div>

            {/* Title */}
            <h1 className="text-white mb-4" 
                style={{ ...displayFont, fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}>
              {steps[currentStep].title}
            </h1>

            {/* Description */}
            <p className="text-white/60 mb-8 max-w-md mx-auto" 
               style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
              {steps[currentStep].description}
            </p>

            {/* Component (for input steps) */}
            {steps[currentStep].component && (
              <div className="mb-8 flex justify-center">
                {steps[currentStep].component}
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl text-black transition-all hover:opacity-90 disabled:opacity-50"
              style={{ 
                background: canProceed() ? LIME : "rgba(255,255,255,0.1)", 
                color: canProceed() ? "#000" : "rgba(255,255,255,0.4)",
                fontWeight: 700 
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <span>{steps[currentStep].action || "Continue"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Skip option for input steps */}
            {(currentStep === 1 || currentStep === 2) && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="block mx-auto mt-4 text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Skip for now
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: LIME }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-white" style={{ ...displayFont, fontWeight: 700 }}>Budgeta</span>
          </div>
        </div>
      </div>
    </div>
  );
}