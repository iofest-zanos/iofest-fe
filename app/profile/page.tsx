"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, LogOut, Mail, Phone, Shield, Calendar, Save, X, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/lib/auth-context";
import { auth, expert, ExpertApplicationData, MeUser } from "@/lib/api";

const TIER_CLS: Record<string, string> = {
  WARGA: "bg-muted text-muted-foreground",
  PAKAR: "bg-accent text-accent-foreground",
  PEJABAT: "bg-status-enacted text-white",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refresh } = useAuth();

  const [form, setForm] = useState<Partial<MeUser> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expertApp, setExpertApp] = useState<ExpertApplicationData | null>(null);

  useEffect(() => {
    if (!user) return;
    expert.status().then((r) => setExpertApp(r.application)).catch(() => {});
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4">
          <div className="h-48 bg-card border border-border rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Masuk untuk melihat profil.</p>
          <Link href="/auth/login" className="text-primary hover:underline text-sm">Masuk</Link>
        </div>
      </div>
    );
  }

  const data = form ?? user;
  const tierCls = TIER_CLS[user.tier] ?? TIER_CLS.WARGA;

  const isDirty = form !== null && (
    form.name !== user.name ||
    form.profession !== user.profession ||
    form.instansi !== user.instansi ||
    form.phone !== user.phone ||
    form.bio !== user.bio
  );

  const handleSave = async () => {
    if (!form || !isDirty) return;
    setSaving(true);
    setError(null);
    try {
      await auth.patchMe({
        name: form.name,
        profession: form.profession,
        instansi: form.instansi,
        phone: form.phone,
        bio: form.bio,
      });
      await refresh();
      setForm(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof MeUser, label: string, opts?: { type?: string; placeholder?: string; help?: string }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground tracking-wide">{label}</label>
      <input
        type={opts?.type ?? "text"}
        value={(data[key] as string) ?? ""}
        onChange={(e) => setForm({ ...(form ?? user), [key]: e.target.value })}
        placeholder={opts?.placeholder ?? ""}
        className="w-full px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
      />
      {opts?.help && <p className="text-[0.65rem] text-muted-foreground">{opts.help}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* ── Header ── */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">
            <Link href="/issues" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Beranda
            </Link>
            <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight">
              Profil
            </h1>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Toast */}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-status-enacted bg-status-enacted/10 border border-status-enacted/20 px-4 py-3 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              Profil berhasil diperbarui
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-sm text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-4 py-3 rounded-xl">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* ── Profile card ── */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/15 flex items-center justify-center text-2xl sm:text-3xl font-bold text-accent shrink-0">
                {user.avatar_initial}
              </div>
              <div className="text-center sm:text-left space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h2 className="font-fraunces text-xl sm:text-2xl font-bold text-foreground">{user.name}</h2>
                  <span className={`text-[0.6rem] font-black tracking-wider px-2 py-0.5 rounded-full ${tierCls}`}>
                    {user.tier}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                  {user.is_email_verified && (
                    <span className="inline-flex items-center gap-0.5 text-[0.6rem] font-medium text-status-enacted bg-status-enacted/10 px-1.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Terverifikasi
                    </span>
                  )}
                </div>
                {user.profession && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <Shield className="w-3.5 h-3.5" />
                    {user.profession}
                    {user.instansi && <> · {user.instansi}</>}
                  </p>
                )}
                {user.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <Phone className="w-3.5 h-3.5" />
                    {user.phone}
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="w-3 h-3" />
                  Bergabung sejak {new Date((user as MeUser & { date_joined?: string }).date_joined ?? Date.now()).toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          </div>

          {/* ── Edit form ── */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-semibold text-foreground">Informasi Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {field("name", "Nama Lengkap", { placeholder: "Nama lengkap Anda" })}
              {field("profession", "Profesi", { placeholder: "Contoh: Akademisi Hukum" })}
              {field("instansi", "Instansi/Organisasi", { placeholder: "Contoh: Universitas Indonesia", help: user.tier === "PEJABAT" ? "Instansi tempat Anda bertugas" : undefined })}
              {field("phone", "No. Telepon", { type: "tel", placeholder: "Contoh: +62 812-3456-7890" })}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground tracking-wide">Bio</label>
              <textarea
                value={(data.bio as string) ?? ""}
                onChange={(e) => setForm({ ...(form ?? user), bio: e.target.value })}
                placeholder="Ceritakan tentang diri Anda..."
                maxLength={400}
                className="w-full min-h-[100px] px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y leading-relaxed placeholder:text-muted-foreground/50"
              />
              <p className="text-[0.65rem] text-muted-foreground text-right">{(data.bio ?? "").length}/400</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              {isDirty && (
                <button
                  onClick={() => setForm(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </div>

          {/* ── Expert ── */}
          {user.tier === "WARGA" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {expertApp && expertApp.status !== "REJECTED" ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      {expertApp.status === "APPROVED" ? (
                        <CheckCircle2 className="w-5 h-5 text-status-enacted" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Aplikasi Expert</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {expertApp.status_label}
                      </p>
                    </div>
                  </div>
                  {expertApp.status === "APPROVED" && (
                    <p className="text-xs text-status-enacted bg-status-enacted/10 px-3 py-2 rounded-lg">
                      Selamat! Akun Anda sekarang bertipe PAKAR.
                    </p>
                  )}
                  {expertApp.status === "REVIEW" && (
                    <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                      Aplikasi Anda sedang ditinjau oleh tim kami. Estimasi 1-3 hari kerja.
                    </p>
                  )}
                  {expertApp.status === "SUBMITTED" && (
                    <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                      Aplikasi Anda telah terkirim dan menunggu review.
                    </p>
                  )}
                </div>
              ) : (
                <Link href="/auth/expert-apply" className="flex items-center gap-4 p-6 hover:bg-muted/20 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">Upgrade ke Expert</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {expertApp?.status === "REJECTED"
                        ? "Ajukan ulang aplikasi Expert Anda"
                        : "Dapatkan akses mengajukan isu dan menulis pernyataan"}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </Link>
              )}
            </div>
          )}

          {/* ── Account ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            <div className="px-6 py-4">
              <p className="text-sm font-semibold text-foreground">Akun</p>
            </div>
            {!user.is_email_verified && (
              <Link href="/auth/verify" className="flex items-center gap-3 px-6 py-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                <span className="flex-1">Verifikasi Email</span>
                <span className="text-[0.6rem] font-bold text-status-hot bg-status-hot/10 px-2 py-0.5 rounded-full">Belum</span>
              </Link>
            )}
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="w-full flex items-center gap-3 px-6 py-4 text-sm text-muted-foreground hover:text-status-rejected hover:bg-status-rejected/5 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
