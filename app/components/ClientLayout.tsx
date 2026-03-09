"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT LAYOUT COMPONENT
// Main layout wrapper that provides navigation, sidebar, and user management
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ArrowLeftRight, Target,
  Tag, Plus, TrendingUp, Menu, X, Trophy, LogOut,
} from "lucide-react";
import { AddTransactionModal } from "./AddTransactionModal";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { CoinFloater } from "./CoinFloater";
import { DashboardContent } from "./DashboardContent";
import { useAppSelector } from "../store/hooks";
import { AppIcon } from "./AppIcon";
import { useUserData } from "../hooks/useUserData";

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIGURATION
// Define all main navigation items with their routes and icons
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard, iconName: "ChartLine" },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight, iconName: "ArrowRightArrowLeft" },
  { href: "/budget",       label: "Budget",       icon: Target, iconName: "Bullseye" },
  { href: "/categories",   label: "Categories",   icon: Tag, iconName: "Tag" },
  { href: "/rewards",      label: "Rewards",      icon: Trophy, iconName: "Trophy" },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useUserData(); // Initialize user-specific data
  // ─────────────────────────────────────────────────────────────────────────────
  // COMPONENT STATE
  // Manage UI state for modals, navigation, and user data
  // ─────────────────────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);           // Controls add transaction modal
  const [mobileOpen, setMobileOpen] = useState(false);         // Controls mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);        // Controls desktop sidebar visibility
  const [mounted, setMounted] = useState(false);               // Prevents hydration mismatch
  const [user, setUser] = useState<any>(null);                 // Current user data from localStorage
  
  // Redux state selectors for gamification data
  const availableCoins = useAppSelector(state => state.gamification.availableCoins);
  const streak = useAppSelector(state => state.gamification.streak);
  const pendingCoinReward = useAppSelector(state => state.gamification.pendingCoinReward);
  
  // Navigation hooks
  const pathname = usePathname();
  const router = useRouter();

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIALIZATION EFFECT
  // Load user data from localStorage and set mounted state
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true); // Prevent hydration mismatch
    const currentUser = JSON.parse(localStorage.getItem("budgeta_current_user") || "{}");
    setUser(currentUser);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGOUT HANDLER
  // Clear user session and redirect to landing page
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("budgeta_current_user");
    router.push("/");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITY FUNCTION
  // Generate user initials from full name for avatar display
  // ─────────────────────────────────────────────────────────────────────────────
  const getUserInitials = (fullName: string) => {
    return fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Prevent rendering until component is mounted (avoids hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] flex flex-col shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-white" />
                </motion.div>
                <div>
                  <span className="text-white block" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Budgeta</span>
                  <p className="text-white/50" style={{ fontSize: "0.75rem" }}>Personal Finance</p>
                </div>
              </div>
              <button 
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg" 
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400" style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {user?.fullName ? getUserInitials(user.fullName) : "U"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white truncate" style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-white/50 truncate" style={{ fontSize: "0.85rem" }}>
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/40 hover:text-white/70 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              <div className="flex gap-2">
                <motion.div 
                  animate={pendingCoinReward ? { scale: [1, 1.1, 1] } : {}} 
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl" 
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <AppIcon name="Coins" size="lg" className="text-amber-400" />
                  </motion.div>
                  <span style={{ fontWeight: 700, color: "#FBBF24", fontSize: "1.1rem" }}>{availableCoins.toLocaleString()}</span>
                </motion.div>
                <motion.div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <AppIcon name="Fire" size="lg" className="text-orange-500" />
                  </motion.div>
                  <span style={{ fontWeight: 700, color: "#FB923C", fontSize: "1.1rem" }}>{streak}</span>
                </motion.div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
              {navItems.map(({ href, label, icon: Icon, iconName }, idx) => {
                const isActive = pathname === href;
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Link 
                      href={href} 
                      onClick={() => setMobileOpen(false)} 
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                        isActive 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={22} className={isActive ? "text-white" : "text-white/70 group-hover:text-white"} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{label}</span>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ duration: 2, repeat: Infinity }} 
                        className="ml-auto px-2 py-1 rounded-lg" 
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <AppIcon name={iconName} size="sm" className={isActive ? "text-white" : "text-white/50"} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-5 py-5 border-t border-white/10">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => { setShowModal(true); setMobileOpen(false); }} 
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 transition-colors shadow-lg shadow-emerald-500/20 relative overflow-hidden"
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-xl"
                />
                <Plus size={20} className="relative z-10" />
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }} className="relative z-10">Quick Add</span>
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="relative z-10 text-amber-300"
                >
                  ✨
                </motion.span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -384 }}
            animate={{ x: 0 }}
            exit={{ x: -384 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden lg:flex relative inset-y-0 left-0 z-50 w-72 bg-[#0F172A] flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-white" />
                </motion.div>
                <div>
                  <span className="text-white block" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Budgeta</span>
                  <p className="text-white/50" style={{ fontSize: "0.75rem" }}>Personal Finance</p>
                </div>
              </div>
              <button 
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg" 
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400" style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {user?.fullName ? getUserInitials(user.fullName) : "U"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white truncate" style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-white/50 truncate" style={{ fontSize: "0.85rem" }}>
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/40 hover:text-white/70 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              <div className="flex gap-2">
                <motion.div 
                  animate={pendingCoinReward ? { scale: [1, 1.1, 1] } : {}} 
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl" 
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <AppIcon name="Coins" size="lg" className="text-amber-400" />
                  </motion.div>
                  <span style={{ fontWeight: 700, color: "#FBBF24", fontSize: "1.1rem" }}>{availableCoins.toLocaleString()}</span>
                </motion.div>
                <motion.div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <AppIcon name="Fire" size="lg" className="text-orange-500" />
                  </motion.div>
                  <span style={{ fontWeight: 700, color: "#FB923C", fontSize: "1.1rem" }}>{streak}</span>
                </motion.div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
              {navItems.map(({ href, label, icon: Icon, iconName }, idx) => {
                const isActive = pathname === href;
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Link 
                      href={href} 
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                        isActive 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={22} className={isActive ? "text-white" : "text-white/70 group-hover:text-white"} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{label}</span>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ duration: 2, repeat: Infinity }} 
                        className="ml-auto px-2 py-1 rounded-lg" 
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <AppIcon name={iconName} size="sm" className={isActive ? "text-white" : "text-white/50"} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-5 py-5 border-t border-white/10">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => setShowModal(true)} 
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 transition-colors shadow-lg shadow-emerald-500/20 relative overflow-hidden"
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-xl"
                />
                <Plus size={20} className="relative z-10" />
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }} className="relative z-10">Quick Add</span>
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="relative z-10 text-amber-300"
                >
                  ✨
                </motion.span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 shadow-sm px-3 lg:px-4 py-3 flex items-center gap-3 z-10">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors hidden"
            >
              <Menu size={20} />
            </button>
          )}
          <button 
            onClick={() => setMobileOpen(true)} 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center lg:hidden">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0F172A" }} className="lg:hidden">Budgeta</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <AppIcon name="Coins" className="text-amber-600" />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#92400E" }}>{availableCoins}</span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }} 
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }} className="hidden sm:inline">Add</span>
            </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-16 lg:pb-0">
          <div className="p-3 lg:p-4">
            {pathname === '/dashboard' ? (
              <DashboardContent onAddTransaction={() => setShowModal(true)} />
            ) : (
              children
            )}
          </div>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="flex items-center justify-around px-1.5 py-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 600 }}>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <CelebrationOverlay />
      <CoinFloater />
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}