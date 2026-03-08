"use client";

import { useEffect } from "react";

interface SimpleConfettiProps {
  show: boolean;
  type?: "expense" | "income" | "milestone";
}

export function SimpleConfetti({ show, type = "expense" }: SimpleConfettiProps) {
  useEffect(() => {
    if (!show) return;

    const colors = type === "milestone" 
      ? ["#EC4899", "#F472B6", "#FBBF24", "#F59E0B", "#8B5CF6"]
      : type === "income"
      ? ["#F59E0B", "#FBBF24", "#10B981"]
      : ["#10B981", "#34D399"];

    const count = type === "milestone" ? 100 : type === "income" ? 50 : 30;

    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const endX = startX + (Math.random() - 0.5) * window.innerWidth * 1.5;
      const endY = window.innerHeight + 100;
      const rotation = Math.random() * 720;
      const duration = 2000 + Math.random() * 1000;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 2px;
        left: ${startX}px;
        top: ${startY}px;
        pointer-events: none;
      `;

      container.appendChild(particle);

      particle.animate([
        { 
          transform: `translate(0, 0) rotate(0deg)`,
          opacity: 1 
        },
        { 
          transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
          opacity: 0 
        }
      ], {
        duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    }

    const cleanup = setTimeout(() => {
      document.body.removeChild(container);
    }, 3500);

    return () => {
      clearTimeout(cleanup);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [show, type]);

  return null;
}
