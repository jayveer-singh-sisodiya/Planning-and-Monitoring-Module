"use client";
import Logo1 from "@/public/Logo1-removebg-preview.png";
import { useMenuStore } from "@/store/toggel-menu";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  const { isOpen } = useMenuStore();
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <Image src={Logo1} style={{ height: "40px", width: "auto" }} alt="Logo" />
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.h1
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-semibold max-md:hidden whitespace-nowrap"
          >
            Planning Module
          </motion.h1>
        )}
      </AnimatePresence>
    </Link>
  );
}
