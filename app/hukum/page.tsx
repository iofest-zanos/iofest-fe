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

  return (
    <div className="group bg-card border border-border rounded-xl px-4 py-3.5 hover:border-primary/25 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className={`text-[0.55rem] font-bold tracking-wide px-2 py-0.5 rounded ${typeConfig.color} text-white`}>
              {law.type} {law.number}/{law.year}
            </span>
            <span className={`text-[0.5rem] font-medium px-1.5 py-0.5 rounded-full ${statusConfig.cls}`}>
              {statusConfig.label}
            </span>
          </div>
          <Link href={`/hukum/${law.code}`}>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {law.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-1">{law.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[0.6rem] text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {law.views.toLocaleString()}x
            </span>
            {law.dateEnacted && <span>{law.dateEnacted}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Bookmark className={`w-3.5 h-3.5 ${law.bookmarked ? "fill-primary text-primary" : ""}`} />
          </button>
          <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
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
        <div className={`${hasSearched ? "border-b border-border bg-muted/20" : "bg-muted/20"} transition-all`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full">
            {!hasSearched && (
              <div className="mb-3 sm:mb-6 space-y-1.5">
                <h1 className="font-fraunces text-xl sm:text-3xl font-bold text-foreground">
                  Pencarian Hukum
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
                  Cari undang-undang, peraturan, dan dokumen hukum di Indonesia.
                </p>
              </div>
            )}

            {hasSearched && (
              <div className="mb-4 sm:mb-6">
                <Link href="/hukum" onClick={() => setHasSearched(false)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3 sm:mb-4">
                  <X className="w-4 h-4" />
                  Reset pencarian
                </Link>
              </div>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari undang-undang, peraturan, atau topik hukum..."
                  className="w-full pl-11 sm:pl-14 pr-28 sm:pr-32 py-3 sm:py-4 text-sm sm:text-base bg-card border border-border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/60 shadow-lg shadow-foreground/[0.02]"
                />
                <button
                  type="submit"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Filter pills for mobile */}
            {hasSearched && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3">
                <button onClick={() => setSelectedType("ALL")} className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedType === "ALL" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>Semua</button>
                {(["UU", "PP", "PERPRES", "PERDA"] as LawType[]).map((t) => (
                  <button key={t} onClick={() => setSelectedType(t)} className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedType === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>
                    {LAW_TYPE_CONFIG[t]?.label ?? t}
                  </button>
                ))}
                <span className="shrink-0 w-px h-5 bg-border mx-1" />
                <button onClick={() => setSelectedStatus("ALL")} className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedStatus === "ALL" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>Semua Status</button>
                {(["BERLAKU", "DIREVISI"] as LawStatus[]).map((s) => (
                  <button key={s} onClick={() => setSelectedStatus(s)} className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedStatus === s ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>
                    {STATUS_CONFIG[s]?.label ?? s}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Filters */}
            {!hasSearched && (
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground w-full text-center sm:w-auto">Pencarian populer:</span>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setHasSearched(true);
                    }}
                    className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!hasSearched && (
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
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
                      className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-2"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Sidebar Filters — desktop only */}
              <aside className="hidden lg:block w-64 shrink-0 space-y-6">
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Hasil ({filteredLaws.length})</h2>
                  <select className="bg-card border border-border rounded-lg px-2 py-1 text-xs focus:outline-none">
                    <option>Relevan</option>
                    <option>Terbaru</option>
                    <option>Dibaca</option>
                  </select>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : filteredLaws.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {filteredLaws.map((law) => (
                      <LawCard key={law.id} law={law} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">Tidak ada hasil</p>
                    <p className="text-xs text-muted-foreground mb-4">Coba kata kunci berbeda atau kurangi filter</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("ALL");
                        setSelectedStatus("ALL");
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Hapus filter
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
        )}

        {/* Categories Grid - Show when not searching */}
        {!hasSearched && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Jelajahi per Kategori
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
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
                  onClick={() => { setSearchQuery(cat.name); setHasSearched(true); }}
                  className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-xl hover:border-primary/25 transition-all text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs leading-tight">{cat.name}</p>
                    <p className="text-[0.6rem] text-muted-foreground">{cat.count}</p>
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
