"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
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
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-fraunces text-[1.35rem] font-bold text-foreground leading-none">
            Suara<span className="text-primary">Kita</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
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

        <div className="flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="w-20 h-7 rounded-md bg-muted animate-pulse" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                  {user.avatar_initial}
                </div>
                <div className="text-xs leading-tight hidden md:block">
                  <p className="font-medium text-foreground">{user.name || user.email}</p>
                  <p className="text-[0.6rem] text-muted-foreground tracking-wider">{user.tier}</p>
                </div>
              </div>
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
      </nav>
    </header>
  );
}
