"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Synchronize state with the HTML class
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "Light" : "dark");

  return (
    <>
      <header className="bg-background border-2 border-theme flex flex-col sm:flex-row sm:justify-between  sm:items-stretch sticky top-0 sm:static z-20">
        <div className="logo pr-6 sm:pl-44 sm:pt-2 italic border sm:border-0 w-full sm:w-auto text-center sm:order-2">
          Aliauf
        </div>

        <div className="flex justify-between w-full sm:w-auto border sm:order-1">
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden border-r-2 p-1"
          >
            toggle
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1 px-4 sm:p-2 border-l-2 sm:border-l-0 bg-background text-foreground cursor-pointer
            hover:bg-blue-300 dark:hover:bg-blue-900"
          >
            {theme === "dark" ? "Light ☀️" : "Dark 🌙"}
          </button>
        </div>

        <nav
          className={`flex flex-col ${
            open ? "flex" : "hidden"
          } sm:flex sm:flex-row sm:justify-around sm:gap-6 sm:order-3`}
        >
          <Link
            className="hover:bg-blue-300 dark:hover:bg-blue-900 p-2 border w-full text-center sm:w-auto"
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:bg-blue-300 dark:hover:bg-blue-900 p-2 border w-full text-center sm:w-auto"
            href="#"
          >
            About
          </Link>
          <Link
            className="hover:bg-blue-300 dark:hover:bg-blue-900 p-2 border w-full text-center sm:w-auto"
            href="#"
          >
            Contact Us
          </Link>
        </nav>
      </header>
    </>
  );
};

export default Header;
