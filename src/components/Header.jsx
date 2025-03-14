"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";

const Header = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href) => {
    router.push(href);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b-2 shadow-lg py-3 px-5 md:px-10 lg:px-20">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-5 md:gap-8">
          <Link href="/" passHref>
            <h1 className="text-lg font-bold tracking-wide cursor-pointer hover:opacity-80 transition-all">Smart Urban</h1>
          </Link>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-wrap gap-5 justify-start">
                {[{ href: "/home", text: "Home" }, { href: "/garden", text: "Garden" }, { href: "/energy", text: "Energy" }, { href: "/waste", text: "Waste" }].map(({ href, text }) => (
                  <NavigationMenuItem key={href}>
                    <Link href={href} passHref>
                      <span className="cursor-pointer menu-item font-bold text-lg hover:text-black dark:hover:text-white hover:scale-110 transition-all">{text}</span>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </button>
          <button className="block md:hidden p-2" onClick={toggleMenu}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.photoURL || "/default-avatar.png"} />
                  <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-40">
                <DropdownMenuItem className="text-center font-medium">{user.displayName || user.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut(auth)}>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Đăng nhập
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
                <DropdownMenuItem>
                  <Link href="/login">
                    <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Đăng nhập với email</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LoginButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md absolute top-16 left-0 w-full py-4 z-50">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-4 items-center">
              {[{ href: "/home", text: "Home" }, { href: "/garden", text: "Garden" }, { href: "/energy", text: "Energy" }, { href: "/waste", text: "Waste" }].map(({ href, text }) => (
                <NavigationMenuItem key={href}>
                  <Link href={href} passHref>
                    <span className="cursor-pointer font-bold text-lg hover:underline">{text}</span>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
