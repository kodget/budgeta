"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { dismissCelebration } from "../store/gamificationSlice";
import { SimpleConfetti } from "./SimpleConfetti";

export function CelebrationOverlay() {
  const dispatch = useAppDispatch();
  const celebration = useAppSelector(state => state.gamification.celebration);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (celebration) {
      setShowConfetti(true);
    }
  }, [celebration]);

  const handleDismiss = () => {
    dispatch(dismissCelebration());
    setShowConfetti(false);
  };

  if (!celebration) return null;

  const confettiType = celebration.type === "milestone" ? "milestone" : "income";

  return (
    <>
      <SimpleConfetti show={showConfetti} type={confettiType} />
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: 400, opacity: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: "1.5rem",
                }}
              >
                {["🎉", "✨", "🎊", "⭐", "💫"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            {celebration.type === "milestone" ? celebration.milestone?.icon : "🎉"}
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{celebration.title}</h2>
          <p className="text-gray-600 mb-1">{celebration.message}</p>
          {celebration.subMessage && (
            <p className="text-sm text-gray-500 mb-4">{celebration.subMessage}</p>
          )}

          {celebration.coinsEarned > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6"
              style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)" }}
            >
              <span className="text-2xl">🪙</span>
              <span className="text-white font-bold text-lg">+{celebration.coinsEarned} coins</span>
            </motion.div>
          )}

          <button
            onClick={handleDismiss}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Awesome! 🎉
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}
