"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MessageSquare,
  Users,
  ThumbsUp,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Flag,
  Send,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { forum, ForumReply, ThreadDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type ThreadStatus = "OPEN" | "SOLVED" | "CLOSED";
type ForumCategory = "GENERAL" | "POLICY_DISCUSSION" | "EXPERT_QA" | "CIVIC_TECH" | "LEGAL_HELP" | "NEWS_DISCUSS";
type ReplyTier = "PAKAR" | "PEJABAT" | "WARGA";

interface Reply {
  id: number;
  content: string;
  author: {
    name: string;
    tier: ReplyTier;
    profession: string;
    initial: string;
  };
  upvotes: number;
  timeAgo: string;
  isBestAnswer?: boolean;
}

// (Thread shape now provided by ThreadDetail from lib/api)

const CATEGORY_LABELS: Record<ForumCategory, { label: string; description: string }> = {
  GENERAL: { label: "Umum", description: "Diskusi umum tentang platform dan kebijakan" },
  POLICY_DISCUSSION: { label: "Diskusi Kebijakan", description: "Analisis dan debat kebijakan publik" },
  EXPERT_QA: { label: "Tanya Expert", description: "Tanya jawab dengan para ahli" },
  CIVIC_TECH: { label: "Civic Tech", description: "Teknologi untuk kebaikan bersama" },
  LEGAL_HELP: { label: "Bantuan Hukum", description: "Konsultasi dan informasi hukum" },
  NEWS_DISCUSS: { label: "Diskusi Berita", description: "Bahas berita terkini" },
};

const TIER_CONFIG: Record<ReplyTier, { cls: string; label: string }> = {
  PAKAR: { cls: "bg-accent text-accent-foreground", label: "PAKAR" },
  PEJABAT: { cls: "bg-status-enacted text-white", label: "PEJABAT" },
  WARGA: { cls: "bg-muted text-muted-foreground", label: "WARGA" },
};

const MOCK_THREAD_LEGACY: unknown = {
  id: 2,
  slug: "diskusi-ruu-perlindungan-data-pribadi",
  title: "Diskusi: Revisi RUU Perlindungan Data Pribadi yang sedang berjalan",
  content: `DPR sedang membahas revisi RUU Perlindungan Data Pribadi (PDP). Berdasarkan draf terbaru yang beredar, ada beberapa poin penting yang perlu kita perhatikan:

1. **Kewenangan Pengawasan**: RUU memberikan kewenangan yang lebih luas kepada otoritas pengawas data pribadi, termasuk hak untuk melakukan audit mendadak terhadap perusahaan teknologi.

2. **Sanksi Pidana**: Ada penambahan ancaman pidana hingga 5 tahun untuk pelanggaran data pribadi yang disengaja dan berskala besar.

3. **Data Biometrik**: Kategori data pribadi sensitif diperluas untuk mencakup data biometrik seperti sidik jari dan pengenalan wajah.

4. **Transfer Data Lintas Batas**: Aturan transfer data ke luar negeri diperketat, memerlukan persetujuan eksplisit dari otoritas.

Menurut teman-teman, apakah revisi ini sudah cukup untuk melindungi data pribadi masyarakat? Atau ada aspek lain yang perlu diperhatikan?

Saya pribadi khawatir dengan poin #3 tentang kewenangan audit mendadak. Bagaimana memastikan hal ini tidak disalahgunakan?`,
  status: "OPEN",
  category: "POLICY_DISCUSSION",
  author: {
    name: "Budi Prakoso",
    tier: "PAKAR",
    profession: "Peneliti Kebijakan Digital",
    initial: "B",
  },
  views: 4520,
  upvotes: 234,
  tags: ["UU-PDP", "privasi", "DPR", "revisi", "data-pribadi"],
  createdAt: "5 jam lalu",
  isBookmarked: true,
  replies: [
    {
      id: 1,
      content: `Poin tentang data biometrik sangat penting. Saat ini banyak aplikasi di Indonesia yang menggunakan verifikasi wajah tanpa standar keamanan yang jelas. Revisi ini seharusnya juga mengatur tentang penghapusan data (right to erasure) ketika pengguna tidak lagi menggunakan layanan.

Selain itu, perlu ada mekanisme pelaporan pelanggaran yang mudah diakses oleh masyarakat umum, bukan hanya untuk yang paham teknologi.`,
      author: {
        name: "Dr. Sari Wijaya",
        tier: "PAKAR",
        profession: "Akademisi Hukum",
        initial: "S",
      },
      upvotes: 89,
      timeAgo: "4 jam lalu",
      isBestAnswer: true,
    },
    {
      id: 2,
      content: `Setuju dengan catatan tentang kewenangan audit. Menurut saya, perlu ada checks and balances - mungkin melalui mekanisme persetujuan dari komite independen sebelum audit mendadak dilakukan. Ini untuk mencegah potensi penyalahgunaan kekuasaan.

Yang juga perlu diperhatikan adalah definisi "pelanggaran berskala besar". Perlu ada batasan yang jelas agar tidak terlalu subjektif.`,
      author: {
        name: "Ahmad Fauzi",
        tier: "PAKAR",
        profession: "Pengacara Media",
        initial: "A",
      },
      upvotes: 56,
      timeAgo: "3 jam lalu",
    },
    {
      id: 3,
      content: `Saya melihat dari sisi implementasi teknis. Banyak startup lokal yang mungkin kesulitan menyesuaikan diri dengan regulasi yang terlalu ketat. Perlu ada fase transisi yang cukup panjang (minimal 2 tahun) dan pendampingan teknis untuk UMKM.

Jangan sampai regulasi yang baik justru membunuh inovasi lokal.`,
      author: {
        name: "Dian Kusuma",
        tier: "WARGA",
        profession: "Software Engineer",
        initial: "D",
      },
      upvotes: 34,
      timeAgo: "2 jam lalu",
    },
    {
      id: 4,
      content: `Perspektif dari pengguna biasa: saya setuju revisi ini penting, tapi yang paling krusial adalah EDUKASI ke masyarakat. Banyak yang masih tidak sadar data pribadinya bisa disalahgunakan.

Bagaimana caranya membuat masyarakat peduli dengan privasi data mereka?`,
      author: {
        name: "Rina Melati",
        tier: "WARGA",
        profession: "Guru",
        initial: "R",
      },
      upvotes: 28,
      timeAgo: "1 jam lalu",
    },
  ],
};

const RELATED_THREADS = [
  {
    id: 1,
    slug: "perlindungan-data-biometrik-uu-pdp",
    title: "Perlindungan Data Biometrik dalam UU PDP",
    replies: 47,
    views: 2340,
  },
  {
    id: 3,
    slug: "transparansi-anggaran-pemda",
    title: "Standar Transparansi Anggaran Pemerintah Daerah",
    replies: 78,
    views: 8920,
  },
];

function ReplyCard({
  reply,
  isOwner,
  onUpvote,
  canVote,
}: {
  reply: ForumReply;
  isOwner: boolean;
  onUpvote: () => void;
  canVote: boolean;
}) {
  const tier = TIER_CONFIG[reply.author.tier as ReplyTier] ?? TIER_CONFIG.WARGA;

  return (
    <div
      className={`bg-card border rounded-2xl p-6 ${
        reply.isBestAnswer
          ? "border-status-enacted/50 bg-status-enacted/[0.02]"
          : "border-border"
      }`}
    >
      {/* Best Answer Badge */}
      {reply.isBestAnswer && (

        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-status-enacted/20">
          <CheckCircle2 className="w-4 h-4 text-status-enacted" />
          <span className="text-xs font-semibold text-status-enacted">
            Jawaban Terbaik
          </span>
        </div>
      )}

      {/* Author */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
            {reply.author.initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-sm">
                {reply.author.name}
              </span>
              <span className={`text-[0.6rem] font-black tracking-wider px-1.5 py-0.5 rounded-full ${tier.cls}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{reply.author.profession}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{reply.timeAgo ?? ""}</span>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-foreground mb-4 whitespace-pre-line">
        {reply.content}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={onUpvote}
            disabled={!canVote}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              reply.userUpvoted
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${reply.userUpvoted ? "fill-current" : ""}`} />
            <span>{reply.upvotes}</span>
            <span>Suka</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && !reply.isBestAnswer && (
            <button className="text-xs text-status-enacted hover:underline">
              Tandai sebagai jawaban terbaik
            </button>
          )}
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ForumDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replySort, setReplySort] = useState<"newest" | "oldest" | "likes">("newest");

  useEffect(() => {
    setLoading(true);
    forum
      .detail(slug, replySort)
      .then(setThread)
      .catch((e) => setError(e instanceof Error ? e.message : "Thread tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [slug, replySort]);

  const handleBookmark = async () => {
    if (!thread || !user) return;
    try {
      const r = await forum.bookmark(slug, !thread.isBookmarked);
      setThread({ ...thread, isBookmarked: r.bookmarked });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpvoteThread = async () => {
    if (!thread || !user) return;
    const next = !thread.userUpvoted;
    setThread({
      ...thread,
      userUpvoted: next,
      upvotes: thread.upvotes + (next ? 1 : -1),
    });
    try {
      await forum.upvoteThread(slug, next);
    } catch (e) {
      console.error(e);
      setThread((prev) =>
        prev
          ? { ...prev, userUpvoted: !next, upvotes: prev.upvotes + (next ? -1 : 1) }
          : prev,
      );
    }
  };

  const handleUpvoteReply = async (replyId: number) => {
    if (!thread || !user) return;
    const target = thread.replies.find((r) => r.id === replyId);
    if (!target) return;
    const next = !target.userUpvoted;
    setThread({
      ...thread,
      replies: thread.replies.map((r) =>
        r.id === replyId
          ? { ...r, userUpvoted: next, upvotes: r.upvotes + (next ? 1 : -1) }
          : r,
      ),
    });
    try {
      await forum.upvoteReply(replyId, next);
    } catch (e) {
      console.error(e);
      setThread((prev) =>
        prev
          ? {
              ...prev,
              replies: prev.replies.map((r) =>
                r.id === replyId
                  ? { ...r, userUpvoted: !next, upvotes: r.upvotes + (next ? -1 : 1) }
                  : r,
              ),
            }
          : prev,
      );
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !thread) return;
    setIsSubmitting(true);
    try {
      const reply = await forum.reply(slug, replyText);
      setThread({ ...thread, replies: [...thread.replies, reply] });
      setReplyText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-6">
          <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }
  if (error || !thread) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-6 text-center">
          <p className="text-status-rejected">{error ?? "Thread tidak ditemukan."}</p>
          <Link href="/forum" className="text-sm text-primary hover:underline">
            Kembali ke forum
          </Link>
        </div>
      </div>
    );
  }

  const tier = TIER_CONFIG[thread.author.tier as ReplyTier] ?? TIER_CONFIG.WARGA;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/forum" className="hover:text-foreground transition-colors">
                Forum
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">
                {CATEGORY_LABELS[thread.category as ForumCategory]?.label ?? thread.category}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
            {/* Main content */}
            <div className="space-y-6">
              {/* Thread header */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[thread.category as ForumCategory]?.label ?? thread.category}
                  </span>
                  {thread.status === "SOLVED" && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-status-enacted bg-status-enacted/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Terjawab
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-fraunces text-[1.75rem] font-bold text-foreground leading-tight">
                  {thread.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 pb-5 border-b border-border">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-base font-bold text-accent">
                    {thread.author.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {thread.author.name}
                      </span>
                      <span className={`text-[0.6rem] font-black tracking-wider px-1.5 py-0.5 rounded-full ${tier.cls}`}>
                        {tier.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{thread.author.profession}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{thread.timeAgo}</span>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line leading-relaxed">
                  {thread.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {thread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-accent/70 bg-accent/8 px-3 py-1 rounded-full font-medium hover:bg-accent/15 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleUpvoteThread}
                      disabled={!user}
                      className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        thread.userUpvoted ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${thread.userUpvoted ? "fill-current" : ""}`} />
                      <span>{thread.upvotes} Suka</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.replies.length} Balasan</span>
                    </button>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{thread.views.toLocaleString()} dilihat</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmark}
                      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${
                        thread.isBookmarked
                          ? "bg-accent/10 border-accent/30 text-accent"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${thread.isBookmarked ? "fill-current" : ""}`} />
                      {thread.isBookmarked ? "Tersimpan" : "Simpan"}
                    </button>
                    <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                      <Share2 className="w-4 h-4" />
                      Bagikan
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    {thread.replies.length} Balasan
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Urutkan:</span>
                    <select
                      value={replySort}
                      onChange={(e) => setReplySort(e.target.value as typeof replySort)}
                      className="bg-card border border-border rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="likes">Paling Suka</option>
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {thread.replies.map((reply) => (
                    <ReplyCard
                      key={reply.id}
                      reply={reply}
                      isOwner={false}
                      onUpvote={() => handleUpvoteReply(reply.id)}
                      canVote={!!user}
                    />
                  ))}
                </div>
              </div>

              {/* Reply form */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  Tambah Balasan
                </h3>
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Bagikan pendapat atau tanggapan Anda..."
                    className="w-full min-h-[120px] px-4 py-3 text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Tetap sopan dan konstruktif dalam berdiskusi
                    </p>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSubmitting}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Kirim Balasan
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 sticky top-24">
              {/* Thread stats */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">Statistik Thread</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-muted/40 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="font-fraunces text-xl font-bold text-foreground">
                      {thread.replies.length}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground">Balasan</p>
                  </div>
                  <div className="text-center p-3 bg-muted/40 rounded-xl">
                    <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="font-fraunces text-xl font-bold text-foreground">
                      {thread.views.toLocaleString()}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center p-3 bg-muted/40 rounded-xl">
                    <ThumbsUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="font-fraunces text-xl font-bold text-foreground">
                      {thread.upvotes}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground">Suka</p>
                  </div>
                  <div className="text-center p-3 bg-muted/40 rounded-xl">
                    <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="font-fraunces text-xl font-bold text-foreground">{thread.timeAgo.split(" ")[0]}</p>
                    <p className="text-[0.65rem] text-muted-foreground">Dibuat</p>
                  </div>
                </div>
              </div>

              {/* Related threads */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">Thread Terkait</p>
                <div className="space-y-3">
                  {RELATED_THREADS.map((related) => (
                    <Link
                      key={related.id}
                      href={`/forum/${related.slug}`}
                      className="block group"
                    >
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {related.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {related.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {related.views.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-accent/[0.06] border border-accent/15 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4 text-accent" />
                  Panduan Diskusi
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Tetap sopan dan hormati perbedaan pendapat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Beri argumen yang substantif dan konstruktif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Hindari hoax dan informasi yang tidak terverifikasi</span>
                  </li>
                </ul>
              </div>

              {/* Report */}
              <button className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2">
                <Flag className="w-3.5 h-3.5" />
                Laporkan thread ini
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
