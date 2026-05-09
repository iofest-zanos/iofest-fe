"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Clock, Users, MessageSquare, TrendingUp, ChevronRight, X } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { issues as issuesApi, IssueListItem } from "@/lib/api";

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
            {CATEGORY_LABELS[issue.category as CategoryKey] ?? issue.category}
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
        <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {issue.timeAgo}
        </div>
      </div>
    </Link>
  );
}

export default function IssuesPage() {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "ALL">("ALL");
  const [selectedScope, setSelectedScope] = useState<ScopeKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "participants" | "votes">("newest");
  const [items, setItems] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const allFilteredIssues = items;

  // Check if any filter is active
  const hasActiveFilters = selectedStatus !== "ALL" || selectedCategory !== "ALL" || selectedScope !== "ALL" || searchQuery !== "";

  const clearFilters = () => {
    setSelectedStatus("ALL");
    setSelectedCategory("ALL");
    setSelectedScope("ALL");
    setSearchQuery("");
  };

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
                  {filteredIssues.length} isu aktif dari seluruh Indonesia
                </p>
              </div>

              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari isu, tag, atau topik..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-xs text-muted-foreground">Filter aktif:</span>
                {selectedStatus !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Status: {STATUSES.find(s => s.key === selectedStatus)?.label}
                    <button onClick={() => setSelectedStatus("ALL")} className="hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                    Kategori: {CATEGORIES.find(c => c.key === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory("ALL")} className="hover:text-accent/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedScope !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-status-open/10 text-status-open px-2 py-1 rounded-full">
                    Cakupan: {SCOPE_LABELS[selectedScope]}
                    <button onClick={() => setSelectedScope("ALL")} className="hover:text-status-open/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="hover:text-muted-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Hapus semua filter
                </button>
              </div>
            )}
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
                    onClick={() => setSelectedStatus(s.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      s.key === selectedStatus
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{s.label}</span>
                    {s.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">
                        {items.filter((i) => i.status === s.key).length}
                      </span>
                    )}
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
                    onClick={() => setSelectedCategory(c.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      c.key === selectedCategory
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">
                        {items.filter((i) => i.category === c.key).length}
                      </span>
                    )}
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
                {SCOPES.map((scope) => (
                  <button
                    key={scope.key}
                    onClick={() => setSelectedScope(scope.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      scope.key === selectedScope
                        ? "bg-status-open/10 text-status-open font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{scope.label}</span>
                    {scope.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60">
                        {items.filter((i) => i.scopeKey === scope.key).length}
                      </span>
                    )}
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
          <main className="flex-1 min-w-0">
            {/* All issues */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {hasActiveFilters ? "Hasil Pencarian" : "Semua Isu"}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({filteredIssues.length})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-card border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="participants">Paling Banyak Partisipan</option>
                    <option value="votes">Paling Banyak Vote</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-44 bg-card border border-border rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <p className="text-status-rejected font-medium mb-1">Gagal memuat isu</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : filteredIssues.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {allFilteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-1">Tidak ada isu ditemukan</p>
                  <p className="text-sm text-muted-foreground">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Hapus filter
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
