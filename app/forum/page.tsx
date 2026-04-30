import Link from "next/link";
import {
  Search,
  MessageSquare,
  Flame,
  TrendingUp,
  Clock,
  Users,
  ChevronRight,
  ThumbsUp,
  Bookmark,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type ThreadStatus = "HOT" | "PINNED" | "OPEN" | "SOLVED" | "CLOSED";
type ForumCategory =
  | "GENERAL"
  | "POLICY_DISCUSSION"
  | "EXPERT_QA"
  | "CIVIC_TECH"
  | "LEGAL_HELP"
  | "NEWS_DISCUSS";

interface Thread {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: ThreadStatus;
  category: ForumCategory;
  author: {
    name: string;
    tier: "PAKAR" | "PEJABAT" | "WARGA";
    profession: string;
    initial: string;
  };
  replies: number;
  views: number;
  upvotes: number;
  heatScore: number;
  tags: string[];
  timeAgo: string;
  lastReply?: { author: string; timeAgo: string };
  isAnswered?: boolean;
}

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

const MOCK_THREADS: Thread[] = [
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

const SORT_OPTIONS = [
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
  const status = STATUS_CONFIG[thread.status];
  const tier = TIER_CONFIG[thread.author.tier];

  return (
    <Link
      href={`/forum/${thread.slug}`}
      className="group block bg-card border border-border rounded-2xl p-6 hover:border-primary/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[0.6rem] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${status.cls}`}
          >
            {status.label}
          </span>
          <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {CATEGORY_LABELS[thread.category].label}
          </span>
          {thread.isAnswered && (
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-status-enacted bg-status-enacted/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Terjawab
            </span>
          )}
        </div>
      </div>

      <h3 className="font-fraunces text-[1.1rem] font-bold text-foreground leading-snug mb-2.5 group-hover:text-primary transition-colors">
        {thread.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {thread.excerpt}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {thread.tags.map((tag) => (
          <span
            key={tag}
            className="text-[0.65rem] text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground pb-4 border-b border-border">
        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[0.65rem] font-bold text-accent">
          {thread.author.initial}
        </div>
        <span className="font-medium text-foreground">
          {thread.author.name}
        </span>
        <span>·</span>
        <span>{thread.author.profession}</span>
        <span
          className={`ml-1 text-[0.55rem] font-black tracking-wider px-1.5 py-0.5 rounded-full ${tier.cls}`}
        >
          {thread.author.tier}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {thread.timeAgo}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">
              {thread.replies}
            </span>
            <span>balasan</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">
              {thread.views.toLocaleString()}
            </span>
            <span>dilihat</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">
              {thread.upvotes}
            </span>
          </div>
        </div>

        {thread.lastReply && (
          <div className="text-[0.65rem] text-muted-foreground">
            Balasan terakhir oleh{" "}
            <span className="font-medium text-foreground">
              {thread.lastReply.author}
            </span>{" "}
            · {thread.lastReply.timeAgo}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ForumPage() {
  const hotThreads = MOCK_THREADS.filter(
    (t) => t.status === "HOT" || t.heatScore >= 0.85,
  );
  const pinnedThreads = MOCK_THREADS.filter((t) => t.status === "PINNED");
  const allThreads = MOCK_THREADS.filter((t) => t.status !== "PINNED");

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
                  Komunitas
                </p>
                <h1 className="font-fraunces text-[2.5rem] font-bold text-foreground leading-tight">
                  Forum Diskusi
                </h1>
                <p className="text-muted-foreground text-sm max-w-xl">
                  Ruang diskusi terbuka untuk berbagi pandangan, bertanya, dan
                  berdiskusi tentang kebijakan publik, hukum, dan isu-isu sipil.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Cari thread diskusi..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
                  />
                </div>
                <Link
                  href="/forum/new"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  Thread Baru
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          <aside className="w-64 shrink-0 space-y-6">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                Kategori
              </p>
              <div className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                      c.key === "ALL"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.key !== "ALL" && (
                      <span className="text-[0.65rem] text-muted-foreground/60 group-hover:text-muted-foreground">
                        {
                          MOCK_THREADS.filter((t) => t.category === c.key)
                            .length
                        }
                      </span>
                    )}
                  </button>
                ))}
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
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      s.key === "trending"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Statistik Forum
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="font-fraunces text-2xl font-bold text-foreground">
                    {MOCK_THREADS.length}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">Thread</p>
                </div>
                <div className="text-center">
                  <p className="font-fraunces text-2xl font-bold text-foreground">
                    {MOCK_THREADS.reduce((acc, t) => acc + t.replies, 0)}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">
                    Balasan
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-fraunces text-2xl font-bold text-foreground">
                    {MOCK_THREADS.reduce(
                      (acc, t) => acc + t.views,
                      0,
                    ).toLocaleString()}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-fraunces text-2xl font-bold text-primary">
                    128
                  </p>
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
                Pastikan diskusi tetap konstruktif dan menghormati perbedaan
                pendapat.
              </p>
              <Link
                href="/forum/guidelines"
                className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
              >
                Baca panduan lengkap
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Popular tags */}
            <div>
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
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Bookmarked threads link */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-accent" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Bookmark Diskusi
                  </h2>
                </div>
                <Link
                  href="/forum/bookmarks"
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  Lihat semua
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <Link
                href="/forum/bookmarks"
                className="flex items-center gap-3 bg-accent/[0.06] border border-accent/15 rounded-2xl p-5 hover:border-accent/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                    Lihat diskusi yang Anda simpan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    4 thread tersimpan · Terakhir disimpan 2 hari lalu
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-status-hot" />
                <h2 className="text-sm font-semibold text-foreground">
                  Sedang Trending
                </h2>
                <span className="text-xs text-muted-foreground ml-1">
                  · paling aktif minggu ini
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {hotThreads.slice(0, 3).map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Semua Thread
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Menampilkan {allThreads.length} thread</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {allThreads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-4">
              <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-6 py-3 border border-border rounded-xl hover:bg-muted/50">
                Muat lebih banyak
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
