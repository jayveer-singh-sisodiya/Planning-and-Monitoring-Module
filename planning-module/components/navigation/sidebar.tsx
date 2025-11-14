"use client";
import { useMenuStore } from "@/store/toggel-menu";
import { motion } from "framer-motion";
import React from "react";
import MenuLinks from "./menu-links";

export default function Sidebar() {
  const { isOpen } = useMenuStore();

  return (
    <motion.div
      initial={{ width: isOpen ? 80 : 250 }}
      animate={{ width: isOpen ? 80 : 250 }}
      transition={{ duration: 0.3 }}
      className={`sticky z-10 top-0 flex flex-col h-screen items-center overflow-hidden border-r ${
        !isOpen ? "py-12 gap-10" : "py-4"
      }`}
    >
      {/* Title only visible when expanded */}
      <h2 className={`text-sm ${isOpen && "hidden"}`}>Main Menu</h2>

      {/* Menu links */}
      <MenuLinks isOpen={!isOpen} />

    </motion.div>
  );
}

