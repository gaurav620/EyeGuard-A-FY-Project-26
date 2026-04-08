"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import { Eye, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/docs", label: "Research Methods" },
  { href: "/community", label: "Patient Community" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Eye className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-teal-700">EyeGuard Clinical</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/"
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Home
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Dashboard
              </Link>
            ) : null}
            {!isSignedIn ? (
              <>
                <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
                    Portal Login
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
                    Begin Enrollment
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {!isSignedIn ? (
              <div className="flex items-center gap-2 pb-2">
                <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Portal Login
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                    Enroll
                  </button>
                </SignUpButton>
              </div>
            ) : null}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/"
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Home
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
