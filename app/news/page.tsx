"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Newspaper,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
  Filter,
  Bookmark,
  Share2,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  source: string;
  author: string;
}

const CATEGORIES = [
  { key: "all", label: "Semua" },
  { key: "general", label: "Umum" },
  { key: "business", label: "Bisnis" },
  { key: "technology", label: "Teknologi" },
  { key: "politics", label: "Politik" },
  { key: "law", label: "Hukum" },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Baru saja";
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  if (diffInHours < 48) return "Kemarin";
  
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function NewsCard({ article }: { article: NewsArticle }) {
  const handleClick = () => {
    // Simpan data artikel ke localStorage
    localStorage.setItem("currentArticle", JSON.stringify(article));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]");
    const isBookmarked = bookmarks.some((b: NewsArticle) => b.id === article.id);
    
    if (isBookmarked) {
      const filtered = bookmarks.filter((b: NewsArticle) => b.id !== article.id);
      localStorage.setItem("bookmarkedNews", JSON.stringify(filtered));
    } else {
      bookmarks.push(article);
      localStorage.setItem("bookmarkedNews", JSON.stringify(bookmarks));
    }
    
    // Trigger re-render (simplified)
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Link
      href={`/news/${slugify(article.title)}`}
      onClick={handleClick}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/25 hover:shadow-lg hover:shadow-foreground/[0.04] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Newspaper className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-[0.65rem] font-bold tracking-wider uppercase bg-primary text-white px-2 py-1 rounded">
            {article.source}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-fraunces text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {article.description || "Tidak ada deskripsi tersedia."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {article.author}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <span className="flex items-center gap-1 text-xs text-primary font-medium">
              Baca Selengkapnya
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchNews = async (query: string = "", category: string = "all", pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const searchParam = query || "Indonesia kebijakan pemerintah";
      const response = await fetch(
        `/api/news?q=${encodeURIComponent(searchParam)}&category=${category}&page=${pageNum}&pageSize=12`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil berita");
      }

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setArticles(data.articles);
      setTotalResults(data.totalResults);
      
      // Simpan ke localStorage untuk related articles di detail page
      localStorage.setItem("newsArticles", JSON.stringify(data.articles));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setPage(1);
    fetchNews(searchQuery, selectedCategory, 1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    fetchNews(searchQuery, category, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchNews(searchQuery, selectedCategory, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalResults / 12);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h1 className="font-fraunces text-lg sm:text-[1.75rem] font-bold text-foreground leading-tight">
                Berita
              </h1>
              <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </form>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCategory === cat.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Error State */}
          {error && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-status-rejected/10 border border-status-rejected/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-status-rejected shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-status-rejected mb-1">Gagal memuat berita</h3>
                  <p className="text-sm text-muted-foreground mb-3">{error}</p>
                  <button
                    onClick={() => fetchNews(searchQuery, selectedCategory, page)}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Coba lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {totalResults > 0 ? (
                  <>
                    Menampilkan <span className="font-medium text-foreground">{articles.length}</span> dari{" "}
                    <span className="font-medium text-foreground">{totalResults}</span> berita
                  </>
                ) : (
                  "Tidak ada berita ditemukan"
                )}
              </p>
              {hasSearched && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setHasSearched(false);
                    setSelectedCategory("all");
                    setPage(1);
                    fetchNews("", "all", 1);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Reset pencarian
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                            page === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground px-1 sm:px-2">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex sm:hidden items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-xl border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="w-9 h-9 rounded-xl border border-border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tidak ada berita
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Coba ubah kata kunci pencarian atau kategori
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  fetchNews("", "all", 1);
                }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Muat ulang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
