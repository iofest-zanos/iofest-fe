"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/issues", label: "Isu" },
  { href: "/forum", label: "Forum" },
  { href: "/hukum", label: "Hukum" },
  { href: "/news", label: "Berita" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const showGov = user?.tier === "PEJABAT";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || !isLanding
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-fraunces text-[1.35rem] font-bold text-foreground leading-none">
            Suara<span className="text-primary">Kita</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm px-4 py-2 rounded-lg transition-colors",
                pathname.startsWith(link.href)
                  ? "text-foreground font-medium bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {link.label}
            </Link>
          ))}
          {showGov && (
            <Link
              href="/gov"
              className={cn(
                "text-sm px-4 py-2 rounded-lg transition-colors",
                pathname.startsWith("/gov")
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              Dasbor
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="w-20 h-7 rounded-md bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                  {user.avatar_initial}
                </div>
                <div className="text-xs leading-tight hidden md:block">
                  <p className="font-medium text-foreground">{user.name || user.email}</p>
                  <p className="text-[0.6rem] text-muted-foreground tracking-wider">{user.tier}</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1.5"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-sm px-4 py-3 rounded-lg transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-foreground font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {link.label}
              </Link>
            ))}
            {showGov && (
              <Link
                href="/gov"
                className={cn(
                  "block text-sm px-4 py-3 rounded-lg transition-colors",
                  pathname.startsWith("/gov")
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                Dasbor
              </Link>
            )}
          </div>
          <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-border">
            {loading ? (
              <div className="w-20 h-7 rounded-md bg-muted animate-pulse" />
            ) : user ? (
              <div>
                <Link href="/profile" className="flex items-center gap-2 text-sm mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
                    {user.avatar_initial}
                  </div>
                  <div className="text-xs leading-tight">
                    <p className="font-medium text-foreground">{user.name || user.email}</p>
                    <p className="text-[0.6rem] text-muted-foreground tracking-wider">{user.tier}</p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-status-rejected px-4 py-2.5 border border-border rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 border border-border rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 text-center text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
