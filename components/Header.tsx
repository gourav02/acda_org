"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering session-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get user initials from username or email
  const getUserInitials = (name: string | null | undefined): string => {
    if (!name) return "U";

    // Check if it's an email
    if (name.includes("@")) {
      const emailPrefix = name.split("@")[0];
      return emailPrefix.substring(0, 2).toUpperCase();
    }

    // Check if it has spaces (full name)
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // Single word (username)
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "ACDACON", href: "/acdacon" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Membership", href: "/membership" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-700 bg-primary">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center space-x-4">
            <img
              src={"/logos/logo.jpg"}
              className="h-full w-full md:h-[60px] md:w-[64px]"
              alt={"acda_logo"}
            />
            <span className="text-xl font-bold text-white">
              Asansol Coalfield Diabetes Association
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-white hover:bg-primary-700 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-white transition-colors hover:text-accent"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button / User Menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!mounted ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-accent/20" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                    {getUserInitials(session.user?.name)}
                  </div>
                  <span className="hidden text-white xl:inline">{session.user?.name}</span>
                  <ChevronDown className="h-4 w-4" color="white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">Admin Account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="flex cursor-pointer items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin/login">
              <Button className="bg-accent text-primary hover:bg-accent/90">Sign In</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="bg-primary-800 lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700 hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              {!mounted ? (
                <div className="h-10 w-full animate-pulse rounded bg-accent/20" />
              ) : session ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-md bg-primary-700 px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                      {getUserInitials(session.user?.name)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{session.user?.name}</p>
                      <p className="text-xs text-gray-300">Admin Account</p>
                    </div>
                  </div>
                  <Link href="/admin/dashboard" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-white text-primary hover:bg-primary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-red-400 text-red-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/admin/login" className="block">
                  <Button className="w-full bg-accent text-white hover:bg-accent/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
