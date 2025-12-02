"use client";

import { motion } from "framer-motion";

export default function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-[4px] overflow-hidden bg-transparent z-50">
      
      {/* Glow / Shadow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-900/20 blur-md"></div>

      {/* Main Animated Bar */}
      <motion.div
        className="h-full rounded-sm"
        style={{
          background:
            "linear-gradient(90deg, #3b82f6 0%, #1e40af 50%, #3b82f6 100%)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Shimmer overlay */}
      <motion.div
        className="absolute top-0 h-full w-1/4 bg-white/40 blur-sm rounded-sm"
        animate={{
          x: ["-50%", "150%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
