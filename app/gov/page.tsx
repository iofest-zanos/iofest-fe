"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Flame,
  Clock,
  Users,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Edit3,
  Shield,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  MapPin,
  Calendar,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type IssueStatus = "HOT" | "OPEN" | "PROPOSED" | "FORWARDED" | "ENACTED" | "REJECTED" | "LEGISLATION";
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
  createdAt: string;
  forwardedTo?: string;
  enactedDate?: string;
  notes?: string;
}

const STATUS_CONFIG: Record<IssueStatus, { label: string; cls: string; description: string }> = {
  HOT: { label: "Trending", cls: "bg-status-hot text-white", description: "Isu sedang ramai dibahas" },
  OPEN: { label: "Diskusi Terbuka", cls: "bg-status-open text-white", description: "Deliberasi aktif" },
  PROPOSED: { label: "Diajukan", cls: "bg-status-proposed text-white", description: "Menunggu review" },
  FORWARDED: { label: "Diteruskan", cls: "bg-status-forwarded text-white", description: "Sudah diteruskan ke instansi" },
  LEGISLATION: { label: "Proses Legislasi", cls: "bg-[#4F46E5] text-white", description: "Sedang dibahas DPR/DPRD" },
  ENACTED: { label: "Menjadi Kebijakan", cls: "bg-status-enacted text-white", description: "Sudah menjadi regulasi" },
  REJECTED: { label: "Ditolak", cls: "bg-status-rejected text-white", description: "Tidak diteruskan" },
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  DIGITAL_RIGHTS: "Hak Digital",
  INFRASTRUCTURE: "Infrastruktur",
  PUBLIC_POLICY: "Kebijakan Publik",
  ENVIRONMENT: "Lingkungan",
  EDUCATION: "Pendidikan",
  HEALTH: "Kesehatan",
  ECONOMY: "Ekonomi",
};

const TIER_CONFIG = {
  PAKAR: { cls: "bg-accent text-accent-foreground" },
  PEJABAT: { cls: "bg-status-enacted text-white" },
  WARGA: { cls: "bg-muted text-muted-foreground" },
};

const MOCK_ISSUES: Issue[] = [
  {
    id: 1,
    slug: "perlindungan-data-biometrik-uu-pdp",
    title: "Perlindungan Data Biometrik dalam UU PDP",
    description: "UU Pelindungan Data Pribadi No. 27/2022 masih belum memiliki aturan implementasi spesifik untuk data biometrik.",
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
    createdAt: "25 April 2026",
    notes: "Perlu perhatian khusus dari BSSN",
  },
  {
    id: 2,
    slug: "reformasi-transportasi-umum-dki",
    title: "Reformasi Sistem Transportasi Umum DKI Jakarta",
    description: "Integrasi antara TransJakarta, MRT, LRT, dan KRL belum optimal.",
    status: "FORWARDED",
    category: "INFRASTRUCTURE",
    scopeLabel: "DKI Jakarta",
    author: { name: "Pak Joko Santoso", tier: "PAKAR", profession: "Peneliti Transportasi" },
    participants: 89,
    stances: 31,
    votes: 2150,
    heatScore: 0.73,
    tags: ["transportasi", "DKI", "mobilitas"],
    timeAgo: "5 jam lalu",
    createdAt: "20 April 2026",
    forwardedTo: "Dinas Perhubungan DKI Jakarta",
  },
  {
    id: 3,
    slug: "transparansi-anggaran-pemda",
    title: "Standar Transparansi Anggaran Pemerintah Daerah",
    description: "Banyak APBD daerah tidak dipublikasikan tepat waktu.",
    status: "LEGISLATION",
    category: "PUBLIC_POLICY",
    scopeLabel: "Nasional",
    author: { name: "Mbak Lia Rahayu", tier: "PAKAR", profession: "Jurnalis Investigasi" },
    participants: 234,
    stances: 78,
    votes: 8920,
    heatScore: 0.88,
    tags: ["anggaran", "transparansi", "akuntabilitas"],
    timeAgo: "1 hari lalu",
    createdAt: "15 April 2026",
    notes: "Sedang dibahas Komisi II DPR",
  },
  {
    id: 4,
    slug: "revisi-uu-penyiaran-konten-digital",
    title: "Revisi UU Penyiaran: Implikasi pada Konten Digital",
    description: "Revisi UU Penyiaran berpotensi memperluas kewenangan KPI ke platform streaming.",
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
    createdAt: "24 April 2026",
  },
  {
    id: 5,
    slug: "kebijakan-reklamasi-teluk-jakarta",
    title: "Kebijakan Reklamasi Teluk Jakarta",
    description: "Proyek reklamasi memiliki implikasi lingkungan dan sosial.",
    status: "REJECTED",
    category: "ENVIRONMENT",
    scopeLabel: "DKI Jakarta",
    author: { name: "Pak Eko Nugroho", tier: "PAKAR", profession: "Aktivis Lingkungan" },
    participants: 67,
    stances: 22,
    votes: 980,
    heatScore: 0.58,
    tags: ["reklamasi", "teluk-jakarta", "nelayan", "lingkungan"],
    timeAgo: "2 hari lalu",
    createdAt: "10 April 2026",
    notes: "Ditolak karena overlap dengan isu lain",
  },
  {
    id: 6,
    slug: "standar-upah-minimum-pekerja-platform",
    title: "Standar Upah Minimum untuk Pekerja Ekonomi Platform",
    description: "Pengemudi ojek online tidak terlindungi UU Ketenagakerjaan.",
    status: "ENACTED",
    category: "ECONOMY",
    scopeLabel: "Nasional",
    author: { name: "Rina Kusuma, M.H.", tier: "PAKAR", profession: "Akademisi Hukum Perburuhan" },
    participants: 178,
    stances: 54,
    votes: 5670,
    heatScore: 0.81,
    tags: ["gig-economy", "ketenagakerjaan", "ojol"],
    timeAgo: "8 jam lalu",
    createdAt: "1 Maret 2026",
    enactedDate: "15 April 2026",
  },
];

const STATISTICS = {
  totalIssues: 156,
  hotIssues: 12,
  forwarded: 34,
  inLegislation: 8,
  enacted: 23,
  pendingReview: 45,
};

function HeatBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
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

interface EditStatusModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (issueId: number, newStatus: IssueStatus, notes: string) => void;
}

function EditStatusModal({ issue, isOpen, onClose, onSave }: EditStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue?.status || "OPEN");
  const [notes, setNotes] = useState(issue?.notes || "");
  const [forwardTo, setForwardTo] = useState(issue?.forwardedTo || "");

  if (!isOpen || !issue) return null;

  const handleSave = () => {
    onSave(issue.id, selectedStatus, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Edit Status Isu</h3>
              <p className="text-xs text-muted-foreground">ID: #{issue.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Issue Title */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Judul Isu</p>
            <p className="text-sm font-medium text-foreground">{issue.title}</p>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Status Baru</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key as IssueStatus)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    selectedStatus === key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${config.cls}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${selectedStatus === key ? "text-primary" : "text-foreground"}`}>
                      {config.label}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground truncate">
                      {config.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Forward To (if applicable) */}
          {(selectedStatus === "FORWARDED" || selectedStatus === "LEGISLATION") && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {selectedStatus === "FORWARDED" ? "Diteruskan Ke" : "Dalam Pembahasan"}
              </label>
              <input
                type="text"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
                placeholder={selectedStatus === "FORWARDED" ? "Contoh: Dinas Perhubungan DKI" : "Contoh: Komisi II DPR RI"}
                className="w-full px-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Catatan Internal</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk tracking internal..."
              className="w-full min-h-[80px] px-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GovDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditClick = (issue: Issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleSaveStatus = (issueId: number, newStatus: IssueStatus, notes: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: newStatus, notes }
          : issue
      )
    );
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = filterStatus === "ALL" || issue.status === filterStatus;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const hotIssues = issues.filter((i) => i.heatScore >= 0.85);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-primary">
                    Government Dashboard
                  </span>
                </div>
                <h1 className="font-fraunces text-[2.5rem] font-bold text-foreground leading-tight">
                  Manajemen Isu Kebijakan
                </h1>
                <p className="text-muted-foreground text-sm max-w-xl">
                  Pantau dan kelola isu-isu kebijakan publik. Update status, 
                  teruskan ke instansi terkait, atau track proses legislasi.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3">
                <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                  <p className="font-fraunces text-2xl font-bold text-status-hot">{STATISTICS.hotIssues}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Isu Trending</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                  <p className="font-fraunces text-2xl font-bold text-status-forwarded">{STATISTICS.forwarded}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Diteruskan</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center min-w-[100px]">
                  <p className="font-fraunces text-2xl font-bold text-status-enacted">{STATISTICS.enacted}</p>
                  <p className="text-[0.65rem] text-muted-foreground">Terealisasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters & Search */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {[
                { key: "ALL", label: "Semua" },
                { key: "HOT", label: "Trending" },
                { key: "OPEN", label: "Terbuka" },
                { key: "FORWARDED", label: "Diteruskan" },
                { key: "LEGISLATION", label: "Legislasi" },
                { key: "ENACTED", label: "Terealisasi" },
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setFilterStatus(status.key as IssueStatus | "ALL")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari isu kebijakan..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Hot Issues Alert */}
          {hotIssues.length > 0 && filterStatus === "ALL" && !searchQuery && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-status-hot" />
                <h2 className="text-lg font-semibold text-foreground">Perhatian Khusus - Isu Trending</h2>
                <span className="text-xs text-muted-foreground">
                  ({hotIssues.length} isu memerlukan tindak lanjut)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-card border border-status-hot/30 rounded-2xl p-5 hover:border-status-hot/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[0.6rem] font-black tracking-wider uppercase bg-status-hot text-white px-2 py-1 rounded-full">
                        TRENDING
                      </span>
                      <HeatBar score={issue.heatScore} />
                    </div>
                    <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                      {issue.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {issue.participants}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {issue.stances}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEditClick(issue)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-status-hot/10 text-status-hot rounded-lg text-xs font-semibold hover:bg-status-hot/20 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Update Status
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Isu Kebijakan
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Engagement
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Cakupan
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Terakhir Update
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredIssues.map((issue) => {
                    const status = STATUS_CONFIG[issue.status];
                    const tier = TIER_CONFIG[issue.author.tier];
                    
                    return (
                      <tr key={issue.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <Link
                              href={`/issues/${issue.slug}`}
                              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {issue.title}
                            </Link>
                            <div className="flex items-center gap-2">
                              <span className={`text-[0.6rem] font-bold tracking-wider px-1.5 py-0.5 rounded ${tier.cls}`}>
                                {issue.author.tier}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {issue.author.name}
                              </span>
                            </div>
                            {issue.notes && (
                              <p className="text-xs text-accent flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {issue.notes}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider px-2.5 py-1 rounded-full ${status.cls}`}>
                            {status.label}
                          </span>
                          {issue.forwardedTo && (
                            <p className="text-[0.65rem] text-muted-foreground mt-1 truncate max-w-[150px]">
                              → {issue.forwardedTo}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {issue.participants}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {issue.stances}
                              </span>
                            </div>
                            <HeatBar score={issue.heatScore} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{issue.scopeLabel}</span>
                          </div>
                          <p className="text-[0.65rem] text-muted-foreground mt-1">
                            {CATEGORY_LABELS[issue.category]}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{issue.timeAgo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/issues/${issue.slug}`}
                              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleEditClick(issue)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {filteredIssues.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Tidak ada isu yang sesuai filter</p>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-status-hot/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-status-hot" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{hotIssues.length}</p>
                  <p className="text-xs text-muted-foreground">Isu Trending</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Memerlukan perhatian segera
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-status-forwarded/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-status-forwarded" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {issues.filter((i) => i.status === "FORWARDED").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Diteruskan</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Menunggu respons instansi
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {issues.filter((i) => i.status === "LEGISLATION").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Dalam Legislasi</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Proses pembahasan DPR/DPRD
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-status-enacted/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-status-enacted" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {issues.filter((i) => i.status === "ENACTED").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Terealisasi</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Sudah menjadi kebijakan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      <EditStatusModal
        issue={editingIssue}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIssue(null);
        }}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
