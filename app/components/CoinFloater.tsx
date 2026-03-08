"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearPendingCoin } from "../store/gamificationSlice";

export function CoinFloater() {
  const dispatch = useAppDispatch();
  const pendingCoinReward = useAppSelector(state => state.gamification.pendingCoinReward);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pendingCoinReward) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        dispatch(clearPendingCoin());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pendingCoinReward, dispatch]);

  return (
    <AnimatePresence>
      {show && pendingCoinReward && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -100, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="fixed bottom-20 right-8 z-50 pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)" }}
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-2xl"
            >
              🪙
            </motion.span>
            <span className="text-white font-bold">+{pendingCoinReward}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
