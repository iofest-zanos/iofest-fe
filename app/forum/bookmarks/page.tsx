"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { forum, ThreadListItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Bookmark,
  Search,
  MessageSquare,
  Clock,
  ThumbsUp,
  Trash2,
  ChevronRight,
  PanelRightOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type ThreadStatus = "OPEN" | "SOLVED" | "CLOSED";
type ForumCategory =
  | "GENERAL"
  | "POLICY_DISCUSSION"
  | "EXPERT_QA"
  | "CIVIC_TECH"
  | "LEGAL_HELP"
  | "NEWS_DISCUSS";

type BookmarkedThread = ThreadListItem & { bookmarkedAt?: string };

const CATEGORY_LABELS: Record<ForumCategory, string> = {
  GENERAL: "Umum",
  POLICY_DISCUSSION: "Diskusi Kebijakan",
  EXPERT_QA: "Tanya Expert",
  CIVIC_TECH: "Civic Tech",
  LEGAL_HELP: "Bantuan Hukum",
  NEWS_DISCUSS: "Diskusi Berita",
};

const TIER_CONFIG = {
  PAKAR: { cls: "bg-accent text-accent-foreground" },
  PEJABAT: { cls: "bg-status-enacted text-white" },
  WARGA: { cls: "bg-muted text-muted-foreground" },
};

const _MOCK_BOOKMARKS_LEGACY: unknown[] = [
  {
    id: 1,
    slug: "diskusi-ruu-perlindungan-data-pribadi",
    title: "Diskusi: Revisi RUU Perlindungan Data Pribadi yang sedang berjalan",
    excerpt:
      "DPR sedang bahas revisi RUU PDP. Menurut teman-teman, apa yang perlu diperhatikan dari draf terbaru? Ada beberapa pasal yang mengkhawatirkan tentang kewenangan pengawasan.",
    status: "OPEN",
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
    tags: ["UU-PDP", "privasi", "DPR", "revisi"],
    bookmarkedAt: "2 hari lalu",
    lastReply: { author: "Ahmad Fauzi", timeAgo: "15 menit lalu" },
  },
  {
    id: 3,
    slug: "tanya-pemberlakuan-uu-kekerasan-seksual",
    title: "Tanya: Implementasi UU TPKS di institusi pendidikan",
    excerpt:
      "Sebagai dosen, saya ingin memastikan kampus kami memenuhi standar UU TPKS. Apa saja komponen wajib yang harus ada dalam kebijakan internal?",
    status: "SOLVED",
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
    tags: ["UU-TPKS", "pendidikan", "kampus"],
    bookmarkedAt: "1 minggu lalu",
    lastReply: { author: "Prof. Rini S", timeAgo: "3 jam lalu" },
  },
  {
    id: 4,
    slug: "pengalaman-pakai-ai-untuk-analisis-kebijakan",
    title: "Pengalaman menggunakan AI untuk analisis kebijakan publik",
    excerpt:
      "Saya sudah bereksperimen dengan GPT-4 dan Claude untuk membantu merangkum dokumen kebijakan. Berbagi tips dan best practices untuk civic tech enthusiasts.",
    status: "OPEN",
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
    tags: ["AI", "civic-tech", "tools", "productivity"],
    bookmarkedAt: "3 hari lalu",
    lastReply: { author: "Lisa Wijaya", timeAgo: "1 jam lalu" },
  },
  {
    id: 6,
    slug: "analisis-putusan-mk-terkini",
    title: "Analisis: Putusan MK terkini tentang presidential threshold",
    excerpt:
      "MK baru saja keluarkan putusan yang mengubah ambang batas presidential threshold. Mari kita bahas implikasi hukum dan politiknya secara mendalam.",
    status: "OPEN",
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
    tags: ["MK", "putusan", "pilpres", "threshold", "konstitusi"],
    bookmarkedAt: "5 hari lalu",
    lastReply: { author: "Prof. Dewi", timeAgo: "20 menit lalu" },
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

function BookmarkCard({
  thread,
  onRemove,
}: {
  thread: BookmarkedThread;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="group relative bg-card border border-border rounded-xl px-4 py-3.5 hover:border-primary/25 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Badges row */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-[0.55rem] font-bold tracking-wide px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              {CATEGORY_LABELS[thread.category as ForumCategory] ??
                thread.category}
            </span>
            {thread.status === "SOLVED" && (
              <span className="text-[0.5rem] font-bold text-status-enacted bg-status-enacted/10 px-1.5 py-0.5 rounded-full">
                Terjawab
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/forum/${thread.slug}`}>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {thread.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mb-1">
            {thread.excerpt}
          </p>

          {/* Compact stats row */}
          <div className="flex items-center gap-3 text-[0.6rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {thread.replies}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {thread.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              {thread.bookmarkedAt ?? thread.timeAgo}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(thread.id);
          }}
          className="p-1.5 text-muted-foreground/40 hover:text-status-rejected transition-colors shrink-0 mt-0.5"
          title="Hapus bookmark"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    ForumCategory | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    forum
      .myBookmarks()
      .then((items) => setBookmarks(items as BookmarkedThread[]))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleRemoveBookmark = async (id: number) => {
    const target = bookmarks.find((b) => b.id === id);
    if (!target) return;
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    try {
      await forum.bookmark(target.slug, false);
    } catch (e) {
      console.error(e);
    }
  };

  const sidebarContent = (
    <>
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
          Filter Kategori
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
                  {bookmarks.filter((b) => b.category === c.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">
          Statistik Bookmark
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Bookmark</span>
            <span className="font-medium text-foreground">
              {bookmarks.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Belum Dibaca</span>
            <span className="font-medium text-status-hot">
              {Math.ceil(bookmarks.length * 0.3)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Terjawab</span>
            <span className="font-medium text-status-enacted">
              {bookmarks.filter((b) => b.status === "SOLVED").length}
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3 my-2">
          Menu Cepat
        </p>
        <div className="space-y-0.5">
          <Link
            href="/forum"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Lihat Forum
          </Link>
        </div>
      </div>
    </>
  );

  const filteredBookmarks = bookmarks.filter((thread) => {
    const matchesCategory =
      selectedCategory === "ALL" || thread.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* ── Compact header ── */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">
            <Link
              href="/forum"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Forum
            </Link>
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight">
                Bookmark Diskusi
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
                <span className="text-xs text-muted-foreground shrink-0">
                  {bookmarks.length}
                </span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bookmark..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>

        {/* ── Content ── */}
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
          <main className="flex-1 min-w-0">
            {!user && !authLoading ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <p className="text-muted-foreground mb-3 text-sm">
                  Masuk untuk melihat bookmark Anda.
                </p>
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline text-sm"
                >
                  Masuk
                </Link>
              </div>
            ) : loading ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-card border border-border rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredBookmarks.map((thread) => (
                  <BookmarkCard
                    key={thread.id}
                    thread={thread}
                    onRemove={handleRemoveBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Belum ada bookmark
                </h3>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                  Simpan diskusi menarik untuk dibaca nanti.
                </p>
                <Link
                  href="/forum"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-primary/90 transition-all"
                >
                  Jelajahi Forum
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
