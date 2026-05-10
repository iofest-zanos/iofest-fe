"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      router.push("/issues");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tidak bisa masuk. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Ambient */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-black/10 blur-[80px]" />

        <Link href="/" className="relative z-10">
          <span className="font-fraunces text-2xl font-bold text-white">
            Suara<span className="text-white/60">Kita</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <blockquote className="font-fraunces text-4xl font-bold text-white leading-tight">
            Deliberasi yang terstruktur menghasilkan kebijakan yang lebih baik.
          </blockquote>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Bergabung dengan ribuan akademisi, jurnalis, dan aktivis yang membentuk kebijakan
            Indonesia melalui diskusi terstruktur berbasis AI.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-xs">
            <span className="text-white font-medium">12.800+</span> partisipan aktif
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm space-y-6 sm:space-y-8">
          {/* Logo mobile */}
          <div className="lg:hidden">
            <Link href="/">
              <span className="font-fraunces text-xl font-bold text-foreground">
                Suara<span className="text-primary">Kita</span>
              </span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="font-fraunces text-3xl font-bold text-foreground">
              Selamat datang kembali
            </h1>
            <p className="text-sm text-muted-foreground">
              Masuk untuk melanjutkan deliberasi Anda.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="text-xs text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="password">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 10 karakter"
                  className="w-full px-4 py-3 pr-11 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !form.email || !form.password}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Memproses..." : "Masuk"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground">
                Belum punya akun?
              </span>
            </div>
          </div>

          <Link
            href="/auth/register"
            className="w-full flex items-center justify-center gap-2 border border-border text-foreground py-3 rounded-xl font-medium text-sm hover:bg-muted/50 transition-all"
          >
            Daftar sebagai Warga
          </Link>

          <p className="text-[0.65rem] text-muted-foreground text-center leading-relaxed">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="underline hover:text-foreground">Syarat Layanan</Link>{" "}
            dan{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Kebijakan Privasi</Link>{" "}
            SuaraKita.
          </p>
        </div>
      </div>
    </div>
  );
}
