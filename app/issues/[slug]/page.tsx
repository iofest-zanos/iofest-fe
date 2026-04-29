"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Share2,
  Users,
  MessageSquare,
  Vote,
  Scale,
  FileText,
  Newspaper,
  ChevronRight,
  Wifi,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flag,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

// ── Static mock data ──

const ISSUE = {
  slug: "perlindungan-data-biometrik-uu-pdp",
  title: "Perlindungan Data Biometrik dalam UU PDP",
  description:
    "UU Pelindungan Data Pribadi No. 27/2022 masih belum memiliki aturan implementasi spesifik untuk data biometrik. Data biometrik—sidik jari, wajah, iris mata—bersifat unik dan permanen. Perlu ada aturan turunan yang mengatur standar perlindungan, kewajiban pengendali data, dan konsekuensi pelanggaran yang proporsional.",
  status: "HOT" as const,
  category: "Hak Digital",
  scope: "Nasional",
  author: {
    name: "Dr. Sari Wijaya",
    tier: "PAKAR" as const,
    profession: "Akademisi Hukum · Universitas Tarumanagara",
    initial: "S",
  },
  participants: 156,
  stances: 47,
  votes: 4231,
  createdAt: "25 April 2026",
  tags: ["privasi", "data-pribadi", "UU-PDP", "biometrik"],
};

const STANCES = [
  {
    id: 1,
    content:
      "Data biometrik harus mendapat perlindungan tingkat tertinggi karena tidak dapat diganti seperti password.",
    author: { name: "Dr. Sari Wijaya", tier: "PAKAR" as const, profession: "Akademisi Hukum", initial: "S" },
    agreeCount: 89,
    disagreeCount: 12,
    abstainCount: 8,
    totalVotes: 109,
    isBridge: true,
    isDivisive: false,
    qualityScore: 0.92,
    timeAgo: "2 jam lalu",
  },
  {
    id: 2,
    content:
      "Penegakan UU PDP harus disertai sanksi pidana nyata, bukan hanya denda administratif yang dianggap remeh perusahaan besar.",
    author: { name: "Pak Joko Santoso", tier: "PAKAR" as const, profession: "Aktivis NGO Anti-Korupsi", initial: "J" },
    agreeCount: 62,
    disagreeCount: 41,
    abstainCount: 15,
    totalVotes: 118,
    isBridge: false,
    isDivisive: true,
    qualityScore: 0.85,
    timeAgo: "4 jam lalu",
  },
  {
    id: 3,
    content:
      "Regulasi yang terlalu ketat terhadap data biometrik justru menghambat inovasi fintech dan healthtech yang bermanfaat bagi masyarakat.",
    author: { name: "Budi Prakoso, M.M.", tier: "PAKAR" as const, profession: "Peneliti Kebijakan Digital", initial: "B" },
    agreeCount: 44,
    disagreeCount: 58,
    abstainCount: 20,
    totalVotes: 122,
    isBridge: false,
    isDivisive: true,
    qualityScore: 0.78,
    timeAgo: "6 jam lalu",
  },
  {
    id: 4,
    content:
      "Anak di bawah umur perlu mendapat perlindungan data biometrik yang lebih ketat dibanding orang dewasa.",
    author: { name: "Mbak Lia Rahayu", tier: "PAKAR" as const, profession: "Jurnalis Investigasi", initial: "L" },
    agreeCount: 102,
    disagreeCount: 8,
    abstainCount: 12,
    totalVotes: 122,
    isBridge: true,
    isDivisive: false,
    qualityScore: 0.94,
    timeAgo: "8 jam lalu",
  },
];

const BRIDGE_STANCES = STANCES.filter((s) => s.isBridge);
const DIVISIVE_STANCES = STANCES.filter((s) => s.isDivisive);

const LEGAL_REFS = [
  { id: "uu-27-2022", type: "UU", number: "27/2022", title: "Pelindungan Data Pribadi", relevance: 0.94 },
  { id: "uu-11-2008", type: "UU", number: "11/2008", title: "Informasi dan Transaksi Elektronik", relevance: 0.78 },
  { id: "pp-71-2019", type: "PP", number: "71/2019", title: "Penyelenggaraan Sistem dan Transaksi Elektronik", relevance: 0.65 },
];

const NEWS = [
  { id: 1, title: "BSSN Minta Aturan Turunan UU PDP Segera Diselesaikan", source: "Kompas", timeAgo: "3 jam lalu" },
  { id: 2, title: "Kebocoran Data Nasabah BRI Life: Siapa yang Bertanggung Jawab?", source: "Tempo", timeAgo: "1 hari lalu" },
  { id: 3, title: "DPR Bahas RPP Data Pribadi: Biometrik Jadi Poin Sengketa", source: "Detik", timeAgo: "2 hari lalu" },
];

const STATUS_HISTORY = [
  { status: "HOT", label: "Trending", date: "27 Apr 2026", note: "156 partisipan, heat score 0.92", auto: true },
  { status: "OPEN", label: "Diskusi Terbuka", date: "25 Apr 2026", note: "Dibuka untuk deliberasi publik", auto: true },
  { status: "PROPOSED", label: "Diajukan", date: "25 Apr 2026", note: "Diajukan oleh Dr. Sari Wijaya", auto: false },
];

// ── Opinion Map SVG ──

const CLUSTER_A_POINTS: [number, number][] = [
  [105, 72], [118, 65], [128, 75], [112, 84], [122, 70],
  [100, 80], [132, 68], [115, 92], [125, 60], [108, 62],
  [130, 85], [96, 88],
];

const CLUSTER_B_POINTS: [number, number][] = [
  [248, 68], [260, 62], [272, 72], [255, 80], [265, 72],
  [250, 88], [270, 58], [258, 95], [275, 78], [242, 75],
];

const CLUSTER_C_POINTS: [number, number][] = [
  [172, 152], [188, 145], [162, 160], [202, 150], [178, 165],
  [168, 140], [198, 162], [185, 135],
];

const YOU_POSITION: [number, number] = [258, 95];

function OpinionMap() {
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Peta Opini Real-time</p>
          <p className="text-xs text-muted-foreground">
            Posisi {ISSUE.participants} partisipan berdasarkan pola voting mereka
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
          <Wifi className="w-3 h-3 text-status-open" />
          Live
        </div>
      </div>

      {/* SVG Map */}
      <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden">
        <svg
          viewBox="0 0 370 230"
          className="w-full"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.08" />
            </pattern>
          </defs>
          <rect width="370" height="230" fill="url(#grid)" />

          {/* Axis lines */}
          <line x1="185" y1="10" x2="185" y2="220" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="4 4" />
          <line x1="20" y1="115" x2="350" y2="115" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="4 4" />

          {/* Cluster A blobs (teal) */}
          <ellipse cx="113" cy="77" rx="40" ry="32" fill="var(--color-cluster-0)" fillOpacity="0.08" />
          {CLUSTER_A_POINTS.map(([x, y], i) => (
            <circle
              key={`a-${i}`}
              cx={x} cy={y} r="4"
              fill="var(--color-cluster-0)"
              fillOpacity={hoveredCluster === null || hoveredCluster === 0 ? 0.75 : 0.15}
              className="transition-all duration-200"
            />
          ))}
          {/* Cluster A label */}
          <text x="72" y="118" fill="var(--color-cluster-0)" fillOpacity="0.7" fontSize="9" fontWeight="600">
            Privasi Ketat
          </text>
          <text x="72" y="129" fill="var(--color-cluster-0)" fillOpacity="0.5" fontSize="8">
            67 partisipan
          </text>

          {/* Cluster B blobs (orange) */}
          <ellipse cx="258" cy="76" rx="38" ry="30" fill="var(--color-cluster-1)" fillOpacity="0.08" />
          {CLUSTER_B_POINTS.map(([x, y], i) => (
            <circle
              key={`b-${i}`}
              cx={x} cy={y} r="4"
              fill="var(--color-cluster-1)"
              fillOpacity={hoveredCluster === null || hoveredCluster === 1 ? 0.75 : 0.15}
              className="transition-all duration-200"
            />
          ))}
          {/* Cluster B label */}
          <text x="235" y="118" fill="var(--color-cluster-1)" fillOpacity="0.7" fontSize="9" fontWeight="600">
            Pro-Inovasi
          </text>
          <text x="235" y="129" fill="var(--color-cluster-1)" fillOpacity="0.5" fontSize="8">
            54 partisipan
          </text>

          {/* Cluster C blobs (purple) */}
          <ellipse cx="183" cy="152" rx="36" ry="24" fill="var(--color-cluster-2)" fillOpacity="0.08" />
          {CLUSTER_C_POINTS.map(([x, y], i) => (
            <circle
              key={`c-${i}`}
              cx={x} cy={y} r="4"
              fill="var(--color-cluster-2)"
              fillOpacity={hoveredCluster === null || hoveredCluster === 2 ? 0.75 : 0.15}
              className="transition-all duration-200"
            />
          ))}
          {/* Cluster C label */}
          <text x="158" y="186" fill="var(--color-cluster-2)" fillOpacity="0.7" fontSize="9" fontWeight="600">
            Moderat
          </text>
          <text x="158" y="197" fill="var(--color-cluster-2)" fillOpacity="0.5" fontSize="8">
            35 partisipan
          </text>

          {/* YOU marker */}
          <circle
            cx={YOU_POSITION[0]} cy={YOU_POSITION[1]}
            r="7"
            fill="var(--color-cluster-1)"
            stroke="white"
            strokeWidth="2.5"
          />
          <text x={YOU_POSITION[0]} y={YOU_POSITION[1] - 12} fill="var(--color-foreground)" fontSize="8" fontWeight="700" textAnchor="middle">
            ANDA
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        {[
          { cls: "bg-cluster-0", label: "Privasi Ketat", count: 67 },
          { cls: "bg-cluster-1", label: "Pro-Inovasi", count: 54 },
          { cls: "bg-cluster-2", label: "Moderat", count: 35 },
        ].map(({ cls, label, count }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cls}`} />
            <span className="text-xs text-muted-foreground">
              {label} <span className="font-medium text-foreground">({count})</span>
            </span>
          </div>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">
          Score kohesi: <span className="font-medium text-foreground">0.42</span> (sedang)
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground">Tampilkan:</span>
        {["Semua", "Hanya Expert", "Hanya Pejabat"].map((f, i) => (
          <button
            key={f}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              i === 0
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tabs ──

type TabId = "pernyataan" | "peta-opini" | "hukum" | "brief" | "berita";

const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "pernyataan", label: "Pernyataan", Icon: MessageSquare },
  { id: "peta-opini", label: "Peta Opini", Icon: Vote },
  { id: "hukum", label: "Konteks Hukum", Icon: Scale },
  { id: "brief", label: "Brief Kebijakan", Icon: FileText },
  { id: "berita", label: "Berita Terkait", Icon: Newspaper },
];

// ── Sub-components ──

function VoteButton({
  label,
  type,
  active,
  count,
  onClick,
}: {
  label: string;
  type: "agree" | "abstain" | "disagree";
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const styles = {
    agree: {
      idle: "bg-vote-agree-bg text-vote-agree hover:bg-vote-agree hover:text-white",
      active: "bg-vote-agree text-white",
    },
    abstain: {
      idle: "bg-vote-abstain-bg text-vote-abstain hover:bg-vote-abstain hover:text-foreground",
      active: "bg-vote-abstain text-foreground",
    },
    disagree: {
      idle: "bg-vote-disagree-bg text-vote-disagree hover:bg-vote-disagree hover:text-white",
      active: "bg-vote-disagree text-white",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
        active ? styles[type].active : styles[type].idle
      }`}
    >
      {label}
      {active && <span className="ml-1 text-xs opacity-75">({count})</span>}
    </button>
  );
}

function StanceCard({
  stance,
  onVote,
  userVote,
}: {
  stance: (typeof STANCES)[0];
  onVote: (value: "agree" | "abstain" | "disagree" | null) => void;
  userVote: "agree" | "abstain" | "disagree" | null;
}) {
  const totalVotes = stance.agreeCount + stance.disagreeCount + stance.abstainCount;
  const agreePercent = Math.round((stance.agreeCount / totalVotes) * 100);
  const disagreePercent = Math.round((stance.disagreeCount / totalVotes) * 100);
  const tier = stance.author.tier;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      {/* Badge row */}
      <div className="flex items-center gap-2">
        {stance.isBridge && (
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            BRIDGE
          </span>
        )}
        {stance.isDivisive && (
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold tracking-wider text-status-hot bg-status-hot/10 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            DIVISIF
          </span>
        )}
        <span className="ml-auto text-[0.65rem] text-muted-foreground">
          Kualitas AI:{" "}
          <span className="font-medium text-foreground">
            {Math.round(stance.qualityScore * 100)}%
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="flex items-start gap-4">
        <p className="flex-1 text-[1rem] text-foreground font-medium leading-relaxed">
          &ldquo;{stance.content}&rdquo;
        </p>
        <span
          className={`shrink-0 text-[0.6rem] font-black tracking-wider px-2 py-1 rounded-full ${
            tier === "PAKAR"
              ? "bg-accent text-accent-foreground"
              : tier === "PEJABAT"
              ? "bg-status-enacted text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {tier}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-[0.7rem] font-bold text-accent">
          {stance.author.initial}
        </div>
        <span className="font-medium text-foreground">{stance.author.name}</span>
        <span>·</span>
        <span>{stance.author.profession}</span>
        <span className="ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {stance.timeAgo}
        </span>
      </div>

      {/* Vote results bar */}
      {userVote && (
        <div className="space-y-1.5">
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-vote-agree rounded-l-full"
              style={{ width: `${agreePercent}%` }}
            />
            <div
              className="h-full bg-vote-disagree rounded-r-full"
              style={{ width: `${disagreePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[0.65rem] text-muted-foreground">
            <span className="text-vote-agree font-medium">{agreePercent}% setuju ({stance.agreeCount})</span>
            <span className="text-vote-disagree font-medium">{disagreePercent}% tidak setuju ({stance.disagreeCount})</span>
          </div>
        </div>
      )}

      {/* Vote buttons */}
      <div className="flex gap-2">
        <VoteButton
          label="Tidak Setuju"
          type="disagree"
          active={userVote === "disagree"}
          count={stance.disagreeCount}
          onClick={() => onVote(userVote === "disagree" ? null : "disagree")}
        />
        <VoteButton
          label="Abstain"
          type="abstain"
          active={userVote === "abstain"}
          count={stance.abstainCount}
          onClick={() => onVote(userVote === "abstain" ? null : "abstain")}
        />
        <VoteButton
          label="Setuju"
          type="agree"
          active={userVote === "agree"}
          count={stance.agreeCount}
          onClick={() => onVote(userVote === "agree" ? null : "agree")}
        />
      </div>
    </div>
  );
}

// ── Main page ──

export default function DeliberationPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pernyataan");
  const [votes, setVotes] = useState<Record<number, "agree" | "abstain" | "disagree" | null>>({});
  const [stanceText, setStanceText] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const votedCount = Object.values(votes).filter((v) => v !== null).length;
  const progress = (votedCount / ISSUE.stances) * 100;

  function handleVote(stanceId: number, value: "agree" | "abstain" | "disagree" | null) {
    setVotes((prev) => ({ ...prev, [stanceId]: value }));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <Link
              href="/issues"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Daftar Isu
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Issue header */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
            {/* Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.65rem] font-black tracking-[0.1em] uppercase bg-status-hot text-white px-3 py-1 rounded-full">
                Trending
              </span>
              <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {ISSUE.category}
              </span>
              <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {ISSUE.scope}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border font-medium transition-all ${
                    subscribed
                      ? "bg-primary/10 border-primary/25 text-primary"
                      : "border-border text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  {subscribed ? "Berlangganan" : "Ikuti Isu"}
                </button>
                <button className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  Bagikan
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-fraunces text-[2rem] font-bold text-foreground leading-tight">
              {ISSUE.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{ISSUE.description}</p>

            {/* Author + stats */}
            <div className="flex items-center gap-6 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
                  {ISSUE.author.initial}
                </div>
                <div>
                  <span className="font-medium text-foreground">{ISSUE.author.name}</span>
                  <span className="text-muted-foreground"> · {ISSUE.author.profession}</span>
                </div>
                <span className="text-[0.6rem] font-black tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  {ISSUE.author.tier}
                </span>
              </div>
              <div className="flex items-center gap-5 ml-auto text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{ISSUE.participants}</span>
                  <span>partisipan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{ISSUE.stances}</span>
                  <span>pernyataan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{ISSUE.votes.toLocaleString()}</span>
                  <span>vote</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ISSUE.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {ISSUE.tags.map((tag) => (
                <span key={tag} className="text-[0.65rem] text-accent/70 bg-accent/8 px-2.5 py-0.5 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-border">
            <div className="flex items-center gap-1 -mb-px overflow-x-auto">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="grid grid-cols-[1fr_300px] gap-8 items-start">
            {/* Main content */}
            <div>
              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress menilai pernyataan</span>
                      <span className="font-medium text-foreground">
                        {votedCount} / {ISSUE.stances} pernyataan dinilai
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {votedCount >= 7 && (
                      <p className="text-xs text-accent flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Anda sudah masuk dalam peta opini!
                      </p>
                    )}
                  </div>

                  {/* Stance cards */}
                  <div className="space-y-4">
                    {STANCES.map((stance) => (
                      <StanceCard
                        key={stance.id}
                        stance={stance}
                        userVote={votes[stance.id] ?? null}
                        onVote={(value) => handleVote(stance.id, value)}
                      />
                    ))}
                  </div>

                  {/* Write stance form */}
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <p className="text-sm font-semibold text-foreground">
                        Tulis Pernyataan Baru
                      </p>
                      <span className="ml-auto text-[0.65rem] text-muted-foreground">
                        Hanya untuk Citizen dan Expert
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={stanceText}
                        onChange={(e) =>
                          setStanceText(e.target.value.slice(0, 280))
                        }
                        placeholder="Tuliskan pernyataan Anda secara singkat dan substantif... (maks. 280 karakter)"
                        className="w-full min-h-[100px] p-4 text-sm bg-muted/30 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60 leading-relaxed"
                      />
                      <span
                        className={`absolute bottom-3 right-3 text-[0.65rem] font-mono ${
                          stanceText.length > 240
                            ? stanceText.length >= 280
                              ? "text-status-rejected"
                              : "text-status-hot"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stanceText.length}/280
                      </span>
                    </div>
                    {stanceText.length > 20 && (
                      <div className="flex items-center gap-2 text-xs text-accent bg-accent/8 px-3 py-2 rounded-lg">
                        <Sparkles className="w-3 h-3" />
                        AI quality check: <span className="font-medium">Cukup substantif</span>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        disabled={stanceText.length < 20}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20"
                      >
                        Posting Pernyataan
                      </button>
                    </div>
                  </div>

                  {/* Bridge statements */}
                  {BRIDGE_STANCES.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          Titik Temu Lintas Kubu
                        </p>
                        <span className="text-xs text-muted-foreground">
                          · pernyataan yang disetujui mayoritas dari semua kelompok
                        </span>
                      </div>
                      <div className="space-y-2">
                        {BRIDGE_STANCES.map((stance) => (
                          <div
                            key={stance.id}
                            className="bg-primary/[0.04] border border-primary/15 rounded-xl p-4 space-y-2"
                          >
                            <div className="flex items-start gap-3">
                              <span className="shrink-0 mt-0.5 text-[0.6rem] font-black tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                BRIDGE
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">
                                &ldquo;{stance.content}&rdquo;
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((stance.agreeCount / stance.totalVotes) * 100)}% setuju ·{" "}
                              <span className="text-primary/70">konsensus lintas kelompok</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divisive statements */}
                  {DIVISIVE_STANCES.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-status-hot" />
                        <p className="text-sm font-semibold text-foreground">
                          Titik Divisif
                        </p>
                        <span className="text-xs text-muted-foreground">
                          · pernyataan dengan opini paling terpolarisasi
                        </span>
                      </div>
                      <div className="space-y-2">
                        {DIVISIVE_STANCES.map((stance) => (
                          <div
                            key={stance.id}
                            className="bg-status-hot/[0.04] border border-status-hot/15 rounded-xl p-4 space-y-2"
                          >
                            <div className="flex items-start gap-3">
                              <span className="shrink-0 mt-0.5 text-[0.6rem] font-black tracking-wider text-status-hot bg-status-hot/10 px-2 py-0.5 rounded-full">
                                DIVISIF
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">
                                &ldquo;{stance.content}&rdquo;
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Kelompok A:{" "}
                              <span className="font-medium">89% setuju</span> ·
                              Kelompok B:{" "}
                              <span className="font-medium">21% setuju</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "peta-opini" && <OpinionMap />}

              {activeTab === "hukum" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <p className="text-sm text-muted-foreground">
                      Regulasi relevan ditemukan oleh AI melalui RAG terhadap corpus 200+ peraturan
                    </p>
                  </div>
                  {LEGAL_REFS.map((ref) => (
                    <div
                      key={ref.id}
                      className="bg-card border border-border rounded-2xl p-5 hover:border-accent/25 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <Scale className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[0.65rem] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                              {ref.type} {ref.number}
                            </span>
                            <span className="text-[0.65rem] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">
                              Relevansi {Math.round(ref.relevance * 100)}%
                            </span>
                          </div>
                          <p className="font-medium text-foreground text-sm">{ref.title}</p>
                          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${ref.relevance * 100}%` }}
                            />
                          </div>
                        </div>
                        <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-accent/[0.05] border border-accent/15 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Catatan AI:</span> Isu
                      kebocoran data sudah diatur sebagian di UU 27/2022. Pertimbangkan untuk
                      fokus pada aspek penegakan dan aturan turunan yang masih kosong.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "brief" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <p className="text-xs text-muted-foreground">
                        Dihasilkan AI · Gemini 3 Flash · 27 April 2026 · Versi 2
                      </p>
                    </div>
                    <button className="text-xs text-primary hover:underline">Unduh PDF</button>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                    <div className="pb-4 border-b border-border">
                      <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                        Executive Brief Kebijakan
                      </p>
                      <h2 className="font-fraunces text-2xl font-bold text-foreground">
                        {ISSUE.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Hasil deliberasi dari 156 partisipan · {ISSUE.stances} pernyataan ·{" "}
                        {ISSUE.votes.toLocaleString()} vote
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">
                        Ringkasan Eksekutif
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        Deliberasi terhadap isu perlindungan data biometrik dalam UU PDP mengungkap
                        kekhawatiran yang luas di kalangan partisipan. Mayoritas menyepakati
                        perlunya perlindungan khusus untuk data biometrik yang bersifat permanen dan
                        tidak dapat diganti. Terdapat perbedaan tajam mengenai pendekatan sanksi dan
                        dampak regulasi terhadap inovasi digital.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">
                        Titik Konsensus (Bridge Statements)
                      </p>
                      {BRIDGE_STANCES.map((s) => (
                        <div key={s.id} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-status-enacted mt-0.5 shrink-0" />
                          <p className="text-foreground">{s.content}</p>
                          <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round((s.agreeCount / s.totalVotes) * 100)}% setuju
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">
                        Rekomendasi Kebijakan
                      </p>
                      <ol className="space-y-2">
                        {[
                          "Terbitkan PP khusus yang mendefinisikan standar keamanan minimum untuk pengolahan data biometrik dalam 6 bulan.",
                          "Tetapkan kewajiban notifikasi pelanggaran data biometrik dalam 48 jam kepada BSSN dan subjek data.",
                          "Buat kategori sanksi yang membedakan data biometrik dari data pribadi umum, dengan sanksi pidana untuk pelanggaran yang disengaja.",
                        ].map((rec, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[0.65rem] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            {rec}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "berita" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Diperbarui otomatis · berita relevan dari sumber terpercaya
                  </p>
                  {NEWS.map((article) => (
                    <div
                      key={article.id}
                      className="bg-card border border-border rounded-2xl p-5 hover:border-accent/25 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Newspaper className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span className="font-medium">{article.source}</span>
                            <span>·</span>
                            <span>{article.timeAgo}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 sticky top-24">
              {/* Status lifecycle */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">Status Isu</p>
                <div className="space-y-3">
                  {STATUS_HISTORY.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        i === 0 ? "bg-status-hot" : "bg-border"
                      }`} />
                      <div>
                        <p className={`text-xs font-semibold ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.label}
                        </p>
                        <p className="text-[0.65rem] text-muted-foreground mt-0.5">{item.date}</p>
                        <p className="text-[0.65rem] text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Statistik</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Partisipan", value: "156", icon: Users },
                    { label: "Pernyataan", value: "47", icon: MessageSquare },
                    { label: "Total Vote", value: "4.231", icon: Vote },
                    { label: "Kubu Opini", value: "3", icon: Flag },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-muted/40 rounded-xl p-3 text-center">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                      <p className="font-fraunces text-lg font-bold text-foreground leading-none">{value}</p>
                      <p className="text-[0.6rem] text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal refs summary */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Referensi Hukum</p>
                <div className="space-y-2">
                  {LEGAL_REFS.map((ref) => (
                    <div key={ref.id} className="flex items-center gap-2 text-xs">
                      <Scale className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-muted-foreground">
                        {ref.type} {ref.number} — {ref.title}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("hukum")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Lihat semua <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Report */}
              <button className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2">
                <Flag className="w-3.5 h-3.5" />
                Laporkan isu ini
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
