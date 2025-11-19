import React from "react";
import Logo from "./logo";
import MenuToggel from "./menu-toggel";
import {ModeToggle} from "./mode-toggel";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
  return (
    <nav className="py-4 border-b">
      <div className="md:w[95%] w-[97%] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Logo />
          <MenuToggel />
        </div>
        <div className="flex items-center gap-8">
          <ModeToggle/>
          <span className="max-md:hidden">Welcome back Admin</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
