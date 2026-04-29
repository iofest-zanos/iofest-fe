"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Share2,
  Bookmark,
  AlertCircle,
  Newspaper,
  ChevronRight,
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Ambil data dari localStorage
    const storedArticle = localStorage.getItem("currentArticle");
    const allArticles = localStorage.getItem("newsArticles");
    
    if (storedArticle) {
      const parsed = JSON.parse(storedArticle);
      setArticle(parsed);
      
      // Cek bookmark
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]");
      setIsBookmarked(bookmarks.some((b: NewsArticle) => b.id === parsed.id));
      
      // Ambil related articles dari cache
      if (allArticles) {
        const articles = JSON.parse(allArticles);
        const related = articles
          .filter((a: NewsArticle) => a.id !== parsed.id)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    } else {
      // Redirect ke /news jika tidak ada data
      router.push("/news");
    }
    
    setLoading(false);
  }, [router]);

  const handleBookmark = () => {
    if (!article) return;
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]");
    
    if (isBookmarked) {
      const filtered = bookmarks.filter((b: NewsArticle) => b.id !== article.id);
      localStorage.setItem("bookmarkedNews", JSON.stringify(filtered));
    } else {
      bookmarks.push(article);
      localStorage.setItem("bookmarkedNews", JSON.stringify(bookmarks));
    }
    
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (!article) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Berita tidak ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            Data berita tidak tersedia. Silakan kembali ke halaman berita.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/news" className="hover:text-foreground transition-colors">
                Berita
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground line-clamp-1">{article.source}</span>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-8">
            {/* Source Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[0.65rem] font-bold tracking-wider uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded">
                {article.source}
              </span>
              {isBookmarked && (
                <span className="text-[0.65rem] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-current" />
                  Tersimpan
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-fraunces text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.content ? "~3 menit baca" : "Berita singkat"}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden bg-muted">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto max-h-[400px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-8 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isBookmarked
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Tersimpan" : "Simpan"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Baca di {article.source}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-6 font-medium">
              {article.description}
            </p>

            {/* Full Content (if available) */}
            {article.content ? (
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {article.content.replace(/\[\+\d+ chars\]$/, "")}
                <p className="text-muted-foreground mt-4 italic">
                  (Konten dipotong. Baca selengkapnya di sumber asli.)
                </p>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Konten lengkap tidak tersedia. Silakan baca berita lengkap di sumber asli.
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all"
                >
                  Baca di {article.source}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Tags (if any) */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs text-muted-foreground mr-2">Tag:</span>
            {["berita", "indonesia", article.source.toLowerCase().replace(/\s+/g, "-")].map((tag) => (
              <span
                key={tag}
                className="text-xs text-accent/70 bg-accent/8 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Back to News */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Berita
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 py-8 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-accent" />
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${slugify(related.title)}`}
                  onClick={() => {
                    localStorage.setItem("currentArticle", JSON.stringify(related));
                  }}
                  className="group block bg-card border border-border rounded-xl p-4 hover:border-primary/25 transition-all"
                >
                  {related.imageUrl && (
                    <div className="h-24 bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <span className="text-[0.6rem] font-bold text-accent uppercase tracking-wider">
                    {related.source}
                  </span>
                  <h3 className="font-medium text-foreground text-sm mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(related.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
