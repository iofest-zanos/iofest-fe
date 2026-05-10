import Link from "next/link";
import { ArrowRight, ChevronRight, Users, FileText, Scale, Sparkles, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const stats = [
  { value: "1.247", label: "Isu Aktif" },
  { value: "47rb+", label: "Pernyataan" },
  { value: "12.800+", label: "Partisipan" },
  { value: "89", label: "Brief Kebijakan" },
];

const steps = [
  {
    step: "01",
    title: "Ajukan Isu",
    description:
      "Expert mengajukan isu kebijakan dengan konteks yang substantif, referensi hukum relevan, dan pertanyaan deliberatif yang jelas.",
    accent: "primary",
  },
  {
    step: "02",
    title: "Deliberasi Terstruktur",
    description:
      "Partisipan menilai pernyataan-pernyataan (Setuju / Abstain / Tidak Setuju). AI memetakan opini ke kelompok yang teridentifikasi secara matematis.",
    accent: "accent",
  },
  {
    step: "03",
    title: "Brief ke Pembuat Kebijakan",
    description:
      "AI menghasilkan dokumen executive brief 1–2 halaman: konsensus, titik divisif, dan rekomendasi kebijakan — siap dikonsumsi DPR/DPRD.",
    accent: "primary",
  },
];

const features = [
  {
    Icon: Users,
    title: "Opinion Cluster Map",
    description:
      "Visualisasi 2D posisi setiap partisipan berdasarkan pola voting. Lihat di mana Anda berdiri relatif terhadap kelompok lain secara real-time.",
    accent: "accent",
  },
  {
    Icon: Sparkles,
    title: "Bridge Statement Detection",
    description:
      "Algoritma mendeteksi pernyataan yang disetujui mayoritas lintas semua kubu — titik temu yang sering tersembunyi di balik polarisasi.",
    accent: "primary",
  },
  {
    Icon: FileText,
    title: "AI Policy Brief Generator",
    description:
      "Dari deliberasi terdistribusi ke dokumen kebijakan dalam hitungan detik. Terstruktur, netral, dan dapat langsung dikonsumsi pembuat kebijakan.",
    accent: "accent",
  },
  {
    Icon: Scale,
    title: "Legal Context Assistant",
    description:
      "RAG terhadap 200+ peraturan perundangan Indonesia. Pahami regulasi yang sudah ada sebelum memulai diskusi — hindari aspirasi yang tidak realistis.",
    accent: "primary",
  },
];

const testimonials = [
  {
    quote:
      "Akhirnya ada platform di mana riset hukum saya bisa langsung berpengaruh ke pembuat kebijakan, bukan hanya tersimpan di jurnal.",
    name: "Dr. Sari Wijaya",
    role: "Akademisi Hukum · Universitas Tarumanagara",
    tier: "PAKAR",
    initial: "S",
  },
  {
    quote:
      "Dashboard isu memberi saya data terstruktur tentang aspirasi konstituen. Jauh lebih actionable dibanding membaca ratusan DM.",
    name: "Bu Rina Kusuma",
    role: "Anggota DPRD DKI · Komisi A",
    tier: "PEJABAT",
    initial: "R",
  },
  {
    quote:
      "Sebagai jurnalis, opinion cluster map mengungkap nuansa yang tidak terlihat di headline — siapa setuju apa dengan siapa.",
    name: "Mbak Lia Rahayu",
    role: "Jurnalis Investigasi · Media Digital Nasional",
    tier: "PAKAR",
    initial: "L",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-[100px] pointer-events-none" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0F172A 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 animate-fadeInUp"
              style={{ animationDelay: "0ms" }}
            >
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </span>
              <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary/80">
                Platform Deliberasi Sipil Indonesia
              </span>
            </div>

            <h1
              className="font-fraunces text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.04] font-bold text-foreground animate-fadeInUp"
              style={{ animationDelay: "80ms" }}
            >
              Suaramu,
              <br />
              <span className="relative inline-block">
                Terstruktur
                <span className="text-primary">.</span>
                <span
                  className="absolute -bottom-1 left-0 h-[3px] bg-primary/25 w-full rounded-full"
                  aria-hidden
                />
              </span>
            </h1>

            <p
              className="text-[0.95rem] sm:text-[1.1rem] text-muted-foreground leading-relaxed max-w-[420px] animate-fadeInUp"
              style={{ animationDelay: "160ms" }}
            >
              Bukan forum, bukan petisi. SuaraKita mengubah diskusi publik yang
              tidak terstruktur menjadi konsensus yang dapat dikonsumsi pembuat
              kebijakan — dengan algoritma clustering dan AI.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-fadeInUp"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/issues"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 text-sm w-full sm:w-auto justify-center"
              >
                Jelajahi Isu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#cara-kerja"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cara kerja
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 animate-fadeInUp"
              style={{ animationDelay: "320ms" }}
            >
              {["Deliberasi Terstruktur", "Opinion Clustering AI", "Brief Kebijakan Otomatis"].map(
                (tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    {tag}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right — product preview cards */}
          <div
            className="relative animate-slideInRight hidden lg:block"
            style={{ animationDelay: "300ms" }}
          >
            {/* Main stance voting card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-foreground/[0.06] space-y-5">
              {/* Isu header */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pb-1 border-b border-border">
                <span className="font-semibold text-foreground text-[0.8rem]">
                  Perlindungan Data Biometrik · UU PDP
                </span>
                <span className="ml-auto bg-status-hot text-white px-2 py-0.5 rounded-full font-bold text-[0.65rem] tracking-wide">
                  TRENDING
                </span>
              </div>

              {/* Stance */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      BRIDGE · 78–92% setuju lintas kubu
                    </span>
                    <p className="text-[0.95rem] text-foreground font-medium leading-snug">
                      "Data biometrik harus mendapat perlindungan tingkat tertinggi
                      karena tidak dapat diganti seperti password."
                    </p>
                  </div>
                  <span className="shrink-0 mt-0.5 bg-accent text-accent-foreground text-[0.6rem] font-black tracking-wider px-2 py-1 rounded-full">
                    PAKAR
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[0.7rem] font-bold text-accent">
                    S
                  </div>
                  <span className="font-medium text-foreground text-xs">Dr. Sari Wijaya</span>
                  <span>·</span>
                  <span>Akademisi Hukum</span>
                  <span>·</span>
                  <span>23 mnt lalu</span>
                </div>
              </div>

              {/* Vote buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-vote-disagree-bg text-vote-disagree font-semibold text-xs hover:bg-vote-disagree hover:text-white transition-colors cursor-default">
                  Tidak Setuju
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-vote-abstain-bg text-vote-abstain font-semibold text-xs hover:bg-vote-abstain hover:text-foreground transition-colors cursor-default">
                  Abstain
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-vote-agree-bg text-vote-agree font-semibold text-xs hover:bg-vote-agree hover:text-white transition-colors cursor-default">
                  Setuju
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[0.7rem] text-muted-foreground">
                  <span>Progress menilai</span>
                  <span className="font-medium text-foreground">12 / 47 pernyataan</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "25.5%" }} />
                </div>
              </div>
            </div>

            {/* Floating mini opinion map */}
            <div className="absolute -bottom-10 -right-10 bg-card border border-border rounded-2xl p-4 shadow-xl shadow-foreground/[0.06] w-60 animate-fadeIn" style={{ animationDelay: "700ms" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.7rem] font-semibold text-foreground">Peta Opini</span>
                <span className="text-[0.65rem] text-muted-foreground">156 partisipan · 3 kubu</span>
              </div>
              <div className="relative h-28 bg-muted/40 rounded-lg overflow-hidden border border-border/50">
                {/* Grid lines */}
                <div className="absolute inset-0" style={{
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }} />
                {/* Cluster A dots (teal) */}
                {[[28,28],[38,22],[22,38],[32,16],[18,30],[42,30],[26,42],[34,34]].map(([x,y],i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-full bg-cluster-0/80" style={{ left: x, top: y }} />
                ))}
                {/* Cluster B dots (orange) — contains "YOU" */}
                {[[160,20],[170,28],[152,32],[178,22],[165,38],[175,16],[158,44]].map(([x,y],i) => (
                  <div key={i} className={`absolute rounded-full ${i === 2 ? 'w-3 h-3 bg-cluster-1 ring-2 ring-white -translate-x-0.5 -translate-y-0.5' : 'w-2 h-2 bg-cluster-1/80'}`} style={{ left: x, top: y }} />
                ))}
                {/* Cluster C dots (purple) */}
                {[[94,78],[108,72],[84,82],[100,88],[115,80],[90,68]].map(([x,y],i) => (
                  <div key={i} className="absolute w-2 h-2 rounded-full bg-cluster-2/80" style={{ left: x, top: y }} />
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2.5">
                {[["cluster-0","67 Privasi Ketat"],["cluster-1","54 Pro-Inovasi"],["cluster-2","35 Moderat"]].map(([cls,label]) => (
                  <div key={cls} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full bg-${cls}`} />
                    <span className="text-[0.6rem] text-muted-foreground leading-none">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-border bg-muted/20 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-border">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:px-8 first:sm:pl-0 last:sm:pr-0">
                <p className="font-fraunces text-[1.75rem] sm:text-[2.25rem] font-bold text-foreground leading-none">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="cara-kerja" className="py-16 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary">
            Cara Kerja
          </p>
          <h2 className="font-fraunces text-[2rem] sm:text-[3rem] font-bold text-foreground leading-tight">
            Dari diskusi ke kebijakan,
            <br />
            <span className="text-muted-foreground font-normal">dalam tiga langkah.</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Connector */}
          <div className="absolute top-[3.5rem] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-px bg-border hidden lg:block" />
          {steps.map((step) => (
            <div key={step.step} className="space-y-4 md:space-y-5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  step.accent === "primary"
                    ? "bg-primary/10"
                    : "bg-accent/10"
                }`}
              >
                <span
                  className={`font-fraunces text-2xl font-bold ${
                    step.accent === "primary" ? "text-primary" : "text-accent"
                  }`}
                >
                  {step.step}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary">
              Fitur Unggulan
            </p>
            <h2 className="font-fraunces text-[2rem] sm:text-[3rem] font-bold text-foreground leading-tight">
              Teknologi untuk deliberasi,
              <br />
              <span className="text-muted-foreground font-normal">bukan untuk polarisasi.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-6 sm:p-8 group hover:border-primary/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/[0.04] transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-6 ${
                    f.accent === "primary" ? "bg-primary/10" : "bg-accent/10"
                  }`}
                >
                  <f.Icon
                    className={`w-5 h-5 ${f.accent === "primary" ? "text-primary" : "text-accent"}`}
                  />
                </div>
                <h3 className="text-[1rem] sm:text-[1.05rem] font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary">
            Pengguna
          </p>
          <h2 className="font-fraunces text-[2rem] sm:text-[3rem] font-bold text-foreground">
            Untuk mereka yang peduli kebijakan.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-2xl p-6 space-y-5"
            >
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
                <span
                  className={`ml-auto text-[0.6rem] font-black tracking-wider px-2 py-1 rounded-full shrink-0 ${
                    t.tier === "PEJABAT"
                      ? "bg-status-enacted text-white"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {t.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-28 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.04] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <h2 className="font-fraunces text-[2.5rem] sm:text-[3.5rem] font-bold text-foreground leading-tight">
            Suaramu, untuk Indonesia.
            <br />
            <span className="text-primary">Sekarang.</span>
          </h2>
          <p className="text-[0.95rem] sm:text-[1.05rem] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Bergabung dengan akademisi, jurnalis, aktivis, dan warga yang
            membentuk kebijakan publik Indonesia secara terstruktur.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 w-full sm:w-auto justify-center"
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/issues"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              atau jelajahi isu terlebih dahulu →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between text-center sm:text-left">
          <span className="font-fraunces text-lg font-bold text-foreground">
            Suara<span className="text-primary">Kita</span>
          </span>
          <p className="text-xs text-muted-foreground order-last sm:order-none mt-2 sm:mt-0">
            Platform Deliberasi Sipil Indonesia &middot; IOFEST 2026 &middot;{" "}
            <span className="text-primary/70">Good Governance &amp; Civic Tech</span>
          </p>
          <div className="flex items-center gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

const navLinks = [
  { href: "/issues", label: "Isu" },
  { href: "/legal", label: "Hukum" },
  { href: "/news", label: "Berita" },
];
