"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { laws as lawsApi, LawDocument } from "@/lib/api";
import {
  Search,
  Scale,
  BookOpen,
  FileText,
  ChevronRight,
  Filter,
  Bookmark,
  Share2,
  Download,
  History,
  X,
  Gavel,
  ScrollText,
  Building2,
  Landmark,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type LawType = "UU" | "PP" | "PERPRES" | "PERMEN" | "PERDA" | "PERBUP" | "KEPRES" | "SE";
type LawStatus = "BERLAKU" | "DICABUT" | "DIREVISI";

// LawDocument is now imported from lib/api

const LAW_TYPE_CONFIG: Record<LawType, { label: string; color: string; icon: React.ElementType }> = {
  UU: { label: "Undang-Undang", color: "bg-status-enacted", icon: Gavel },
  PP: { label: "Peraturan Pemerintah", color: "bg-primary", icon: Building2 },
  PERPRES: { label: "Peraturan Presiden", color: "bg-status-forwarded", icon: Landmark },
  PERMEN: { label: "Peraturan Menteri", color: "bg-accent", icon: ScrollText },
  PERDA: { label: "Peraturan Daerah", color: "bg-status-open", icon: Building2 },
  PERBUP: { label: "Peraturan Bupati", color: "bg-status-proposed", icon: FileText },
  KEPRES: { label: "Keputusan Presiden", color: "bg-[#4F46E5]", icon: Landmark },
  SE: { label: "Surat Edaran", color: "bg-muted", icon: FileText },
};

const STATUS_CONFIG: Record<LawStatus, { label: string; cls: string }> = {
  BERLAKU: { label: "Berlaku", cls: "bg-status-enacted/10 text-status-enacted" },
  DICABUT: { label: "Dicabut", cls: "bg-status-rejected/10 text-status-rejected" },
  DIREVISI: { label: "Direvisi", cls: "bg-status-hot/10 text-status-hot" },
};

const _MOCK_LAWS_LEGACY: unknown[] = [
  {
    id: "uu-27-2022",
    type: "UU",
    number: "27",
    year: 2022,
    title: "Pelindungan Data Pribadi",
    description: "Undang-Undang tentang Perlindungan Data Pribadi yang mengatur pengumpulan, pengolahan, dan penghapusan data pribadi oleh pemerintah dan swasta.",
    status: "BERLAKU",
    category: "Teknologi & Informasi",
    dateEnacted: "17 Oktober 2022",
    tags: ["data-pribadi", "privasi", "digital", "perlindungan"],
    views: 15420,
    bookmarked: true,
  },
  {
    id: "uu-11-2008",
    type: "UU",
    number: "11",
    year: 2008,
    title: "Informasi dan Transaksi Elektronik",
    description: "Undang-Undang tentang Informasi dan Transaksi Elektronik yang mengatur keabsahan dokumen elektronik dan tanda tangan digital.",
    status: "BERLAKU",
    category: "Teknologi & Informasi",
    dateEnacted: "21 April 2008",
    tags: ["ITE", "digital", "transaksi-elektronik", "siber"],
    views: 23150,
    bookmarked: false,
  },
  {
    id: "pp-71-2019",
    type: "PP",
    number: "71",
    year: 2019,
    title: "Penyelenggaraan Sistem dan Transaksi Elektronik",
    description: "Peraturan Pemerintah yang mengatur penyelenggaraan sistem elektronik, tanda tangan elektronik, dan registrasi pelayanan publik.",
    status: "BERLAKU",
    category: "Teknologi & Informasi",
    dateEnacted: "27 September 2019",
    tags: ["PSTE", "sistem-elektronik", "registrasi"],
    views: 8920,
    bookmarked: false,
  },
  {
    id: "uu-13-2003",
    type: "UU",
    number: "13",
    year: 2003,
    title: "Ketenagakerjaan",
    description: "Undang-Undang tentang Ketenagakerjaan yang mengatur hubungan kerja, perlindungan kerja, dan penyelesaian perselisihan hubungan industrial.",
    status: "DIREVISI",
    category: "Ketenagakerjaan",
    dateEnacted: "25 Maret 2003",
    tags: ["buruh", "upah", "PHK", "hubungan-industrial"],
    views: 34560,
    bookmarked: true,
  },
  {
    id: "uu-6-2023",
    type: "UU",
    number: "6",
    year: 2023,
    title: "Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja",
    description: "Undang-Undang Cipta Kerja yang mengatur tentang kemudahan, perlindungan, dan pemberdayaan UMKM serta investasi.",
    status: "BERLAKU",
    category: "Ketenagakerjaan",
    dateEnacted: "31 Maret 2023",
    tags: ["cipta-kerja", "UMKM", "investasi", "omnibus-law"],
    views: 45230,
    bookmarked: false,
  },
  {
    id: "perpres-63-2024",
    type: "PERPRES",
    number: "63",
    year: 2024,
    title: "Penyelenggaraan Pemerintahan Digital",
    description: "Peraturan Presiden tentang tata kelola pemerintahan berbasis digital, layanan digital, dan interoperabilitas data.",
    status: "BERLAKU",
    category: "Pemerintahan Digital",
    dateEnacted: "15 Mei 2024",
    tags: ["SPBE", "digital", "layanan-publik", "data"],
    views: 6780,
    bookmarked: false,
  },
];

const POPULAR_SEARCHES = [
  "UU ITE",
  "UU Cipta Kerja",
  "UU PDP",
  "UU Ketenagakerjaan",
  "UU Kekayaan Intelektual",
  "UU Perkawinan",
];

const RECENT_SEARCHES = [
  "perlindungan data pribadi",
  "ketenagakerjaan 2024",
  "UU ITE pasal 27",
];

function LawCard({ law }: { law: LawDocument }) {
  const typeConfig = LAW_TYPE_CONFIG[law.type as LawType] ?? LAW_TYPE_CONFIG.UU;
  const statusConfig = STATUS_CONFIG[law.status as LawStatus] ?? STATUS_CONFIG.BERLAKU;
  const Icon = typeConfig.icon;

  return (
    <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/25 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${typeConfig.color} flex items-center justify-center text-white shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[0.65rem] font-black tracking-wider px-2 py-0.5 rounded ${typeConfig.color} text-white`}>
                {law.type}
              </span>
              <span className="text-[0.65rem] text-muted-foreground">
                No. {law.number} Tahun {law.year}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {law.category} · {law.dateEnacted}
            </p>
          </div>
        </div>
        <span className={`text-[0.65rem] font-medium px-2.5 py-1 rounded-full ${statusConfig.cls}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Title */}
      <Link href={`/hukum/${law.code}`}>
        <h3 className="font-fraunces text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors cursor-pointer">
          {law.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {law.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {law.tags.map((tag) => (
          <span key={tag} className="text-[0.65rem] text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {law.views.toLocaleString()}x dibaca
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Bookmark className={`w-4 h-4 ${law.bookmarked ? "fill-primary text-primary" : ""}`} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HukumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<LawType | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<LawStatus | "ALL">("ALL");
  const [hasSearched, setHasSearched] = useState(false);
  const [laws, setLaws] = useState<LawDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    lawsApi
      .list({
        type: selectedType === "ALL" ? undefined : selectedType,
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        q: searchQuery.trim() || undefined,
      })
      .then(setLaws)
      .catch(() => setLaws([]))
      .finally(() => setLoading(false));
  }, [selectedType, selectedStatus, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const filteredLaws = laws;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Hero Section - Search */}
        <div className={`${hasSearched ? "border-b border-border bg-muted/20" : "bg-muted/20 min-h-[50vh] flex items-center"} transition-all`}>
          <div className="max-w-4xl mx-auto px-6 py-12 w-full">
            {!hasSearched && (
              <div className="text-center mb-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-primary">
                  <Scale className="w-8 h-8" />
                </div>
                <h1 className="font-fraunces text-4xl font-bold text-foreground">
                  Pencarian Hukum Indonesia
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Cari undang-undang, peraturan pemerintah, dan dokumen hukum lainnya dari database lengkap kami.
                </p>
              </div>
            )}

            {hasSearched && (
              <div className="mb-6">
                <Link href="/hukum" onClick={() => setHasSearched(false)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                  <X className="w-4 h-4" />
                  Reset pencarian
                </Link>
              </div>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari undang-undang, peraturan, atau topik hukum..."
                  className="w-full pl-14 pr-32 py-4 text-base bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60 shadow-lg shadow-foreground/[0.02]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-5 py-2 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Quick Filters */}
            {!hasSearched && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Pencarian populer:</span>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setHasSearched(true);
                    }}
                    className="text-sm px-3 py-1.5 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!hasSearched && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <History className="w-4 h-4" />
                  <span>Pencarian terakhir</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setHasSearched(true);
                      }}
                      className="text-sm px-3 py-1.5 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
                    >
                      <History className="w-3.5 h-3.5" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Sidebar Filters */}
              <aside className="w-64 shrink-0 space-y-6">
                {/* Filter by Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground">
                      Jenis Peraturan
                    </p>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedType("ALL")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        selectedType === "ALL"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span>Semua Jenis</span>
                      <span className="text-[0.65rem] text-muted-foreground/60">{laws.length}</span>
                    </button>
                    {Object.entries(LAW_TYPE_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedType(key as LawType)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          selectedType === key
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.color}`} />
                        <span className="flex-1">{config.label}</span>
                        <span className="text-[0.65rem] text-muted-foreground/60">
                          {laws.filter((l) => l.type === key).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Status */}
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                    Status
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedStatus("ALL")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedStatus === "ALL"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      Semua Status
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedStatus(key as LawStatus)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          selectedStatus === key
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${config.cls.split(" ")[0].replace("/10", "").replace("text-", "bg-")}`} />
                        <span>{config.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">
                    Kategori
                  </p>
                  <div className="space-y-1">
                    {["Teknologi & Informasi", "Ketenagakerjaan", "Pemerintahan Digital", "Perdagangan", "Perpajakan"].map((cat) => (
                      <button
                        key={cat}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Results */}
              <main className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Hasil Pencarian
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredLaws.length} dokumen ditemukan
                      {searchQuery && ` untuk "${searchQuery}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Urutkan:</span>
                    <select className="bg-card border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none">
                      <option>Paling Relevan</option>
                      <option>Terbaru</option>
                      <option>Paling Banyak Dibaca</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-44 bg-card border border-border rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : filteredLaws.length > 0 ? (
                  <div className="space-y-4">
                    {filteredLaws.map((law) => (
                      <LawCard key={law.id} law={law} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Tidak ada hasil
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Coba gunakan kata kunci yang berbeda atau kurangi filter pencarian
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("ALL");
                        setSelectedStatus("ALL");
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Hapus semua filter
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
        )}

        {/* Categories Grid - Show when not searching */}
        {!hasSearched && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Jelajahi per Kategori
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Teknologi & Informasi", count: 245, icon: FileText },
                { name: "Ketenagakerjaan", count: 189, icon: Gavel },
                { name: "Pemerintahan Digital", count: 156, icon: Building2 },
                { name: "Perdagangan", count: 134, icon: ScrollText },
                { name: "Perpajakan", count: 201, icon: Landmark },
                { name: "Lingkungan Hidup", count: 98, icon: FileText },
                { name: "Pendidikan", count: 167, icon: BookOpen },
                { name: "Kesehatan", count: 143, icon: FileText },
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setHasSearched(true)}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/25 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} dokumen</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
