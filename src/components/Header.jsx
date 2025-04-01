"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Menu, Settings } from "lucide-react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";

const Header = () => {
  const mobileMenuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  const navItems = [
    { href: "/home", text: "Home" },
    { href: "/garden", text: "Garden" },
    { href: "/energy", text: "Energy" },
    { href: "/waste", text: "Waste" }
  ];

  const settingItems = [
    { href: "/home", text: "Setting Home" },
    { href: "/garden", text: "Setting Garden" },
    { href: "/energy", text: "Setting Energy" },
    { href: "/waste", text: "Setting Waste" }
  ];

  
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" passHref>
              <h1 className="text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                Smart Urban
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map(({ href, text }) => (
                <Link key={href} href={href} passHref>
                  <span className="text-lg font-bold hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer hover:scale-110 transition-all">
                  {text}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right-side controls */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User controls */}
            {user ? (
              <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photoURL || "/default-avatar.png"} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                        <span>Settings</span>
                        <Settings className="w-4 h-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 ml-2">
                      {settingItems.map(({ href, text }) => (
                        <DropdownMenuItem
                          key={href}
                          onClick={() => router.push(href)}
                          className="text-sm cursor-pointer"
                        >
                          {text}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenuItem
                    onClick={() => signOut(auth)}
                    className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 bg-primary dark:bg-primary-dark text-white font-medium rounded-md hover:bg-primary-dark dark:hover:bg-primary transition-colors">
                    Sign In
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2">
                  <DropdownMenuItem>
                    <Link href="/login" passHref>
                      <span className="block w-full px-2 py-1.5 text-sm cursor-pointer">
                        Sign in with Email
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LoginButton className="w-full" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-3 space-y-2">
            {navItems.map(({ href, text }) => (
              <Link key={href} href={href} passHref>
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;