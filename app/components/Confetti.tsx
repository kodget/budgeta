"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  trigger: boolean;
  type?: "expense" | "income" | "weekly" | "monthly" | "milestone" | "streak";
  onComplete?: () => void;
}

const CONFETTI_CONFIGS = {
  expense: { colors: ["#10B981", "#34D399", "#6EE7B7"], count: 30 },
  income: { colors: ["#F59E0B", "#FBBF24", "#FCD34D", "#10B981"], count: 50 },
  weekly: { colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#10B981"], count: 60 },
  monthly: { colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#F59E0B", "#FBBF24"], count: 80 },
  milestone: { colors: ["#EC4899", "#F472B6", "#FBBF24", "#F59E0B", "#8B5CF6"], count: 100 },
  streak: { colors: ["#F97316", "#FB923C", "#FDBA74", "#EF4444"], count: 70 },
};

export function Confetti({ trigger, type = "expense", onComplete }: ConfettiProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  const config = CONFETTI_CONFIGS[type];
  const particles = Array.from({ length: config.count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: -Math.random() * 100 - 100,
    color: config.colors[Math.floor(Math.random() * config.colors.length)],
    rotation: Math.random() * 720,
    size: Math.random() * 6 + 6,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
            y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0, 
            opacity: 1, 
            scale: 1, 
            rotate: 0 
          }}
          animate={{
            x: (typeof window !== 'undefined' ? window.innerWidth / 2 : 0) + p.x,
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.3],
            rotate: p.rotation,
          }}
          transition={{ 
            duration: 2.5, 
            delay: p.delay,
            ease: "easeOut" 
          }}
          className="absolute"
          style={{ 
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}
