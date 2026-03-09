"use client";

import { motion } from "framer-motion";

const LIME = "#AAFF4D";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-white/20 border-t-white rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090B" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 rounded-full mx-auto mb-4"
             style={{ borderTopColor: LIME }}>
          <motion.div
            className="w-full h-full rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}