"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Clock, Users, MessageSquare, ChevronRight, X, PanelRightOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { issues as issuesApi, IssueListItem } from "@/lib/api";
import { FilterBottomSheet, FilterOption } from "@/components/ui/filter-bottom-sheet";

type IssueStatus = "DIAJUKAN" | "SEDANG_DIBAHAS" | "DRAFT" | "PENGESAHAN" | "HASIL";
type CategoryKey = "DIGITAL_RIGHTS" | "INFRASTRUCTURE" | "PUBLIC_POLICY" | "ENVIRONMENT" | "EDUCATION" | "HEALTH" | "ECONOMY";
type ScopeKey = "ALL" | "NASIONAL" | "DKI_JAKARTA" | "JAWA_BARAT" | "JAWA_TIMUR";

type Issue = IssueListItem;

const STATUS_CONFIG: Record<IssueStatus, { label: string; cls: string }> = {
  DIAJUKAN:       { label: "Isu Diajukan", cls: "bg-stage-diajukan text-white" },
  SEDANG_DIBAHAS: { label: "Sedang Dibahas", cls: "bg-stage-dibahas text-white" },
  DRAFT:          { label: "Draft Peraturan", cls: "bg-stage-draft text-white" },
  PENGESAHAN:     { label: "Tahap Pengesahan", cls: "bg-stage-pengesahan text-white" },
  HASIL:          { label: "Hasil Pengesahan", cls: "bg-stage-hasil-disahkan text-white" },
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

const SCOPE_LABELS: Record<ScopeKey, string> = {
  ALL: "Semua",
  NASIONAL: "Nasional",
  DKI_JAKARTA: "DKI Jakarta",
  JAWA_BARAT: "Jawa Barat",
  JAWA_TIMUR: "Jawa Timur",
};

const TIER_CONFIG = {
  PAKAR:   { cls: "bg-accent text-accent-foreground" },
  PEJABAT: { cls: "bg-status-enacted text-white" },
  WARGA:   { cls: "bg-muted text-muted-foreground" },
};

const _MOCK_ISSUES_DEPRECATED: never[] = []; const MOCK_ISSUES_LEGACY = [
  {
    id: 1,
    slug: "perlindungan-data-biometrik-uu-pdp",
    title: "Perlindungan Data Biometrik dalam UU PDP",
    description: "UU Pelindungan Data Pribadi No. 27/2022 masih belum memiliki aturan implementasi spesifik untuk data biometrik. Perlu aturan turunan yang mengatur standar perlindungan dan konsekuensi pelanggaran.",
    status: "SEDANG_DIBAHAS",
    category: "DIGITAL_RIGHTS",
    scopeLabel: "Nasional",
    scopeKey: "NASIONAL",
    author: { name: "Dr. Sari Wijaya", tier: "PAKAR", profession: "Akademisi Hukum" },
    participants: 156,
    stances: 47,
    votes: 4231,
    tags: ["privasi", "data-pribadi", "UU-PDP"],
    timeAgo: "2 jam lalu",
  },
  {
    id: 2,
    slug: "reformasi-transportasi-umum-dki",
    title: "Reformasi Sistem Transportasi Umum DKI Jakarta",
    description: "Integrasi antara TransJakarta, MRT, LRT, dan KRL belum optimal. Diperlukan sistem tiket terintegrasi dan kebijakan last-mile connectivity yang jelas untuk menekan penggunaan kendaraan pribadi.",
    status: "DRAFT",
    category: "INFRASTRUCTURE",
    scopeLabel: "DKI Jakarta",
    scopeKey: "DKI_JAKARTA",
    author: { name: "Pak Joko Santoso", tier: "PAKAR", profession: "Peneliti Transportasi" },
    participants: 89,
    stances: 31,
    votes: 2150,
    tags: ["transportasi", "DKI", "mobilitas"],
    timeAgo: "5 jam lalu",
  },
  {
    id: 3,
    slug: "transparansi-anggaran-pemda",
    title: "Standar Transparansi Anggaran Pemerintah Daerah",
    description: "Banyak APBD daerah tidak dipublikasikan tepat waktu atau dalam format yang dapat dibaca publik. Perlu standar nasional untuk transparansi anggaran yang dapat dimonitor masyarakat sipil.",
    status: "PENGESAHAN",
    category: "PUBLIC_POLICY",
    scopeLabel: "Nasional",
    scopeKey: "NASIONAL",
    author: { name: "Mbak Lia Rahayu", tier: "PAKAR", profession: "Jurnalis Investigasi" },
    participants: 234,
    stances: 78,
    votes: 8920,
    tags: ["anggaran", "transparansi", "akuntabilitas"],
    timeAgo: "1 hari lalu",
  },
  {
    id: 4,
    slug: "revisi-uu-penyiaran-konten-digital",
    title: "Revisi UU Penyiaran: Implikasi pada Konten Digital",
    description: "Revisi UU Penyiaran yang sedang dibahas berpotensi memperluas kewenangan KPI ke platform streaming dan YouTube. Perlu deliberasi apakah ini proporsional terhadap kebebasan pers digital.",
    status: "SEDANG_DIBAHAS",
    category: "DIGITAL_RIGHTS",
    scopeLabel: "Nasional",
    scopeKey: "NASIONAL",
    author: { name: "Ahmad Fauzi, S.H.", tier: "PAKAR", profession: "Pengacara Media" },
    participants: 312,
    stances: 93,
    votes: 11200,
    tags: ["pers", "KPI", "streaming", "kebebasan-berekspresi"],
    timeAgo: "3 jam lalu",
  },
  {
    id: 5,
    slug: "kebijakan-reklamasi-teluk-jakarta",
    title: "Kebijakan Reklamasi Teluk Jakarta dan Dampak Lingkungan",
    description: "Proyek reklamasi pulau-pulau di Teluk Jakarta memiliki implikasi lingkungan dan sosial yang signifikan bagi nelayan. Perlu kajian komprehensif sebelum kelanjutan proyek.",
    status: "DIAJUKAN",
    category: "ENVIRONMENT",
    scopeLabel: "DKI Jakarta",
    scopeKey: "DKI_JAKARTA",
    author: { name: "Pak Eko Nugroho", tier: "PAKAR", profession: "Aktivis Lingkungan" },
    participants: 67,
    stances: 22,
    votes: 980,
    tags: ["reklamasi", "teluk-jakarta", "nelayan", "lingkungan"],
    timeAgo: "2 hari lalu",
  },
  {
    id: 6,
    slug: "standar-upah-minimum-pekerja-platform",
    title: "Standar Upah Minimum untuk Pekerja Ekonomi Platform",
    description: "Pengemudi ojek online, kurir, dan pekerja platform lainnya tidak terlindungi UU Ketenagakerjaan sebagai karyawan. Perlu regulasi yang memastikan perlindungan minimum tanpa mengorbankan fleksibilitas.",
    status: "HASIL",
    category: "ECONOMY",
    scopeLabel: "Nasional",
    scopeKey: "NASIONAL",
    author: { name: "Rina Kusuma, M.H.", tier: "PAKAR", profession: "Akademisi Hukum Perburuhan" },
    participants: 178,
    stances: 54,
    votes: 5670,
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
  { key: "DIAJUKAN", label: "Isu Diajukan" },
  { key: "SEDANG_DIBAHAS", label: "Sedang Dibahas" },
  { key: "DRAFT", label: "Draft Peraturan" },
  { key: "PENGESAHAN", label: "Tahap Pengesahan" },
  { key: "HASIL", label: "Hasil Pengesahan" },
];

const SCOPES: { key: ScopeKey; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "NASIONAL", label: "Nasional" },
  { key: "DKI_JAKARTA", label: "DKI Jakarta" },
  { key: "JAWA_BARAT", label: "Jawa Barat" },
  { key: "JAWA_TIMUR", label: "Jawa Timur" },
];

// (legacy) Simple fuzzy search retained for client-side fallback if needed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _fuzzySearch_unused(issues: Issue[], query: string): Issue[] {
  if (!query.trim()) return issues;
  
  const searchTerm = query.toLowerCase().trim();
  const terms = searchTerm.split(/\s+/);
  
  return issues.filter((issue) => {
    const searchableText = [
      issue.title,
      issue.description,
      issue.author.name,
      issue.author.profession,
      issue.scopeLabel,
      CATEGORY_LABELS[issue.category as CategoryKey] ?? issue.category,
      STATUS_CONFIG[issue.status as IssueStatus]?.label ?? issue.status,
      ...issue.tags,
    ].join(" ").toLowerCase();
    
    // Check if all terms match (AND logic)
    return terms.every((term) => {
      // Exact match
      if (searchableText.includes(term)) return true;
      
      // Fuzzy match - allow for minor typos (character difference <= 2 for terms > 3 chars)
      if (term.length > 3) {
        const words = searchableText.split(/\s+/);
        return words.some((word) => {
          if (Math.abs(word.length - term.length) > 2) return false;
          const distance = levenshteinDistance(word, term);
          return distance <= 2;
        });
      }
      
      return false;
    });
  });
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}



function IssueCard({ issue }: { issue: Issue }) {
  const status = STATUS_CONFIG[issue.status as IssueStatus] ?? { label: issue.status, cls: "bg-muted text-muted-foreground" };

  return (
    <Link
      href={`/issues/${issue.slug}`}
      className="block bg-card border border-border rounded-xl px-4 py-3.5 hover:border-primary/25 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Badges row */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className={`text-[0.55rem] font-bold tracking-wide px-2 py-0.5 rounded-full ${status.cls}`}>
              {status.label}
            </span>
            <span className="text-[0.55rem] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {issue.scopeLabel}
            </span>
            <span className="text-[0.55rem] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[issue.category as CategoryKey] ?? issue.category}
            </span>
          </div>

          {/* Title + compact description */}
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
            {issue.description}
          </p>

          {/* Compact stats row */}
          <div className="flex items-center gap-3 mt-2 text-[0.6rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {issue.participants}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {issue.stances}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {issue.timeAgo}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

const SCOPE_OPTIONS: FilterOption[] = [
  { key: "ALL", label: "Semua Wilayah" },
  { key: "NASIONAL", label: "Nasional" },
  { key: "DKI_JAKARTA", label: "DKI Jakarta" },
  { key: "JAWA_BARAT", label: "Jawa Barat" },
  { key: "JAWA_TIMUR", label: "Jawa Timur" },
  { key: "ACEH", label: "Aceh" },
  { key: "SUMATERA_UTARA", label: "Sumatera Utara" },
  { key: "SUMATERA_BARAT", label: "Sumatera Barat" },
  { key: "RIAU", label: "Riau" },
  { key: "KEPRI", label: "Kepulauan Riau" },
  { key: "JAMBI", label: "Jambi" },
  { key: "SUMATERA_SELATAN", label: "Sumatera Selatan" },
  { key: "BANGKA_BELITUNG", label: "Bangka Belitung" },
  { key: "BENGKULU", label: "Bengkulu" },
  { key: "LAMPUNG", label: "Lampung" },
  { key: "BANTEN", label: "Banten" },
  { key: "JAWA_TENGAH", label: "Jawa Tengah" },
  { key: "DIY", label: "DI Yogyakarta" },
  { key: "BALI", label: "Bali" },
  { key: "NTB", label: "Nusa Tenggara Barat" },
  { key: "NTT", label: "Nusa Tenggara Timur" },
  { key: "KALIMANTAN_BARAT", label: "Kalimantan Barat" },
  { key: "KALIMANTAN_TENGAH", label: "Kalimantan Tengah" },
  { key: "KALIMANTAN_SELATAN", label: "Kalimantan Selatan" },
  { key: "KALIMANTAN_TIMUR", label: "Kalimantan Timur" },
  { key: "KALIMANTAN_UTARA", label: "Kalimantan Utara" },
  { key: "SULAWESI_UTARA", label: "Sulawesi Utara" },
  { key: "SULAWESI_TENGAH", label: "Sulawesi Tengah" },
  { key: "SULAWESI_SELATAN", label: "Sulawesi Selatan" },
  { key: "SULAWESI_TENGGARA", label: "Sulawesi Tenggara" },
  { key: "GORONTALO", label: "Gorontalo" },
  { key: "SULAWESI_BARAT", label: "Sulawesi Barat" },
  { key: "MALUKU", label: "Maluku" },
  { key: "MALUKU_UTARA", label: "Maluku Utara" },
  { key: "PAPUA", label: "Papua" },
  { key: "PAPUA_BARAT", label: "Papua Barat" },
  { key: "PAPUA_TENGAH", label: "Papua Tengah" },
  { key: "PAPUA_PEGUNUNGAN", label: "Papua Pegunungan" },
  { key: "PAPUA_SELATAN", label: "Papua Selatan" },
  { key: "PAPUA_BARAT_DAYA", label: "Papua Barat Daya" },
  { key: "LAINNYA", label: "Lainnya" },
];

const STATUS_OPTIONS: FilterOption[] = [
  { key: "ALL", label: "Semua Status" },
  { key: "DIAJUKAN", label: "Isu Diajukan" },
  { key: "SEDANG_DIBAHAS", label: "Sedang Dibahas" },
  { key: "DRAFT", label: "Draft Peraturan" },
  { key: "PENGESAHAN", label: "Tahap Pengesahan" },
  { key: "HASIL", label: "Hasil Pengesahan" },
];

export default function IssuesPage() {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "ALL">("ALL");
  const [selectedScope, setSelectedScope] = useState<ScopeKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "participants" | "votes">("newest");
  const [items, setItems] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetScope, setSheetScope] = useState(false);
  const [sheetStatus, setSheetStatus] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true);
    setError(null);
    issuesApi
      .list({
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
        scope: selectedScope === "ALL" ? undefined : selectedScope,
        q: searchQuery.trim() || undefined,
        sort: sortBy,
      })
      .then((r) => setItems(r.results))
      .catch((e) => setError(e.message ?? "Gagal memuat isu."))
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, [selectedStatus, selectedCategory, selectedScope, searchQuery, sortBy]);

  const filteredIssues = items;
  const hasActiveFilters = selectedStatus !== "ALL" || selectedCategory !== "ALL" || selectedScope !== "ALL" || searchQuery !== "";

  const clearFilters = () => {
    setSelectedStatus("ALL");
    setSelectedCategory("ALL");
    setSelectedScope("ALL");
    setSearchQuery("");
  };

  const scopeLabel = SCOPE_OPTIONS.find((o) => o.key === selectedScope)?.label ?? "Semua Wilayah";
  const statusLabel = STATUS_OPTIONS.find((o) => o.key === selectedStatus)?.label ?? "Semua Status";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* ── Compact header + search + filter ── */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
            {/* Title row */}
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight">
                Isu Kebijakan
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  title={sidebarOpen ? "Sembunyikan filter" : "Tampilkan filter"}
                >
                  <PanelRightOpen className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <span className="text-xs text-muted-foreground shrink-0">{filteredIssues.length} isu</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari isu, tag, atau topik..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cakupan button only — status & kategori via sidebar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSheetScope(true)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  selectedScope !== "ALL"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {scopeLabel}
              </button>
              {hasActiveFilters && selectedScope !== "ALL" && (
                <button onClick={clearFilters} className="text-[0.6rem] text-muted-foreground hover:underline ml-auto shrink-0">
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile drawer backdrop */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Mobile sidebar drawer */}
          <aside className={`fixed left-0 top-16 bottom-0 z-50 w-64 bg-card border-r border-border overflow-y-auto p-4 sm:p-6 space-y-6 transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Status</p>
              <div className="space-y-0.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedStatus(s.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      s.key === selectedStatus
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{s.label}</span>
                    {s.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">{items.filter((i) => i.status === s.key).length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Kategori</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      c.key === selectedCategory
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">{items.filter((i) => i.category === c.key).length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-primary/[0.06] border border-primary/15 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Punya isu untuk diajukan?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Verified Expert dapat mengajukan isu baru dengan konteks hukum dan deliberatif.</p>
              <Link href="/auth/expert-apply" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Daftar sebagai Expert
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Desktop sidebar — collapsible inline */}
          <aside className={`hidden lg:block overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? "w-56 opacity-100" : "w-0 opacity-0"}`}>
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Status</p>
              <div className="space-y-0.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedStatus(s.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      s.key === selectedStatus
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{s.label}</span>
                    {s.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">{items.filter((i) => i.status === s.key).length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Kategori</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      c.key === selectedCategory
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">{items.filter((i) => i.category === c.key).length}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-primary/[0.06] border border-primary/15 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Punya isu untuk diajukan?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Verified Expert dapat mengajukan isu baru dengan konteks hukum dan deliberatif.</p>
              <Link href="/auth/expert-apply" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Daftar sebagai Expert
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <section>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    {hasActiveFilters ? "Hasil Pencarian" : "Semua Isu"}
                  </h2>
                  <span className="text-xs text-muted-foreground">({filteredIssues.length})</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-card border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="newest">Terbaru</option>
                  <option value="participants">Partisipan</option>
                  <option value="votes">Vote</option>
                </select>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-28 bg-card border border-border rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10 bg-card border border-border rounded-2xl">
                  <p className="text-status-rejected font-medium mb-1">Gagal memuat isu</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : filteredIssues.length > 0 ? (
                <div className={`grid grid-cols-1 gap-3 transition-all duration-300 ${sidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
                  {items.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-card border border-border rounded-2xl">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-1">Tidak ada isu ditemukan</p>
                  <p className="text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
                  <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">Hapus filter</button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Bottom sheets */}
      <FilterBottomSheet
        open={sheetScope}
        onClose={() => setSheetScope(false)}
        title="Pilih Cakupan"
        options={SCOPE_OPTIONS.map((o) => ({
          ...o,
          count: o.key === "ALL" ? undefined : items.filter((i) => i.scopeKey === o.key).length,
        }))}
        selected={selectedScope}
        onSelect={(k) => setSelectedScope(k as ScopeKey)}
        searchPlaceholder="Cari provinsi..."
      />
      <FilterBottomSheet
        open={sheetStatus}
        onClose={() => setSheetStatus(false)}
        title="Pilih Status"
        options={STATUS_OPTIONS.map((o) => ({
          ...o,
          count: o.key === "ALL" ? undefined : items.filter((i) => i.status === o.key).length,
        }))}
        selected={selectedStatus}
        onSelect={(k) => setSelectedStatus(k as IssueStatus | "ALL")}
        showSearch={false}
      />
    </div>
  );
}
