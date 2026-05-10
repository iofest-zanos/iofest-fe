"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link2, Award, CheckCircle2, AlertCircle, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/auth-context";
import { ApiError, expert, ExpertApplicationData } from "@/lib/api";

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  SUBMITTED: { cls: "bg-status-open/10 text-status-open", label: "Terkirim" },
  REVIEW: { cls: "bg-status-hot/10 text-status-hot", label: "Sedang Ditinjau" },
  REVISION: { cls: "bg-status-forwarded/10 text-status-forwarded", label: "Butuh Revisi" },
  APPROVED: { cls: "bg-status-enacted/10 text-status-enacted", label: "Disetujui" },
  REJECTED: { cls: "bg-status-rejected/10 text-status-rejected", label: "Ditolak" },
};

export default function ExpertApplyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<ExpertApplicationData | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    application_type: "INDEPENDENT",
    profession: "",
    license_number: "",
    publication_link: "",
    portfolio_notes: "",
    linkedin_url: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    expert.status()
      .then((r) => {
        setApplication(r.application);
        if (r.application) {
          setForm({
            application_type: r.application.application_type,
            profession: r.application.profession,
            license_number: r.application.license_number,
            publication_link: r.application.publication_link,
            portfolio_notes: r.application.portfolio_notes,
            linkedin_url: r.application.linkedin_url,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingApp(false));
  }, [user, authLoading, router]);

  const isRejected = application?.status === "REJECTED";
  const isPending = application && !isRejected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await expert.apply(form);
      setApplication(res);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengirim aplikasi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loadingApp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4">
          <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (user.tier !== "WARGA") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4 text-center space-y-4">
          <Award className="w-16 h-16 text-accent mx-auto" />
          <h1 className="font-fraunces text-2xl font-bold text-foreground">Anda sudah {user.tier}</h1>
          <p className="text-sm text-muted-foreground">Akun Anda sudah memiliki akses Expert.</p>
          <Link href="/profile" className="text-sm text-primary hover:underline">Kembali ke Profil</Link>
        </div>
      </div>
    );
  }

  if (success || (isPending && application?.status !== "REJECTED")) {
    const sb = STATUS_BADGE[application?.status ?? "SUBMITTED"] ?? STATUS_BADGE.SUBMITTED;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4 text-center space-y-5">
          {application?.status === "APPROVED" ? (
            <CheckCircle2 className="w-16 h-16 text-status-enacted mx-auto" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          )}
          <h1 className="font-fraunces text-2xl font-bold text-foreground">
            {application?.status === "APPROVED" ? "Selamat! Anda Sekarang PAKAR" : "Aplikasi Terkirim"}
          </h1>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${sb.cls}`}>
            {sb.label}
          </span>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {application?.status === "APPROVED"
              ? "Anda sekarang dapat mengajukan isu dan menulis pernyataan sebagai Pakar."
              : "Tim kami akan meninjau aplikasi Anda. Proses biasanya memakan waktu 1-3 hari kerja."}
          </p>
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Kembali ke Profil
          </Link>
        </div>
      </div>
    );
  }

  const isValid = form.application_type && form.profession && form.linkedin_url;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <Link href="/profile" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Profil
            </Link>
            <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight mt-2">
              Ajukan Sebagai Expert
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Rejected banner */}
          {isRejected && (
            <div className="flex items-start gap-3 text-sm bg-status-hot/10 border border-status-hot/20 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 text-status-hot shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-status-hot mb-1">Aplikasi sebelumnya ditolak</p>
                <p className="text-muted-foreground">{application?.admin_notes || "Silakan ajukan ulang dengan data yang lebih lengkap."}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Application Type */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                Pilih Jalur Verifikasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, application_type: "INSTITUTION" })}
                  className={`flex items-start gap-3 p-4 border rounded-xl text-left transition-all ${
                    form.application_type === "INSTITUTION"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Afiliasi Institusi</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Email .ac.id / .go.id / .sch.id</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, application_type: "INDEPENDENT" })}
                  className={`flex items-start gap-3 p-4 border rounded-xl text-left transition-all ${
                    form.application_type === "INDEPENDENT"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Pakar Independen</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Praktisi dengan lisensi profesi</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Professional Identity */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                Identitas Profesi
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground tracking-wide">Profesi *</label>
                <input
                  value={form.profession}
                  onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  placeholder="Contoh: Pengacara, Dokter, Peneliti Kebijakan"
                  className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              {form.application_type === "INDEPENDENT" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide">Nomor Izin Praktik</label>
                    <input
                      value={form.license_number}
                      onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                      placeholder="SIP/NIA/STR (jika ada)"
                      className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
                    />
                    <p className="text-[0.65rem] text-muted-foreground">Nomor izin praktik atau registrasi profesi Anda</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide">Tautan Publikasi / Portofolio</label>
                    <input
                      value={form.publication_link}
                      onChange={(e) => setForm({ ...form, publication_link: e.target.value })}
                      placeholder="https://scholar.google.com/... atau https://sinta.kemdikbud.go.id/..."
                      className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
                    />
                    <p className="text-[0.65rem] text-muted-foreground">SINTA, Google Scholar, atau publikasi lainnya</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide">Catatan Tambahan</label>
                    <textarea
                      value={form.portfolio_notes}
                      onChange={(e) => setForm({ ...form, portfolio_notes: e.target.value })}
                      placeholder="Spesialisasi, pengalaman, atau informasi lain yang relevan..."
                      maxLength={1000}
                      className="w-full min-h-[80px] px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y placeholder:text-muted-foreground/50"
                    />
                    <p className="text-[0.65rem] text-muted-foreground text-right">{form.portfolio_notes.length}/1000</p>
                  </div>
                </>
              )}
            </div>

            {/* Step 3: LinkedIn */}
            {form.application_type === "INDEPENDENT" && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  Verifikasi Identitas via LinkedIn
                </h3>
                <div className="flex items-start gap-3 p-4 bg-accent/[0.06] border border-accent/15 rounded-xl">
                  <Link2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Hubungkan Profil LinkedIn Anda</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Karena Anda menggunakan email publik, kami memerlukan profil LinkedIn untuk verifikasi identitas.
                      Nama di LinkedIn harus sesuai dengan data diri dan dokumen profesi Anda.
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground tracking-wide">URL Profil LinkedIn *</label>
                  <input
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/namaprofil"
                    className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
              </div>
            )}

            {form.application_type === "INSTITUTION" && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  Verifikasi Email Institusi
                </h3>
                <div className="flex items-start gap-3 p-4 bg-accent/[0.06] border border-accent/15 rounded-xl">
                  <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Gunakan email institusi Anda</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pastikan email yang terdaftar di akun Anda adalah email institusi resmi
                      (berakhiran .ac.id, .go.id, atau .sch.id) untuk verifikasi otomatis.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email Anda saat ini: <span className="font-medium text-foreground">{user.email}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              {submitting ? "Mengirim..." : isRejected ? "Ajukan Ulang" : "Kirim Aplikasi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
