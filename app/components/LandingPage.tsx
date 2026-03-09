"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Wallet, TrendingUp, ShieldCheck, Bell, Target, BarChart3,
  Zap, ChevronRight, Star, Menu, X, ArrowUpRight, Sparkles, BadgeCheck,
  CreditCard, PiggyBank, MoveUpRight, PieChart,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS - Unified theme with main app
═══════════════════════════════════════════════════════════════════════════════ */
const displayFont: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const bodyFont: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };
const EMERALD = "#10B981"; // Primary emerald color matching app theme
const DARK_BG = "#0F172A"; // Dark slate background matching app
const CARD_BG = "#1E293B"; // Card background matching app

/* ── Images ── */
const IMG_WOMAN = "https://images.unsplash.com/photo-1762331975749-9ed4e98a3734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwY29uZmlkZW50JTIwY2l0eSUyMG1vZGVybnxlbnwxfHx8fDE3NzMwNTQ0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_MAN = "https://images.unsplash.com/photo-1758525588523-7b7fe92143ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbiUyMGVudHJlcHJlbmV1ciUyMHBob25lJTIwc21pbGluZyUyMHVyYmFufGVufDF8fHx8MTc3MzA1NDQxM3ww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_LAPTOP = "https://images.unsplash.com/photo-1765648496243-46d14c502ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhcHRvcCUyMGNvZmZlZSUyMHNob3AlMjB3b3JraW5nJTIwZm9jdXNlZHxlbnwxfHx8fDE3NzMwNTQ0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ═══════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════ */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = to / (2000 / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════
   MARQUEE
═══════════════════════════════ */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xl" style={{ color: "#10B981" }}>✦</span>
            <span className="text-white/50 text-xs tracking-widest uppercase" style={bodyFont}>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════
   DONUT CHART (SVG)
═══════════════════════════════ */
function DonutChart({ segments }: { segments: { pct: number; color: string }[] }) {
  const r = 40, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e22" strokeWidth="18" />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const rotate = (offset / 100) * 360 - 90;
        offset += seg.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
            strokeWidth="18" strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${cx} ${cy})`} strokeLinecap="butt" />
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════
   BAR SPARKLINE
═══════════════════════════════ */
function BarSpark({ bars }: { bars: number[] }) {
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-1.5 h-12">
      {bars.map((v, i) => (
        <motion.div key={i} className="flex-1 rounded-sm"
          style={{ background: i === bars.length - 1 ? "#10B981" : "#2a2a30" }}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════
   FLOATING NOTIFICATION CARD
═══════════════════════════════ */
function FloatCard({ emoji, title, amount, sub, delay, style }: {
  emoji: string; title: string; amount: string; sub: string;
  delay: number; style: React.CSSProperties;
}) {
  return (
    <motion.div
      className="absolute flex items-center gap-3 shadow-2xl z-20"
      style={{
        background: "rgba(20,20,22,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "10px 14px",
        backdropFilter: "blur(20px)",
        ...bodyFont, ...style,
      }}
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)" }}>{emoji}</div>
      <div>
        <p className="text-white text-xs" style={{ fontWeight: 600 }}>{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span style={{ color: "#10B981", fontWeight: 700, fontSize: "0.8rem" }}>{amount}</span>
          <span className="text-white/30 text-xs">{sub}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   STEP CARD
═══════════════════════════════ */
function StepCard({ n, title, desc, icon: Icon, color, index }: {
  n: string; title: string; desc: string;
  icon: React.ElementType; color: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="bg-[#111113] border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-white/10 transition-colors">
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/8"
          style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {index < 2 && <div style={{ width: 1, minHeight: 20, background: "rgba(255,255,255,0.05)" }} />}
      </div>
      <div className="pt-1">
        <span className="text-xs tracking-widest uppercase" style={{ color, fontWeight: 600 }}>{n}</span>
        <h3 className="text-white mt-1" style={{ ...displayFont, fontWeight: 700, fontSize: "0.95rem" }}>{title}</h3>
        <p className="text-white/40 text-sm mt-2" style={{ lineHeight: 1.6 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   DATA
═══════════════════════════════ */
const marqueItems = [
  "Transaction Logging", "Category Management", "Budget Tracking", "Visual Dashboard",
  "Gamification", "Spending Insights", "Progress Tracking", "Naira Support",
];

const spendCategories = [
  { name: "Housing", pct: 33, color: "#10B981", icon: "🏠" },
  { name: "Food & Dining", pct: 22, color: "#60A5FA", icon: "🍕" },
  { name: "Transport", pct: 15, color: "#F59E0B", icon: "🚗" },
  { name: "Entertainment", pct: 12, color: "#F472B6", icon: "🎮" },
  { name: "Savings", pct: 18, color: "#34D399", icon: "💰" },
];

const testimonials = [
  {
    name: "Amara D.", role: "Creative Director", img: IMG_WOMAN,
    quote: "I tried every budgeting app. Budgeta is the only one that didn't feel like homework. Saved $12K in 8 months.", rating: 5, handle: "@amara.d",
  },
  {
    name: "Kweku S.", role: "Software Engineer", img: IMG_MAN,
    quote: "The auto-categorization is borderline magic. My savings rate went from 8% to 34% in one year. Insane ROI.", rating: 5, handle: "@kwekus",
  },
  {
    name: "Priya N.", role: "Startup Founder", img: IMG_LAPTOP,
    quote: "Finally an app that treats money as emotional, not just numerical. The goals feature literally made me cry.", rating: 5, handle: "@priya.builds",
  },
];

const plans = [
  {
    name: "Starter", price: "Free", sub: "forever", cta: "Get Started",
    features: ["2 connected accounts", "3 savings goals", "Monthly reports", "Email support"],
    hot: false,
  },
  {
    name: "Pro", price: "$9", sub: "/month", cta: "Start 14-day Trial",
    features: ["Unlimited accounts", "Unlimited goals", "Real-time alerts", "Debt payoff planner", "Priority support", "API access"],
    hot: true,
  },
  {
    name: "Family", price: "$19", sub: "/month", cta: "Start 14-day Trial",
    features: ["Everything in Pro", "Up to 5 members", "Shared budgets", "Bill splitting", "Dedicated support"],
    hot: false,
  },
];

const steps = [
  { n: "01", title: "Connect your accounts", desc: "Link your bank accounts, cards, and investments in seconds. We support 10,000+ financial institutions with read-only access.", icon: CreditCard, color: "#10B981" },
  { n: "02", title: "Set your budget", desc: "Tell Budgeta what matters. We'll suggest smart limits based on your income and goals — or fully customize every category.", icon: Target, color: "#60A5FA" },
  { n: "03", title: "Watch the magic happen", desc: "Transactions auto-categorize. Alerts fire before you overspend. Your net worth climbs. Your future self will thank you.", icon: Sparkles, color: "#F472B6" },
];

/* ═══════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════ */
export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(1);
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    const authToken = localStorage.getItem("budgeta_auth_token");
    if (authToken === "authenticated") {
      router.push("/dashboard");
    }
  }, [router]);

  const heroRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const bentoInView = useInView(bentoRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-[#0F172A] text-white min-h-screen overflow-x-hidden" style={bodyFont}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
        style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#10B981" }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <span style={{ ...displayFont, fontWeight: 700, fontSize: "1rem" }}>Budgeta</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Pricing", "#pricing"], ["Reviews", "#reviews"]].map(([label, href]) => (
              <a key={label} href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin" className="text-white/50 hover:text-white text-sm px-3 py-2 transition-colors">Sign in</Link>
            <Link href="/signup"
              className="text-black text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ background: "#10B981", fontWeight: 700 }}>
              Get Started Free
            </Link>
          </div>

          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5 bg-[#09090B] px-4 pb-5">
              <div className="flex flex-col gap-3 pt-4">
                {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Pricing", "#pricing"], ["Reviews", "#reviews"]].map(([label, href]) => (
                  <a key={label} href={href} className="text-white/50 text-sm" onClick={() => setMenuOpen(false)}>{label}</a>
                ))}
                <hr className="border-white/5" />
                <Link href="/signin" className="text-white/50 text-sm">Sign in</Link>
                <Link href="/signup" className="text-black text-sm px-4 py-2.5 rounded-xl text-center"
                  style={{ background: "#10B981", fontWeight: 700 }}>Get Started Free</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #10B98122, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f122, transparent 70%)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-20">

          {/* Pill badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/8 rounded-full px-3 py-1.5 mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
            <span className="text-white/60 text-xs tracking-widest uppercase" style={bodyFont}>Live · 500,000 users worldwide</span>
          </motion.div>

          {/* Giant headline */}
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              style={{ ...displayFont, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
              <span className="text-white">Budget.</span><br />
              <span className="text-white">Save.</span>{" "}
              <span style={{ WebkitTextStroke: "2px #10B981", color: "transparent" }}>Win.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="text-white/45 mt-5 max-w-lg"
              style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
              The brutally honest budgeting app that tells you the truth about your spending — so you can build the life you actually want.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/signup"
                className="group inline-flex items-center justify-center gap-2 text-black px-6 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#10B981", fontWeight: 700, fontSize: "0.9rem" }}>
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 text-white/60 hover:text-white px-6 py-3 rounded-xl transition-all"
                style={{ fontWeight: 500 }}>
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Floating cards — desktop */}
          <div className="hidden lg:block">
            <FloatCard emoji="🍔" title="McDonald's" amount="-₦2,400" sub="Food & Drink" delay={0.9}
              style={{ right: "22%", top: "5%" }} />
            <FloatCard emoji="💰" title="Budget Progress" amount="₦45,000" sub="₦50,000 left" delay={1.15}
              style={{ right: "8%", top: "38%" }} />
            <FloatCard emoji="🎯" title="Streak Reward" amount="+50 coins" sub="7 days tracked" delay={1.35}
              style={{ right: "25%", bottom: "18%" }} />
            <FloatCard emoji="📊" title="This Month" amount="₦85,000" sub="Spent so far" delay={1.55}
              style={{ right: "5%", bottom: "28%" }} />
          </div>

          {/* Hero stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-16 pt-6 border-t border-white/5 flex flex-wrap gap-8">
            {[
              { to: 50000, pre: "", suf: "+", label: "Active users" },
              { to: 240000000, pre: "₦", suf: "+", label: "Money tracked" },
              { to: 95, pre: "", suf: "%", label: "Users stay active" },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ ...displayFont, fontWeight: 800, fontSize: "1.6rem", color: "#10B981" }}>
                  <Counter to={s.to} prefix={s.pre} suffix={s.suf} />
                </p>
                <p className="text-white/35 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Rest of the component continues with similar size reductions... */}
      {/* I'll continue with the remaining sections in the next part */}
      
      {/* ── MARQUEE STRIP ── */}
      <div className="border-y border-white/5 py-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <Marquee items={marqueItems} />
      </div>

      {/* ══════════════════════════════
          BENTO GRID
      ══════════════════════════════ */}
      <section id="features" ref={bentoRef} className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={bentoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#10B981", fontWeight: 600 }}>Features</p>
          <h2 style={{ ...displayFont, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Everything your wallet<br />has been waiting for.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ gridAutoRows: "160px" }}>

          {/* ① Spending breakdown — 2×2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={bentoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="col-span-2 row-span-2 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
            style={{ background: "#111113" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle at top left, #10B98108, transparent 60%)" }} />
            <div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: "#10B98115" }}>
                <PieChart className="w-4 h-4" style={{ color: "#10B981" }} />
              </div>
              <h3 style={{ ...displayFont, fontWeight: 700, fontSize: "1rem" }}>Spending Breakdown</h3>
              <p className="text-white/35 text-xs mt-1">See exactly where every naira goes.</p>
            </div>
            <div className="flex gap-3 items-center mt-auto">
              <div className="w-20 h-20 flex-shrink-0">
                <DonutChart segments={spendCategories.map(c => ({ pct: c.pct, color: c.color }))} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                {spendCategories.slice(0, 4).map((c) => (
                  <div key={c.name} className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-white/50 text-xs truncate">{c.name}</span>
                    </div>
                    <span className="text-white text-xs ml-2 flex-shrink-0" style={{ fontWeight: 600 }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Budget Tracking */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={bentoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
            style={{ background: "#111113" }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#10B98118" }}>
              <Target className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            </div>
            <div>
              <h3 style={{ ...displayFont, fontWeight: 700, fontSize: "0.85rem" }}>Budget Tracking</h3>
              <p className="text-white/35 text-xs mt-1 mb-2">Set limits, track progress</p>
              <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                <div className="h-2 rounded-full" style={{ background: "#10B981", width: "65%" }} />
              </div>
            </div>
          </motion.div>

          {/* Gamification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={bentoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
            style={{ background: "#111113" }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "#F59E0B18" }}>
              <Star className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h3 style={{ ...displayFont, fontWeight: 700, fontSize: "0.85rem" }}>Earn Rewards</h3>
              <p className="text-white/35 text-xs mt-1 mb-2">Coins for tracking habits</p>
              <div className="flex items-center gap-1">
                <span className="text-lg">🪙</span>
                <span className="text-white text-xs" style={{ fontWeight: 600 }}>+25 coins</span>
              </div>
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={bentoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="col-span-2 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
            style={{ background: "#111113" }}>
            <div>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-3" style={{ background: "#60A5FA18" }}>
                <BarChart3 className="w-3.5 h-3.5" style={{ color: "#60A5FA" }} />
              </div>
              <h3 style={{ ...displayFont, fontWeight: 700, fontSize: "0.85rem" }}>Transaction History</h3>
              <p className="text-white/35 text-xs mt-1">Search and filter all transactions</p>
            </div>
            <div className="mt-3">
              <BarSpark bars={[45, 52, 38, 61, 42, 55, 48]} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          FINAL CTA
      ══════════════════════════════ */}
      <section className="py-16 md:py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #10B98122, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

        <motion.div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }}>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#10B981", fontWeight: 600 }}>Start Today</p>
          <h2 className="text-white mb-5"
            style={{ ...displayFont, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1.0, letterSpacing: "-0.03em" }}>
            Your best financial<br />year starts now.
          </h2>
          <p className="text-white/35 mb-8 max-w-md mx-auto" style={{ lineHeight: 1.8 }}>
            Join thousands of Nigerian students who stopped wondering where their money went — and started tracking every naira.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup"
              className="group inline-flex items-center justify-center gap-2 text-black px-8 py-3 rounded-xl transition-all hover:opacity-90"
              style={{ background: "#10B981", fontWeight: 700, fontSize: "0.9rem" }}>
              Get Started — It's Free
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}