"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Search,
  MessageSquare,
  Clock,
  Users,
  ThumbsUp,
  Trash2,
  FolderOpen,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type ThreadStatus = "OPEN" | "SOLVED" | "CLOSED";
type ForumCategory = "GENERAL" | "POLICY_DISCUSSION" | "EXPERT_QA" | "CIVIC_TECH" | "LEGAL_HELP" | "NEWS_DISCUSS";

interface BookmarkedThread {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: ThreadStatus;
  category: ForumCategory;
  author: { name: string; tier: "PAKAR" | "PEJABAT" | "WARGA"; profession: string; initial: string };
  replies: number;
  views: number;
  upvotes: number;
  tags: string[];
  bookmarkedAt: string;
  lastReply?: { author: string; timeAgo: string };
}

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

const MOCK_BOOKMARKS: BookmarkedThread[] = [
  {
    id: 1,
    slug: "diskusi-ruu-perlindungan-data-pribadi",
    title: "Diskusi: Revisi RUU Perlindungan Data Pribadi yang sedang berjalan",
    excerpt: "DPR sedang bahas revisi RUU PDP. Menurut teman-teman, apa yang perlu diperhatikan dari draf terbaru? Ada beberapa pasal yang mengkhawatirkan tentang kewenangan pengawasan.",
    status: "OPEN",
    category: "POLICY_DISCUSSION",
    author: { name: "Budi Prakoso", tier: "PAKAR", profession: "Peneliti Kebijakan Digital", initial: "B" },
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
    excerpt: "Sebagai dosen, saya ingin memastikan kampus kami memenuhi standar UU TPKS. Apa saja komponen wajib yang harus ada dalam kebijakan internal?",
    status: "SOLVED",
    category: "EXPERT_QA",
    author: { name: "Dra. Maya Lestari", tier: "WARGA", profession: "Dosen Universitas", initial: "M" },
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
    excerpt: "Saya sudah bereksperimen dengan GPT-4 dan Claude untuk membantu merangkum dokumen kebijakan. Berbagi tips dan best practices untuk civic tech enthusiasts.",
    status: "OPEN",
    category: "CIVIC_TECH",
    author: { name: "Joko Santoso", tier: "PAKAR", profession: "Data Scientist", initial: "J" },
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
    excerpt: "MK baru saja keluarkan putusan yang mengubah ambang batas presidential threshold. Mari kita bahas implikasi hukum dan politiknya secara mendalam.",
    status: "OPEN",
    category: "NEWS_DISCUSS",
    author: { name: "Dr. Ahmad Rizal", tier: "PAKAR", profession: "Ahli Hukum Tata Negara", initial: "A" },
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
  const tier = TIER_CONFIG[thread.author.tier];

  return (
    <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[0.6rem] font-black tracking-wider uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
            {CATEGORY_LABELS[thread.category]}
          </span>
          {thread.status === "SOLVED" && (
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-status-enacted bg-status-enacted/10 px-2 py-0.5 rounded-full">
              <Bookmark className="w-3 h-3" />
              Terjawab
            </span>
          )}
        </div>
        <button
          onClick={() => onRemove(thread.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-status-rejected hover:bg-status-rejected/10 rounded-lg transition-all"
          title="Hapus bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <Link href={`/forum/${thread.slug}`}>
        <h3 className="font-fraunces text-[1.1rem] font-bold text-foreground leading-snug mb-2.5 group-hover:text-primary transition-colors cursor-pointer">
          {thread.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {thread.excerpt}
      </p>

      {/* Author row */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground pb-4 border-b border-border">
        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[0.65rem] font-bold text-accent">
          {thread.author.initial}
        </div>
        <span className="font-medium text-foreground">{thread.author.name}</span>
        <span>·</span>
        <span>{thread.author.profession}</span>
        <span className={`ml-1 text-[0.55rem] font-black tracking-wider px-1.5 py-0.5 rounded-full ${tier.cls}`}>
          {thread.author.tier}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {thread.tags.map((tag) => (
          <span key={tag} className="text-[0.65rem] text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{thread.replies}</span>
            <span>balasan</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{thread.views.toLocaleString()}</span>
            <span>dilihat</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{thread.upvotes}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
            <Bookmark className="w-3 h-3" />
            <span>Disimpan {thread.bookmarkedAt}</span>
          </div>
        </div>
      </div>

      {/* Last reply */}
      {thread.lastReply && (
        <div className="mt-3 pt-3 border-t border-border text-[0.65rem] text-muted-foreground">
          Balasan terakhir oleh <span className="font-medium text-foreground">{thread.lastReply.author}</span> · {thread.lastReply.timeAgo}
        </div>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedThread[]>(MOCK_BOOKMARKS);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBookmarks = bookmarks.filter((thread) => {
    const matchesCategory = selectedCategory === "ALL" || thread.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link
              href="/forum"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Forum
            </Link>

            <div className="flex items-end justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-accent" />
                  <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-accent">
                    Tersimpan
                  </span>
                </div>
                <h1 className="font-fraunces text-[2.5rem] font-bold text-foreground leading-tight">
                  Bookmark Diskusi
                </h1>
                <p className="text-muted-foreground text-sm">
                  {bookmarks.length} diskusi tersimpan
                </p>
              </div>

              {/* Search */}
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari bookmark..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 space-y-6">
            {/* Category filter */}
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

            {/* Stats */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <p className="text-sm font-semibold text-foreground">Statistik Bookmark</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Bookmark</span>
                  <span className="font-medium text-foreground">{bookmarks.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Belum Dibaca</span>
                  <span className="font-medium text-status-hot">{Math.ceil(bookmarks.length * 0.3)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Terjawab</span>
                  <span className="font-medium text-status-enacted">
                    {bookmarks.filter((b) => b.status === "SOLVED").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
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
                <Link
                  href="/forum/new"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Thread Baru
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {filteredBookmarks.length > 0 ? (
              <div className="space-y-4">
                {filteredBookmarks.map((thread) => (
                  <BookmarkCard
                    key={thread.id}
                    thread={thread}
                    onRemove={handleRemoveBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum ada bookmark
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Simpan diskusi yang menarik untuk dibaca nanti. Klik ikon bookmark di thread forum untuk menyimpan.
                </p>
                <Link
                  href="/forum"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
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
