"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Wallet, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const displayFont: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const bodyFont: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };
const EMERALD = "#10B981";

const PW_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

const PERKS = [
  { emoji: "⚡", label: "Auto-categorizes every transaction" },
  { emoji: "🔔", label: "Smart bill & overspend alerts" },
  { emoji: "🎯", label: "Savings goals with progress tracking" },
  { emoji: "🔒", label: "Bank-level encryption, always" },
];

export function SignUpPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const strength = PW_RULES.filter(r => r.test(form.password)).length;
  const strengthColors = ["#ef4444", "#f59e0b", EMERALD];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (strength < 2) { setError("Please use a stronger password."); return; }
    if (!agreed) { setError("Please accept the Terms of Service to continue."); return; }
    
    setLoading(true);
    
    setTimeout(() => {
      // Save user to localStorage
      const users = JSON.parse(localStorage.getItem("budgeta_users") || "[]");
      const firstName = form.fullName.split(" ")[0]; // Extract first name for personalization
      const newUser = {
        id: Date.now().toString(),
        fullName: form.fullName,
        firstName,
        email: form.email,
        password: form.password,
        isFirstTime: true,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("budgeta_users", JSON.stringify(users));
      localStorage.setItem("budgeta_current_user", JSON.stringify(newUser));
      localStorage.setItem("budgeta_auth_token", "authenticated");
      
      setLoading(false);
      setSuccess(true);
      
      // Redirect to onboarding after success animation
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    }, 1600);
  };

  const handleGoogleSignUp = () => {
    // Removed for simplicity - keeping only email/password auth
  };

  /* ── Success State ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ ...bodyFont, background: "#09090B" }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: `${EMERALD}18`, border: `2px solid ${EMERALD}40` }}>
            <Check className="w-8 h-8" style={{ color: EMERALD }} />
          </div>
          <h1 className="text-white mb-2" style={{ ...displayFont, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
            You're in, {form.fullName.split(" ")[0]}! 🎉
          </h1>
          <p className="text-white/35 text-sm mb-6" style={{ lineHeight: 1.7 }}>
            Let's get you set up with your first budget and start tracking your naira!
          </p>
          <div className="w-8 h-8 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ ...bodyFont, background: "#09090B" }}>

      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex flex-col px-5 py-8 lg:px-12 xl:px-16 overflow-y-auto justify-center">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors mb-8 self-start">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: EMERALD }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-white" style={{ ...displayFont, fontWeight: 700 }}>Budgeta</span>
          </div>

          <div className="mb-6">
            <h1 className="text-white" style={{ ...displayFont, fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
              Create account
            </h1>
            <p className="text-white/35 text-sm mt-1">Free forever. No credit card needed.</p>
          </div>

          {/* Social buttons - removed for simplicity */}
          {/* <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={handleGoogleSignUp}
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
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-4 px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm"
                style={{ background: "#ef444412" }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Full Name</label>
              <input type="text" placeholder="Alex Kim" value={form.fullName} onChange={update("fullName")}
                className="w-full rounded-xl px-3 py-2 text-white placeholder-white/20 outline-none text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Space Grotesk', sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#10B981" + "60"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Email</label>
              <input type="email" autoComplete="email" placeholder="you@example.com"
                value={form.email} onChange={update("email")}
                className="w-full rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 outline-none text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Space Grotesk', sans-serif" }}
                onFocus={e => e.target.style.borderColor = EMERALD + "60"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password"
                  value={form.password} onChange={update("password")}
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-white/20 outline-none text-sm transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Space Grotesk', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = EMERALD + "60"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              <AnimatePresence>
                {form.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="flex-1 h-1 rounded-full"
                          style={{ background: i < strength ? strengthColors[strength - 1] : "rgba(255,255,255,0.08)" }}
                          animate={{ background: i < strength ? strengthColors[strength - 1] : "rgba(255,255,255,0.08)" }}
                          transition={{ duration: 0.3 }} />
                      ))}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      {PW_RULES.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                            style={{ background: r.test(form.password) ? `${EMERALD}20` : "rgba(255,255,255,0.05)", border: `1px solid ${r.test(form.password) ? EMERALD + "60" : "rgba(255,255,255,0.08)"}` }}>
                            {r.test(form.password) && <Check className="w-2 h-2" style={{ color: EMERALD }} />}
                          </div>
                          <span className="text-xs transition-colors"
                            style={{ color: r.test(form.password) ? EMERALD : "rgba(255,255,255,0.25)" }}>
                            {r.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 mt-1">
              <button type="button" onClick={() => setAgreed(!agreed)}
                className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  background: agreed ? EMERALD : "rgba(255,255,255,0.05)",
                  border: `1px solid ${agreed ? EMERALD : "rgba(255,255,255,0.12)"}`,
                }}>
                {agreed && <Check className="w-2.5 h-2.5 text-black" />}
              </button>
              <span className="text-white/35 text-sm" style={{ lineHeight: 1.6 }}>
                I agree to the{" "}
                <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: EMERALD }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: EMERALD }}>Privacy Policy</a>
              </span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-black text-sm mt-1 flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: EMERALD, fontWeight: 700 }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><span>Create Free Account</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="hover:opacity-70 transition-opacity" style={{ color: EMERALD, fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Decorative Panel ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden p-10"
        style={{ background: "#0d0d10", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${EMERALD}18, transparent)` }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: EMERALD }}>
            <Wallet className="w-4 h-4 text-black" />
          </div>
          <span className="text-white" style={{ ...displayFont, fontWeight: 700, fontSize: "1rem" }}>Budgeta</span>
        </Link>

        {/* Copy */}
        <div className="relative z-10 my-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: EMERALD, fontWeight: 600 }}>Why Budgeta?</p>
          <h2 className="text-white mb-5"
            style={{ ...displayFont, fontWeight: 800, fontSize: "2rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Your wealth-building<br />journey starts here.
          </h2>
          <div className="flex flex-col gap-2.5">
            {PERKS.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-lg flex-shrink-0">{p.emoji}</span>
                <span className="text-white/65 text-sm">{p.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 mt-auto rounded-2xl p-5 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-white/60 text-sm mb-3" style={{ lineHeight: 1.7 }}>
            "I went from living paycheck to paycheck to having a 6-month emergency fund — in 11 months."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs"
              style={{ background: EMERALD, fontWeight: 700 }}>AL</div>
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 600 }}>Alex L.</p>
              <p className="text-white/30 text-xs">Budgeta user since 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}