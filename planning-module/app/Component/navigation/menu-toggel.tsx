"use client";
import { motion } from "framer-motion";
import { useMenuStore } from "../../../store/toggel-menu";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function MenuToggel() {
  const { isOpen, ToggelMenu } = useMenuStore();
  return (
    <button onClick={ToggelMenu}>
      <motion.div
        animate={{ rotate: isOpen ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isOpen ? (
          <ChevronsLeft color="blue" />
        ) : (
          <ChevronsRight color="royalblue" />
        )}
      </motion.div>
    </button>
  );
}
