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
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/community", label: "Community" },
  { href: "/docs", label: "Research" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Eye className="h-8 w-8 text-accent transition-all group-hover:text-accent-2" />
              <div className="absolute inset-0 animate-pulse-ring rounded-full border border-accent/30" />
            </div>
            <span className="text-xl font-bold gradient-text">Eye-Guard</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-foreground hover:bg-card"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-accent text-background hover:bg-accent/90 transition-colors"
            >
              Dashboard
            </Link>
            {!isSignedIn ? (
              <>
                <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium border border-card-border text-foreground hover:bg-card transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium bg-accent text-background hover:bg-accent/90 transition-colors">
                    Sign up
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
              className="md:hidden p-2 text-muted hover:text-foreground"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-card-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {!isSignedIn ? (
              <div className="flex items-center gap-2 pb-2">
                <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="flex-1 rounded-lg border border-card-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <button className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-background hover:bg-accent/90 transition-colors">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            ) : null}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-foreground hover:bg-card"
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
