"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, forum } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Hash,
  ChevronDown,
  X,
  Info,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Lightbulb,
  Scale,
  Newspaper,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

type ForumCategory = "GENERAL" | "POLICY_DISCUSSION" | "EXPERT_QA" | "CIVIC_TECH" | "LEGAL_HELP" | "NEWS_DISCUSS";

interface CategoryOption {
  key: ForumCategory;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  {
    key: "GENERAL",
    label: "Umum",
    description: "Diskusi umum tentang platform dan kebijakan",
    icon: MessageCircle,
  },
  {
    key: "POLICY_DISCUSSION",
    label: "Diskusi Kebijakan",
    description: "Analisis dan debat kebijakan publik",
    icon: Lightbulb,
  },
  {
    key: "EXPERT_QA",
    label: "Tanya Expert",
    description: "Tanya jawab dengan para ahli",
    icon: HelpCircle,
  },
  {
    key: "CIVIC_TECH",
    label: "Civic Tech",
    description: "Teknologi untuk kebaikan bersama",
    icon: Sparkles,
  },
  {
    key: "LEGAL_HELP",
    label: "Bantuan Hukum",
    description: "Konsultasi dan informasi hukum",
    icon: Scale,
  },
  {
    key: "NEWS_DISCUSS",
    label: "Diskusi Berita",
    description: "Bahas berita terkini",
    icon: Newspaper,
  },
];

const POPULAR_TAGS = [
  "privasi",
  "hukum",
  "AI",
  "civic-tech",
  "DPR",
  "UU-PDP",
  "kampus",
  "putusan-MK",
  "transparansi",
  "demokrasi",
  "pemilu",
  "korupsi",
  "lingkungan",
  "ekonomi",
];

export default function NewThreadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  const titleLength = title.length;
  const contentLength = content.length;
  const maxTitleLength = 150;
  const maxContentLength = 5000;

  const canSubmit =
    titleLength >= 10 &&
    titleLength <= maxTitleLength &&
    contentLength >= 50 &&
    contentLength <= maxContentLength &&
    selectedCategory !== null;

  const handleAddTag = (tag: string) => {
    const cleanTag = tag.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedCategory) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await forum.create({
        title,
        content,
        category: selectedCategory,
        tags,
      });
      router.push(`/forum/${created.slug}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Gagal membuat thread.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiAssist = () => {
    if (titleLength < 10) return;
    setShowAiSuggestion(true);
    setAiSuggestion(
      "Berdasarkan judul Anda, pertimbangkan untuk menambahkan:\n\n1. Konteks spesifik (contoh: lokasi, periode waktu)\n2. Pertanyaan yang jelas jika meminta opini\n3. Referensi kebijakan yang relevan\n\nContoh peningkatan:\n❌ 'Bagaimana tentang UU ini?'\n✅ 'Apa dampak UU Cipta Kerja terhadap UMKM di Jawa Barat menurut data terbaru 2025?'"
    );
  };

  const getAiQualityScore = () => {
    let score = 0;
    if (titleLength >= 20) score += 25;
    if (titleLength >= 40) score += 25;
    if (contentLength >= 100) score += 25;
    if (contentLength >= 200) score += 25;
    return score;
  };

  const aiScore = getAiQualityScore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-muted/20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Link
              href="/forum"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Forum
            </Link>
            <h1 className="font-fraunces text-[2.5rem] font-bold text-foreground leading-tight">
              Thread Baru
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Mulai diskusi baru dengan komunitas SuaraKita
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Judul Thread <span className="text-status-rejected">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    titleLength > maxTitleLength
                      ? "text-status-rejected"
                      : titleLength >= 10
                      ? "text-status-enacted"
                      : "text-muted-foreground"
                  }`}
                >
                  {titleLength}/{maxTitleLength}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, maxTitleLength))}
                  placeholder="Tuliskan judul yang jelas dan spesifik..."
                  className="w-full px-4 py-3.5 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all"
                />
                {titleLength >= 10 && (
                  <button
                    type="button"
                    onClick={handleAiAssist}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-xs text-accent bg-accent/10 px-2.5 py-1.5 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Assist
                  </button>
                )}
              </div>
              {titleLength > 0 && titleLength < 10 && (
                <p className="text-xs text-status-hot flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Judul minimal 10 karakter
                </p>
              )}
            </div>

            {/* AI Suggestion */}
            {showAiSuggestion && aiSuggestion && (
              <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    Saran dari AI
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAiSuggestion(false)}
                    className="ml-auto text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {aiSuggestion}
                </div>
              </div>
            )}

            {/* Category Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Kategori <span className="text-status-rejected">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 bg-card border rounded-xl transition-all text-left ${
                    selectedCategory
                      ? "border-primary/50 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {selectedCategory ? (
                      <>
                        {(() => {
                          const cat = CATEGORIES.find((c) => c.key === selectedCategory);
                          const Icon = cat?.icon || MessageCircle;
                          return <Icon className="w-5 h-5 text-primary" />;
                        })()}
                        <span className="font-medium">
                          {CATEGORIES.find((c) => c.key === selectedCategory)?.label}
                        </span>
                      </>
                    ) : (
                      "Pilih kategori thread"
                    )}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl shadow-foreground/[0.06] z-10 overflow-hidden">
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.key}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category.key);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 ${
                            selectedCategory === category.key ? "bg-primary/5" : ""
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mt-0.5 ${
                              selectedCategory === category.key
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                selectedCategory === category.key
                                  ? "text-primary"
                                  : "text-foreground"
                              }`}
                            >
                              {category.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {category.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Isi Diskusi <span className="text-status-rejected">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    contentLength > maxContentLength
                      ? "text-status-rejected"
                      : contentLength >= 50
                      ? "text-status-enacted"
                      : "text-muted-foreground"
                  }`}
                >
                  {contentLength}/{maxContentLength}
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, maxContentLength))}
                  placeholder="Jelaskan topik diskusi Anda secara detail. Sertakan konteks, pertanyaan spesifik, atau argumen yang ingin Anda bahas..."
                  className="w-full min-h-[240px] px-4 py-4 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50 transition-all resize-y leading-relaxed"
                />
              </div>
              {contentLength > 0 && contentLength < 50 && (
                <p className="text-xs text-status-hot flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Isi diskusi minimal 50 karakter
                </p>
              )}

              {/* AI Quality Check */}
              {contentLength >= 20 && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        aiScore >= 75
                          ? "bg-status-enacted"
                          : aiScore >= 50
                          ? "bg-status-open"
                          : "bg-status-hot"
                      }`}
                      style={{ width: `${aiScore}%` }}
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      aiScore >= 75
                        ? "text-status-enacted"
                        : aiScore >= 50
                        ? "text-status-open"
                        : "text-status-hot"
                    }`}
                  >
                    {aiScore >= 75
                      ? "Sangat Baik"
                      : aiScore >= 50
                      ? "Cukup Baik"
                      : "Perlu Ditingkatkan"}
                  </span>
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Tag</label>
                <span className="text-xs text-muted-foreground">
                  {tags.length}/5 tag
                </span>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 flex-wrap p-3 bg-card border border-border rounded-xl">
                  <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-lg"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-accent/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Tambahkan tag (tekan Enter)" : ""}
                    className="flex-1 min-w-[120px] text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
                    disabled={tags.length >= 5}
                  />
                </div>
              </div>

              {/* Popular Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Tag populer:</span>
                {POPULAR_TAGS.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    disabled={tags.includes(tag) || tags.length >= 5}
                    className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full hover:bg-accent/10 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Guidelines Box */}
            <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  Panduan Posting
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-enacted shrink-0 mt-0.5" />
                  <span>Gunakan judul yang jelas dan spesifik</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-enacted shrink-0 mt-0.5" />
                  <span>Sertakan konteks dan sumber jika relevan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-enacted shrink-0 mt-0.5" />
                  <span>Hormati perbedaan pendapat dan diskusi konstruktif</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-status-hot shrink-0 mt-0.5" />
                  <span>Hindari spam, hoax, atau konten yang memecah belah</span>
                </li>
              </ul>
            </div>

            {submitError && (
              <div className="text-sm text-status-rejected bg-status-rejected/10 border border-status-rejected/20 px-4 py-2 rounded-xl">
                {submitError}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Link
                href="/forum"
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Memposting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Posting Thread
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
