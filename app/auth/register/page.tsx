"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Check, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, label: "Akun" },
  { id: 2, label: "Profil" },
  { id: 3, label: "Verifikasi" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    profession: "",
  });
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccountSubmit() {
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleProfileSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await register({
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        profession: form.profession,
        bio: form.bio,
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Pendaftaran gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Masukkan 6 digit OTP. (Mode dev: cek terminal server backend.)");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await verifyOtp(form.email, code);
      router.push("/issues");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "OTP tidak valid.");
    } finally {
      setSubmitting(false);
    }
  }

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Lemah", "Sedang", "Kuat", "Sangat Kuat"][passwordStrength];
  const strengthColor = ["", "bg-status-rejected", "bg-status-hot", "bg-vote-abstain", "bg-status-enacted"][passwordStrength];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-[45%] bg-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-[80px]" />

        <Link href="/">
          <span className="font-fraunces text-2xl font-bold text-background">
            Suara<span className="text-primary">Kita</span>
          </span>
        </Link>

        <div className="space-y-8">
          <div className="space-y-5">
            <blockquote className="font-fraunces text-4xl font-bold text-background leading-tight">
              Suaramu layak didengar. Dengan cara yang tepat.
            </blockquote>
            <p className="text-background/50 text-sm leading-relaxed max-w-xs">
              Daftar sebagai Warga dan mulai ikut menilai isu-isu kebijakan yang mempengaruhi kehidupan
              sehari-hari. Verified Expert mendapat akses lebih luas.
            </p>
          </div>

        </div>

        <p className="text-background/30 text-xs">
          IOFEST 2026 · Good Governance &amp; Civic Tech
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-sm space-y-6 sm:space-y-7">
          {/* Logo mobile */}
          <div className="lg:hidden">
            <Link href="/">
              <span className="font-fraunces text-xl font-bold text-foreground">
                Suara<span className="text-primary">Kita</span>
              </span>
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id
                      ? "bg-status-enacted text-white"
                      : step === s.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step === s.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 ${step > s.id ? "bg-status-enacted" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 — Account */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="font-fraunces text-3xl font-bold text-foreground">Buat akun</h1>
                <p className="text-sm text-muted-foreground">Daftarkan email dan password Anda.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="name">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Dr. Sari Wijaya"
                    className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="reg-email">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="reg-pass">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-pass"
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
                  {form.password.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all ${
                              i <= passwordStrength ? strengthColor : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[0.65rem] text-muted-foreground">
                        Kekuatan: <span className="font-medium text-foreground">{strengthLabel}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide" htmlFor="phone">
                    Nomor HP
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+62 8xx xxxx xxxx"
                    className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                  />
                  <p className="text-[0.65rem] text-muted-foreground">
                    Digunakan untuk verifikasi OTP.
                  </p>
                </div>
              </div>

              {error && step === 1 && (
                <div className="text-xs text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <button
                onClick={handleAccountSubmit}
                disabled={!form.fullName || !form.email || form.password.length < 8}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 — Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="font-fraunces text-3xl font-bold text-foreground">Lengkapi profil</h1>
                <p className="text-sm text-muted-foreground">
                  Profil yang lengkap meningkatkan kepercayaan komunitas.
                </p>
              </div>

              <div className="space-y-4">
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center text-2xl font-bold text-accent">
                    {form.fullName?.[0] ?? "?"}
                  </div>
                  <div>
                    <button className="text-sm font-medium text-primary hover:underline">
                      Unggah foto profil
                    </button>
                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG maks. 2MB</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide">
                    Profesi / Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={form.profession}
                    onChange={(e) => setForm({ ...form, profession: e.target.value })}
                    placeholder="Akademisi Hukum, Jurnalis, Peneliti..."
                    className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide">
                    Bio Singkat <span className="font-normal text-muted-foreground">(opsional)</span>
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 200) })}
                    placeholder="Ceritakan sedikit tentang Anda dan ketertarikan kebijakan Anda..."
                    className="w-full min-h-[80px] px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all resize-none"
                  />
                  <p className="text-[0.65rem] text-muted-foreground text-right">{form.bio.length}/200</p>
                </div>

                {/* Expert CTA */}
                <div className="bg-accent/[0.06] border border-accent/15 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Ingin akses lebih sebagai Expert?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Verified Expert dapat mengajukan isu baru dan post stance penuh. Daftar setelah akun
                    aktif.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-accent font-medium">
                    Pelajari tentang tier
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-medium"
                >
                  Kembali
                </button>
                <button
                  onClick={handleProfileSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Mendaftarkan..." : "Lanjutkan"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {error && step === 2 && (
                <div className="text-xs text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="font-fraunces text-3xl font-bold text-foreground">Verifikasi email</h1>
                <p className="text-sm text-muted-foreground">
                  Masukkan 6-digit kode OTP yang dikirim ke{" "}
                  <span className="font-medium text-foreground">{form.email || "email Anda"}</span>.
                </p>
              </div>

              <div className="space-y-4">
                {/* OTP input */}
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                        const next = [...otp];
                        next[i] = val;
                        setOtp(next);
                        if (val && i < 5) {
                          const nextEl = document.getElementById(`otp-${i + 1}`);
                          nextEl?.focus();
                        }
                      }}
                      id={`otp-${i}`}
                      className="w-11 h-13 text-center text-lg font-bold bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  ))}
                </div>
                {error && step === 3 && (
                  <div className="text-xs text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Tidak menerima kode?{" "}
                    <button className="text-primary hover:underline font-medium">
                      Kirim ulang
                    </button>
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    Kode berlaku selama <span className="font-medium text-foreground">10 menit</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={submitting || otp.join("").length !== 6}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Memverifikasi..." : "Aktifkan Akun"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
