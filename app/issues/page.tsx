import Link from "next/link";
import { Search, Filter, Flame, Clock, Users, MessageSquare, TrendingUp, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type IssueStatus = "HOT" | "OPEN" | "PROPOSED" | "FORWARDED" | "ENACTED" | "REJECTED";
type CategoryKey = "DIGITAL_RIGHTS" | "INFRASTRUCTURE" | "PUBLIC_POLICY" | "ENVIRONMENT" | "EDUCATION" | "HEALTH" | "ECONOMY";

interface Issue {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: IssueStatus;
  category: CategoryKey;
  scopeLabel: string;
  author: { name: string; tier: "PAKAR" | "PEJABAT" | "WARGA"; profession: string };
  participants: number;
  stances: number;
  votes: number;
  heatScore: number;
  tags: string[];
  timeAgo: string;
}

const STATUS_CONFIG: Record<IssueStatus, { label: string; cls: string }> = {
  HOT:       { label: "Trending", cls: "bg-status-hot text-white" },
  OPEN:      { label: "Diskusi Terbuka", cls: "bg-status-open text-white" },
  PROPOSED:  { label: "Diajukan", cls: "bg-status-proposed text-white" },
  FORWARDED: { label: "Diteruskan", cls: "bg-status-forwarded text-white" },
  ENACTED:   { label: "Menjadi Kebijakan", cls: "bg-status-enacted text-white" },
  REJECTED:  { label: "Ditolak", cls: "bg-status-rejected text-white" },
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  DIGITAL_RIGHTS: "Hak Digital",
  INFRASTRUCTURE: "Infrastruktur",
  PUBLIC_POLICY:  "Kebijakan Publik",
  ENVIRONMENT:    "Lingkungan",
  EDUCATION:      "Pendidikan",
  HEALTH:         "Kesehatan",
  ECONOMY:        "Ekonomi",
};

const TIER_CONFIG = {
  PAKAR:   { cls: "bg-accent text-accent-foreground" },
  PEJABAT: { cls: "bg-status-enacted text-white" },
  WARGA:   { cls: "bg-muted text-muted-foreground" },
};

const MOCK_ISSUES: Issue[] = [
  {
    id: 1,
    slug: "perlindungan-data-biometrik-uu-pdp",
    title: "Perlindungan Data Biometrik dalam UU PDP",
    description: "UU Pelindungan Data Pribadi No. 27/2022 masih belum memiliki aturan implementasi spesifik untuk data biometrik. Perlu aturan turunan yang mengatur standar perlindungan dan konsekuensi pelanggaran.",
    status: "HOT",
    category: "DIGITAL_RIGHTS",
    scopeLabel: "Nasional",
    author: { name: "Dr. Sari Wijaya", tier: "PAKAR", profession: "Akademisi Hukum" },
    participants: 156,
    stances: 47,
    votes: 4231,
    heatScore: 0.92,
    tags: ["privasi", "data-pribadi", "UU-PDP"],
    timeAgo: "2 jam lalu",
  },
  {
    id: 2,
    slug: "reformasi-transportasi-umum-dki",
    title: "Reformasi Sistem Transportasi Umum DKI Jakarta",
    description: "Integrasi antara TransJakarta, MRT, LRT, dan KRL belum optimal. Diperlukan sistem tiket terintegrasi dan kebijakan last-mile connectivity yang jelas untuk menekan penggunaan kendaraan pribadi.",
    status: "OPEN",
    category: "INFRASTRUCTURE",
    scopeLabel: "DKI Jakarta",
    author: { name: "Pak Joko Santoso", tier: "PAKAR", profession: "Peneliti Transportasi" },
    participants: 89,
    stances: 31,
    votes: 2150,
    heatScore: 0.73,
    tags: ["transportasi", "DKI", "mobilitas"],
    timeAgo: "5 jam lalu",
  },
  {
    id: 3,
    slug: "transparansi-anggaran-pemda",
    title: "Standar Transparansi Anggaran Pemerintah Daerah",
    description: "Banyak APBD daerah tidak dipublikasikan tepat waktu atau dalam format yang dapat dibaca publik. Perlu standar nasional untuk transparansi anggaran yang dapat dimonitor masyarakat sipil.",
    status: "FORWARDED",
    category: "PUBLIC_POLICY",
    scopeLabel: "Nasional",
    author: { name: "Mbak Lia Rahayu", tier: "PAKAR", profession: "Jurnalis Investigasi" },
    participants: 234,
    stances: 78,
    votes: 8920,
    heatScore: 0.88,
    tags: ["anggaran", "transparansi", "akuntabilitas"],
    timeAgo: "1 hari lalu",
  },
  {
    id: 4,
    slug: "revisi-uu-penyiaran-konten-digital",
    title: "Revisi UU Penyiaran: Implikasi pada Konten Digital",
    description: "Revisi UU Penyiaran yang sedang dibahas berpotensi memperluas kewenangan KPI ke platform streaming dan YouTube. Perlu deliberasi apakah ini proporsional terhadap kebebasan pers digital.",
    status: "HOT",
    category: "DIGITAL_RIGHTS",
    scopeLabel: "Nasional",
    author: { name: "Ahmad Fauzi, S.H.", tier: "PAKAR", profession: "Pengacara Media" },
    participants: 312,
    stances: 93,
    votes: 11200,
    heatScore: 0.97,
    tags: ["pers", "KPI", "streaming", "kebebasan-berekspresi"],
    timeAgo: "3 jam lalu",
  },
  {
    id: 5,
    slug: "kebijakan-reklamasi-teluk-jakarta",
    title: "Kebijakan Reklamasi Teluk Jakarta dan Dampak Lingkungan",
    description: "Proyek reklamasi pulau-pulau di Teluk Jakarta memiliki implikasi lingkungan dan sosial yang signifikan bagi nelayan. Perlu kajian komprehensif sebelum kelanjutan proyek.",
    status: "PROPOSED",
    category: "ENVIRONMENT",
    scopeLabel: "DKI Jakarta",
    author: { name: "Pak Eko Nugroho", tier: "PAKAR", profession: "Aktivis Lingkungan" },
    participants: 67,
    stances: 22,
    votes: 980,
    heatScore: 0.58,
    tags: ["reklamasi", "teluk-jakarta", "nelayan", "lingkungan"],
    timeAgo: "2 hari lalu",
  },
  {
    id: 6,
    slug: "standar-upah-minimum-pekerja-platform",
    title: "Standar Upah Minimum untuk Pekerja Ekonomi Platform",
    description: "Pengemudi ojek online, kurir, dan pekerja platform lainnya tidak terlindungi UU Ketenagakerjaan sebagai karyawan. Perlu regulasi yang memastikan perlindungan minimum tanpa mengorbankan fleksibilitas.",
    status: "OPEN",
    category: "ECONOMY",
    scopeLabel: "Nasional",
    author: { name: "Rina Kusuma, M.H.", tier: "PAKAR", profession: "Akademisi Hukum Perburuhan" },
    participants: 178,
    stances: 54,
    votes: 5670,
    heatScore: 0.81,
    tags: ["gig-economy", "ketenagakerjaan", "ojol"],
    timeAgo: "8 jam lalu",
  },
];

const CATEGORIES: { key: CategoryKey | "ALL"; label: string }[] = [
  { key: "ALL", label: "Semua Kategori" },
  { key: "DIGITAL_RIGHTS", label: "Hak Digital" },
  { key: "INFRASTRUCTURE", label: "Infrastruktur" },
  { key: "PUBLIC_POLICY", label: "Kebijakan Publik" },
  { key: "ENVIRONMENT", label: "Lingkungan" },
  { key: "ECONOMY", label: "Ekonomi" },
  { key: "EDUCATION", label: "Pendidikan" },
  { key: "HEALTH", label: "Kesehatan" },
];

const STATUSES: { key: IssueStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Semua Status" },
  { key: "HOT", label: "Trending" },
  { key: "OPEN", label: "Diskusi Terbuka" },
  { key: "PROPOSED", label: "Diajukan" },
  { key: "FORWARDED", label: "Diteruskan" },
  { key: "ENACTED", label: "Menjadi Kebijakan" },
];

function HeatBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 0.85 ? "bg-status-hot" :
            score >= 0.65 ? "bg-status-open" :
            "bg-status-proposed"
          }`}
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="text-[0.65rem] text-muted-foreground font-mono">
        {Math.round(score * 100)}
      </span>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const status = STATUS_CONFIG[issue.status];
  const tier = TIER_CONFIG[issue.author.tier];

  return (
    <Link
      href={`/issues/${issue.slug}`}
      className="group block bg-card border border-border rounded-2xl p-6 hover:border-primary/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[0.6rem] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${status.cls}`}>
            {status.label}
          </span>
          <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {CATEGORY_LABELS[issue.category]}
          </span>
          <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {issue.scopeLabel}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* Title */}
      <h3 className="font-fraunces text-[1.1rem] font-bold text-foreground leading-snug mb-2.5 group-hover:text-primary transition-colors">
        {issue.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {issue.description}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[0.65rem] font-bold text-accent">
          {issue.author.name[0]}
        </div>
        <span className="font-medium text-foreground">{issue.author.name}</span>
        <span>·</span>
        <span>{issue.author.profession}</span>
        <span className={`ml-1 text-[0.55rem] font-black tracking-wider px-1.5 py-0.5 rounded-full ${tier.cls}`}>
          {issue.author.tier}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {issue.tags.map((tag) => (
          <span key={tag} className="text-[0.65rem] text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{issue.participants}</span>
            <span>partisipan</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{issue.stances}</span>
            <span>pernyataan</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HeatBar score={issue.heatScore} />
          <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {issue.timeAgo}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function IssuesPage() {
  const hotIssues = MOCK_ISSUES.filter((i) => i.status === "HOT");
  const allIssues = MOCK_ISSUES;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Page header */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-end justify-between gap-8">
              <div className="space-y-2">
                <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary">
                  SuaraKita
                </p>
                <h1 className="font-fraunces text-[2.5rem] font-bold text-foreground leading-tight">
                  Isu Kebijakan Publik
                </h1>
                <p className="text-muted-foreground text-sm">
                  {allIssues.length} isu aktif dari seluruh Indonesia
                </p>
              </div>

              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Cari isu atau topik..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-56 shrink-0 space-y-6">
            {/* Status filter */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                Status
              </p>
              <div className="space-y-0.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      s.key === "ALL"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                Kategori
              </p>
              <div className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                Cakupan
              </p>
              <div className="space-y-0.5">
                {["Semua", "Nasional", "DKI Jakarta", "Jawa Barat", "Jawa Timur"].map((scope) => (
                  <button
                    key={scope}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA for expert */}
            <div className="bg-primary/[0.06] border border-primary/15 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Punya isu untuk diajukan?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Verified Expert dapat mengajukan isu baru dengan konteks hukum dan deliberatif.
              </p>
              <Link
                href="/auth/expert-apply"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Daftar sebagai Expert
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Trending section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-status-hot" />
                <h2 className="text-sm font-semibold text-foreground">Isu Trending</h2>
                <span className="text-xs text-muted-foreground ml-1">
                  · paling banyak didiskusikan minggu ini
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {hotIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </section>

            {/* All issues */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Semua Isu</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Urutkan:</span>
                  <select className="bg-card border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option>Paling Panas</option>
                    <option>Terbaru</option>
                    <option>Paling Banyak Partisipan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {allIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
