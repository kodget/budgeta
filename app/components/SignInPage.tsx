"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Wallet, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const displayFont: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const bodyFont: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };
const LIME = "#AAFF4D";

const STATS = [
  { val: "500K+", label: "Active users" },
  { val: "₦2.4B+", label: "Savings tracked" },
  { val: "4.9★", label: "App rating" },
];

const RECENT = [
  { emoji: "🍔", name: "McDonald's", cat: "Food", amount: "-₦2,400", color: "#F472B6" },
  { emoji: "💰", name: "Savings Transfer", cat: "Savings", amount: "+₦20,000", color: "#34D399" },
  { emoji: "🎬", name: "Netflix", cat: "Entertainment", amount: "-₦2,900", color: "#60A5FA" },
  { emoji: "🛒", name: "Shoprite", cat: "Groceries", amount: "-₦15,600", color: "#FBBF24" },
];

export function SignInPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    const authToken = localStorage.getItem("budgeta_auth_token");
    if (authToken === "authenticated") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("budgeta_users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Set current user
        localStorage.setItem("budgeta_current_user", JSON.stringify(user));
        localStorage.setItem("budgeta_auth_token", "authenticated");
        
        // Redirect based on whether onboarding is completed
        if (user.onboardingCompleted) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    // Removed for simplicity - keeping only email/password auth
  };

  return (
    <div className="min-h-screen flex" style={{ ...bodyFont, background: "#09090B" }}>

      {/* ── LEFT: Decorative Panel ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden p-10"
        style={{ background: "#0d0d10", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Glow */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${LIME}18, transparent)` }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: LIME }}>
            <Wallet className="w-4 h-4 text-black" />
          </div>
          <span className="text-white" style={{ ...displayFont, fontWeight: 700, fontSize: "1rem" }}>Budgeta</span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 mt-auto mb-auto pt-10">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: LIME, fontWeight: 600 }}>Welcome back</p>
          <h2 className="text-white mb-3"
            style={{ ...displayFont, fontWeight: 800, fontSize: "2rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Your money<br />missed you.
          </h2>
          <p className="text-white/35 max-w-xs" style={{ lineHeight: 1.7 }}>
            Sign back in and pick up right where you left off. Your budgets, goals, and insights are waiting.
          </p>
        </div>

        {/* Mini transaction feed */}
        <div className="relative z-10 mt-auto">
          <p className="text-white/25 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 600 }}>Recent activity</p>
          <div className="flex flex-col gap-1.5">
            {RECENT.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: "rgba(255,255,255,0.05)" }}>{t.emoji}</div>
                  <div>
                    <p className="text-white text-xs" style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="text-white/30 text-xs">{t.cat}</p>
                  </div>
                </div>
                <span className="text-xs" style={{ fontWeight: 700, color: t.amount.startsWith("+") ? "#34D399" : "rgba(255,255,255,0.6)" }}>
                  {t.amount}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="flex gap-3 mt-4">
            {STATS.map((s, i) => (
              <div key={i} className="flex-1 rounded-xl p-2.5 text-center border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-white" style={{ ...displayFont, fontWeight: 800, fontSize: "0.95rem" }}>{s.val}</p>
                <p className="text-white/30 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex flex-col px-5 py-8 lg:px-12 xl:px-16 overflow-y-auto justify-center">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors mb-8 self-start">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: LIME }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-white" style={{ ...displayFont, fontWeight: 700 }}>Budgeta</span>
          </div>

          <div className="mb-6">
            <h1 className="text-white" style={{ ...displayFont, fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
              Sign in
            </h1>
            <p className="text-white/35 text-sm mt-1">Good to have you back.</p>
          </div>

          {/* Social buttons - removed for simplicity */}
          {/* <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-white/60 hover:text-white hover:border-white/15 transition-all text-sm"
              style={{ background: "rgba(255,255,255,0.03)", fontWeight: 500 }}>
              Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-white/25 text-xs">or with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div> */}

          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm"
              style={{ background: "#ef444412" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Email</label>
              <input type="email" autoComplete="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 outline-none text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = LIME + "60"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-white/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Password</label>
                <a href="#" className="text-xs transition-colors hover:opacity-70" style={{ color: LIME }}>Forgot?</a>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-white/20 outline-none text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onFocus={e => e.target.style.borderColor = LIME + "60"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-black text-sm mt-2 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: LIME, fontWeight: 700 }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            No account?{" "}
            <Link href="/signup" className="hover:opacity-70 transition-opacity" style={{ color: LIME, fontWeight: 600 }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}