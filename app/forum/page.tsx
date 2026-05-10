"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  MessageSquare,
  Flame,
  TrendingUp,
  Clock,
  ChevronRight,
  ThumbsUp,
  Bookmark,
  Hash,
  CheckCircle2,
  ArrowUpDown,
  PanelRightOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { forum, ThreadListItem } from "@/lib/api";
import {
  FilterBottomSheet,
  FilterOption,
} from "@/components/ui/filter-bottom-sheet";

type ThreadStatus = "HOT" | "PINNED" | "OPEN" | "SOLVED" | "CLOSED";
type ForumCategory =
  | "GENERAL"
  | "POLICY_DISCUSSION"
  | "EXPERT_QA"
  | "CIVIC_TECH"
  | "LEGAL_HELP"
  | "NEWS_DISCUSS";

type Thread = ThreadListItem;

const STATUS_CONFIG: Record<ThreadStatus, { label: string; cls: string }> = {
  HOT: { label: "Trending", cls: "bg-status-hot text-white" },
  PINNED: { label: "Pinned", cls: "bg-primary text-white" },
  OPEN: { label: "Diskusi", cls: "bg-status-open text-white" },
  SOLVED: { label: "Terjawab", cls: "bg-status-enacted text-white" },
  CLOSED: { label: "Ditutup", cls: "bg-muted text-muted-foreground" },
};

const CATEGORY_LABELS: Record<
  ForumCategory,
  { label: string; description: string }
> = {
  GENERAL: {
    label: "Umum",
    description: "Diskusi umum tentang platform dan kebijakan",
  },
  POLICY_DISCUSSION: {
    label: "Diskusi Kebijakan",
    description: "Analisis dan debat kebijakan publik",
  },
  EXPERT_QA: {
    label: "Tanya Expert",
    description: "Tanya jawab dengan para ahli",
  },
  CIVIC_TECH: {
    label: "Civic Tech",
    description: "Teknologi untuk kebaikan bersama",
  },
  LEGAL_HELP: {
    label: "Bantuan Hukum",
    description: "Konsultasi dan informasi hukum",
  },
  NEWS_DISCUSS: {
    label: "Diskusi Berita",
    description: "Bahas berita terkini",
  },
};

const TIER_CONFIG = {
  PAKAR: { cls: "bg-accent text-accent-foreground" },
  PEJABAT: { cls: "bg-status-enacted text-white" },
  WARGA: { cls: "bg-muted text-muted-foreground" },
};

const MOCK_THREADS_LEGACY: unknown[] = [
  {
    id: 1,
    slug: "bagaimana-mekanisme-deliberasi-works",
    title: "Bagaimana mekanisme deliberasi di SuaraKita bekerja?",
    excerpt:
      "Saya baru bergabung dan ingin memahami bagaimana sistem voting dan clustering opinion map bekerja. Apakah ada yang bisa jelaskan?",
    status: "PINNED",
    category: "GENERAL",
    author: {
      name: "Tim SuaraKita",
      tier: "PEJABAT",
      profession: "Platform Team",
      initial: "S",
    },
    replies: 45,
    views: 2340,
    upvotes: 128,
    heatScore: 0.85,
    tags: ["panduan", "newbie", "deliberasi"],
    timeAgo: "2 minggu lalu",
    lastReply: { author: "Dr. Sari Wijaya", timeAgo: "2 jam lalu" },
  },
  {
    id: 2,
    slug: "diskusi-ruu-perlindungan-data-pribadi",
    title: "Diskusi: Revisi RUU Perlindungan Data Pribadi yang sedang berjalan",
    excerpt:
      "DPR sedang bahas revisi RUU PDP. Menurut teman-teman, apa yang perlu diperhatikan dari draf terbaru? Ada beberapa pasal yang mengkhawatirkan tentang kewenangan pengawasan.",
    status: "HOT",
    category: "POLICY_DISCUSSION",
    author: {
      name: "Budi Prakoso",
      tier: "PAKAR",
      profession: "Peneliti Kebijakan Digital",
      initial: "B",
    },
    replies: 67,
    views: 4520,
    upvotes: 234,
    heatScore: 0.96,
    tags: ["UU-PDP", "privasi", "DPR", "revisi"],
    timeAgo: "5 jam lalu",
    lastReply: { author: "Ahmad Fauzi", timeAgo: "15 menit lalu" },
  },
  {
    id: 3,
    slug: "tanya-pemberlakuan-uu-kekerasan-seksual",
    title: "Tanya: Implementasi UU TPKS di institusi pendidikan",
    excerpt:
      "Sebagai dosen, saya ingin memastikan kampus kami memenuhi standar UU TPKS. Apa saja komponen wajib yang harus ada dalam kebijakan internal?",
    status: "OPEN",
    category: "EXPERT_QA",
    author: {
      name: "Dra. Maya Lestari",
      tier: "WARGA",
      profession: "Dosen Universitas",
      initial: "M",
    },
    replies: 12,
    views: 580,
    upvotes: 45,
    heatScore: 0.62,
    tags: ["UU-TPKS", "pendidikan", "kampus"],
    timeAgo: "1 hari lalu",
    lastReply: { author: "Prof. Rini S", timeAgo: "3 jam lalu" },
    isAnswered: true,
  },
  {
    id: 4,
    slug: "pengalaman-pakai-ai-untuk-analisis-kebijakan",
    title: "Pengalaman menggunakan AI untuk analisis kebijakan publik",
    excerpt:
      "Saya sudah bereksperimen dengan GPT-4 dan Claude untuk membantu merangkum dokumen kebijakan. Berbagi tips dan best practices untuk civic tech enthusiasts.",
    status: "HOT",
    category: "CIVIC_TECH",
    author: {
      name: "Joko Santoso",
      tier: "PAKAR",
      profession: "Data Scientist",
      initial: "J",
    },
    replies: 34,
    views: 1890,
    upvotes: 156,
    heatScore: 0.88,
    tags: ["AI", "civic-tech", "tools", "productivity"],
    timeAgo: "8 jam lalu",
    lastReply: { author: "Lisa Wijaya", timeAgo: "1 jam lalu" },
  },
  {
    id: 5,
    slug: "konsultasi-sengketa-tanah-pemerintah",
    title:
      "Konsultasi: Prosedur gugatan sengketa tanah melawan pemerintah daerah",
    excerpt:
      "Tanah keluarga kami tiba-tiba tercatat sebagai aset pemda. Bagaimana prosedur pengajuan keberatan yang benar? Apakah perlu lawyer atau bisa self-represent?",
    status: "OPEN",
    category: "LEGAL_HELP",
    author: {
      name: "Pak Eko Nugroho",
      tier: "WARGA",
      profession: "Warga",
      initial: "E",
    },
    replies: 8,
    views: 420,
    upvotes: 23,
    heatScore: 0.55,
    tags: ["sengketa-tanah", "hukum", "pemda", "bantuan"],
    timeAgo: "2 hari lalu",
    lastReply: { author: "Hendra, S.H.", timeAgo: "5 jam lalu" },
  },
  {
    id: 6,
    slug: "analisis-putusan-mk-terkini",
    title: "Analisis: Putusan MK terkini tentang presidential threshold",
    excerpt:
      "MK baru saja keluarkan putusan yang mengubah ambang batas presidential threshold. Mari kita bahas implikasi hukum dan politiknya secara mendalam.",
    status: "HOT",
    category: "NEWS_DISCUSS",
    author: {
      name: "Dr. Ahmad Rizal",
      tier: "PAKAR",
      profession: "Ahli Hukum Tata Negara",
      initial: "A",
    },
    replies: 89,
    views: 6780,
    upvotes: 312,
    heatScore: 0.94,
    tags: ["MK", "putusan", "pilpres", "threshold", "konstitusi"],
    timeAgo: "3 jam lalu",
    lastReply: { author: "Prof. Dewi", timeAgo: "20 menit lalu" },
  },
  {
    id: 7,
    slug: "feedback-fitur-baru-opinion-map",
    title: "Feedback: Fitur Opinion Map yang baru",
    excerpt:
      "Suka banget sama visualisasi opinion map yang baru! Lebih mudah dimengerti. Beberapa saran untuk improvement...",
    status: "OPEN",
    category: "GENERAL",
    author: {
      name: "Lia Rahayu",
      tier: "PAKAR",
      profession: "Jurnalis",
      initial: "L",
    },
    replies: 23,
    views: 890,
    upvotes: 67,
    heatScore: 0.71,
    tags: ["feedback", "feature", "ux", "opinion-map"],
    timeAgo: "12 jam lalu",
    lastReply: { author: "Tim SuaraKita", timeAgo: "30 menit lalu" },
  },
];

const CATEGORIES: { key: ForumCategory | "ALL"; label: string }[] = [
  { key: "ALL", label: "Semua Kategori" },
  { key: "GENERAL", label: "Umum" },
  { key: "POLICY_DISCUSSION", label: "Diskusi Kebijakan" },
  { key: "EXPERT_QA", label: "Tanya Expert" },
  { key: "CIVIC_TECH", label: "Civic Tech" },
  { key: "LEGAL_HELP", label: "Bantuan Hukum" },
  { key: "NEWS_DISCUSS", label: "Diskusi Berita" },
];

const SORT_OPTIONS: FilterOption[] = [
  { key: "trending", label: "Paling Trending" },
  { key: "newest", label: "Terbaru" },
  { key: "most_replies", label: "Paling Banyak Balasan" },
  { key: "most_views", label: "Paling Banyak Dilihat" },
];

function HeatBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 0.85
              ? "bg-status-hot"
              : score >= 0.65
                ? "bg-status-open"
                : "bg-status-proposed"
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

function ThreadCard({ thread }: { thread: Thread }) {
  const status =
    STATUS_CONFIG[thread.status as ThreadStatus] ?? STATUS_CONFIG.OPEN;

  return (
    <Link
      href={`/forum/${thread.slug}`}
      className="block bg-card border border-border rounded-xl px-4 py-3.5 hover:border-primary/25 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span
              className={`text-[0.55rem] font-bold tracking-wide px-2 py-0.5 rounded-full ${status.cls}`}
            >
              {status.label}
            </span>
            <span className="text-[0.55rem] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[thread.category as ForumCategory]?.label ??
                thread.category}
            </span>
            {thread.isAnswered && (
              <span className="inline-flex items-center gap-0.5 text-[0.5rem] font-bold text-status-enacted bg-status-enacted/10 px-1.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Terjawab
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {thread.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
            {thread.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[0.6rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {thread.replies}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {thread.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {thread.timeAgo}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default function ForumPage() {
  const [items, setItems] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    ForumCategory | "ALL"
  >("ALL");
  const [selectedSort, setSelectedSort] = useState("trending");
  const [sheetSort, setSheetSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    forum
      .list({
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
        sort: selectedSort,
        q: searchQuery.trim() || undefined,
      })
      .then(setItems)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Gagal memuat forum."),
      )
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSort, searchQuery]);

  const hotThreads = items.filter(
    (t) => t.status === "HOT" || t.heatScore >= 0.85,
  );
  const allThreads = items.filter((t) => t.status !== "PINNED");
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === selectedSort)?.label ??
    "Paling Trending";

  const sidebarContent = (
    <>
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
          Kategori
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map((c) => {
            const isAll = c.key === "ALL";
            const isSelected = isAll
              ? selectedCategory === "ALL"
              : selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key as ForumCategory | "ALL")}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>{c.label}</span>
                {c.key !== "ALL" && (
                  <span className="text-[0.65rem] text-muted-foreground/60 group-hover:text-muted-foreground">
                    {items.filter((t) => t.category === c.key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
          Urutkan
        </p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelectedSort(s.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                s.key === selectedSort
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Link
        href="/forum/bookmarks"
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/[0.06] border border-accent/15 hover:border-accent/30 transition-all group my-2"
      >
        <Bookmark className="w-4 h-4 text-accent shrink-0 " />
        <span className="text-sm text-foreground group-hover:text-accent transition-colors">
          Bookmark Saya
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
      </Link>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 my-2">
        <p className="text-sm font-semibold text-foreground">Statistik Forum</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="font-fraunces text-2xl font-bold text-foreground">
              {items.length}
            </p>
            <p className="text-[0.65rem] text-muted-foreground">Thread</p>
          </div>
          <div className="text-center">
            <p className="font-fraunces text-2xl font-bold text-foreground">
              {items.reduce((acc, t) => acc + t.replies, 0)}
            </p>
            <p className="text-[0.65rem] text-muted-foreground">Balasan</p>
          </div>
          <div className="text-center">
            <p className="font-fraunces text-2xl font-bold text-foreground">
              {items.reduce((acc, t) => acc + t.views, 0).toLocaleString()}
            </p>
            <p className="text-[0.65rem] text-muted-foreground">Views</p>
          </div>
          <div className="text-center">
            <p className="font-fraunces text-2xl font-bold text-primary">128</p>
            <p className="text-[0.65rem] text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <div className="bg-accent/[0.06] border border-accent/15 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Hash className="w-4 h-4 text-accent" />
          Panduan Forum
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Pastikan diskusi tetap konstruktif dan menghormati perbedaan pendapat.
        </p>
        <Link
          href="/forum/guidelines"
          className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
        >
          Baca panduan lengkap
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="my-2">
        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
          Tag Populer
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "privasi",
            "hukum",
            "AI",
            "civic-tech",
            "DPR",
            "UU-PDP",
            "kampus",
            "putusan-MK",
          ].map((tag) => (
            <button
              key={tag}
              className="text-[0.65rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* ── Header + search + filter ── */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
              <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight">
                Forum Diskusi
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  title={
                    sidebarOpen ? "Sembunyikan filter" : "Tampilkan filter"
                  }
                >
                  <PanelRightOpen
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`}
                  />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <Link
                  href="/forum/new"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thread Baru</span>
                </Link>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari thread diskusi..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Sort button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSheetSort(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortLabel}
              </button>
              <span className="text-xs text-muted-foreground">
                {items.length} thread
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile drawer backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile sidebar drawer */}
          <aside
            className={`fixed left-0 top-16 bottom-0 z-50 w-64 bg-card border-r border-border overflow-y-auto p-4 sm:p-6 space-y-6 transition-transform duration-300 lg:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent}
          </aside>

          {/* Desktop sidebar — collapsible inline */}
          <aside
            className={`hidden lg:block overflow-hidden transition-all duration-300 shrink-0 ${sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"}`}
          >
            {sidebarContent}
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-6 sm:space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Flame className="w-4 h-4 text-status-hot" />
                <h2 className="text-sm font-semibold text-foreground">
                  Sedang Trending
                </h2>
                <span className="text-xs text-muted-foreground">
                  · minggu ini
                </span>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-28 bg-card border border-border rounded-xl animate-pulse" />
                  <div className="h-28 bg-card border border-border rounded-xl animate-pulse" />
                </div>
              ) : error ? (
                <p className="text-sm text-status-rejected">{error}</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {hotThreads.slice(0, 3).map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Semua Thread
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({allThreads.length})
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {allThreads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-2 sm:pt-4">
              <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-6 py-3 border border-border rounded-xl hover:bg-muted/50">
                Muat lebih banyak
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Sort bottom sheet */}
      <FilterBottomSheet
        open={sheetSort}
        onClose={() => setSheetSort(false)}
        title="Urutkan Thread"
        options={SORT_OPTIONS}
        selected={selectedSort}
        onSelect={(k) => setSelectedSort(k)}
        showSearch={false}
      />
    </div>
  );
}
