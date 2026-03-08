"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positions[position]} z-50 pointer-events-none`}
          >
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm">
              {content}
              <div
                className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                  position === "top"
                    ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                    : position === "bottom"
                    ? "top-[-4px] left-1/2 -translate-x-1/2"
                    : position === "left"
                    ? "right-[-4px] top-1/2 -translate-y-1/2"
                    : "left-[-4px] top-1/2 -translate-y-1/2"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
