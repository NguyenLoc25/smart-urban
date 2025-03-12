"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const [user, setUser] = useState(null);

  // Theo dõi trạng thái đăng nhập của Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); //   Cleanup listener
  }, []);

  return (
    <header className="bg-white text-[#5f6368] border-b-2 shadow-lg py-3 px-5 md:px-10 lg:px-20">
      <div className="flex items-center justify-between w-full">
        {/* Logo (Click để về trang chủ) */}
        <div className="flex items-center gap-8">
          <Link href="/" passHref>
            <h1 className="text-lg font-bold tracking-wide font-sans cursor-pointer hover:opacity-80 transition-all">
              Smart Urban
            </h1>
          </Link>
  
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex flex-wrap gap-5 justify-start">
              {[
                { href: "/home", text: "Home" },
                { href: "/garden", text: "Garden" },
                { href: "/energy", text: "Energy" },
                { href: "/waste", text: "Waste" }
              ].map(({ href, text }) => (
                <NavigationMenuItem key={href}>
                  <Link href={href} passHref>
                    <span className="menu-item font-bold text-lg text-[#5f6368] hover:text-black hover:scale-110 transition-all">
                      {text}
                    </span>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Account Section - Đẩy về bên phải */}
        <div className="ml-auto">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.photoURL || "/default-avatar.png"} />
                  <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-40">
                <DropdownMenuItem className="text-center font-medium text-gray-700">
                  {user.displayName || user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut(auth)}>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-200 transition-all">
                Đăng nhập
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden">
                <DropdownMenuItem>
                  <Link href="/login">
                    <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Đăng nhập với email</span>
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
  </header>

  );
};

export default Header;
