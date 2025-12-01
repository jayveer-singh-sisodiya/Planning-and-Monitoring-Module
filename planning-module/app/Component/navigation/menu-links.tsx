"use client";

import Link from "next/link";
import {
  Home,
  Calendar,
  Shirt,
  Component,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { motion } from "framer-motion";

const menuItems = [
  { label: "Planning", href: "/", icon: Home },
  { label: "Dashboard", href: "/Component/Dashboard", icon: LayoutDashboard },
  { label: "Calendar", href: "/Component/Calender", icon: Calendar },
  { label: "Link", href: "/products", icon: Shirt },
  { label: "Link", href: "/team", icon: Component },
  { label: "Login", href: "/login", icon: LogIn },
  { label: "Logout", href: "/logout", icon: LogOut },
];

const MenuLinks = ({ isOpen }: { isOpen: boolean }) => {
  const pathname = usePathname();
  const linkVariants = {
    active: { backgroundColor: "#2463EB", color: "#fff", scale: 1.05 },
    inactive: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      color: "#fff",
      scale: 1,
    },
  };
  useEffect(() => {
    console.log("Sidebar isOpen changed:", isOpen);
  }, [isOpen]);
  return (
    <TooltipProvider>
      <ul
        className={`flex flex-col gap-10 ${
          !isOpen ? " py-35 max-md:hidden gap-10" : "block py-12"
        } `}
      >
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (pathname.includes(href) && href.length > 1) || pathname === href;

          return (
            <li key={href}>
              {isOpen ? (
                <Link href={href}>
                  <motion.div
                    className="flex gap-4 items-center py-1  rounded-md px-4"
                    animate={isActive ? "active" : "inactive"}
                    transition={{ duration: 0.3 }}
                    variants={linkVariants}
                  >
                    <Icon size={23} className="md-1" />
                    <span className="max-md:hidden">{label}</span>
                  </motion.div>
                </Link>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={href}>
                      <motion.div
                        className="flex gap-4 items-center py-1 rounded-md px-4"
                        animate={isActive ? "active" : "inactive"}
                        transition={{ duration: 0.3 }}
                        variants={linkVariants}
                      >
                        <Icon size={23} className="md-1" />
                      </motion.div>
                    </Link>
                  </TooltipTrigger>

                  <TooltipContent
                    side="right"
                    className="duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out"
                  >
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
};
export default MenuLinks;
