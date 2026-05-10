"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Flag,
  MessageSquare,
  Newspaper,
  Scale,
  Share2,
  Sparkles,
  Users,
  Vote,
  Wifi,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import {
  ai,
  ApiError,
  deliberation,
  IssueListItem,
  issues as issuesApi,
  news,
  NewsArticle,
  Stance,
  TimelineEntry,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type StageKey = "DIAJUKAN" | "SEDANG_DIBAHAS" | "DRAFT" | "PENGESAHAN" | "HASIL";
type TabId = "pernyataan" | "peta-opini" | "hukum" | "brief" | "berita";

interface StageConfig {
  key: StageKey;
  step: number;
  label: string;
  description: string;
  colorCls: string;
  dotCls: string;
  allowComments: boolean;
}

const STAGES: StageConfig[] = [
  { key: "DIAJUKAN", step: 1, label: "Isu Diajukan", description: "Expert atau pemerintah mengajukan isu", colorCls: "text-stage-diajukan", dotCls: "bg-stage-diajukan", allowComments: false },
  { key: "SEDANG_DIBAHAS", step: 2, label: "Sedang Dibahas", description: "Pemerintah membuka pembahasan", colorCls: "text-stage-dibahas", dotCls: "bg-stage-dibahas", allowComments: true },
  { key: "DRAFT", step: 3, label: "Draft Peraturan", description: "Pemerintah melampirkan draft UU", colorCls: "text-stage-draft", dotCls: "bg-stage-draft", allowComments: true },
  { key: "PENGESAHAN", step: 4, label: "Tahap Pengesahan", description: "Proses pengesahan internal", colorCls: "text-stage-pengesahan", dotCls: "bg-stage-pengesahan", allowComments: false },
  { key: "HASIL", step: 5, label: "Hasil Pengesahan", description: "Keputusan akhir", colorCls: "text-stage-hasil-disahkan", dotCls: "bg-stage-hasil-disahkan", allowComments: false },
];

const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "pernyataan", label: "Pernyataan", Icon: MessageSquare },
  { id: "peta-opini", label: "Peta Opini", Icon: Vote },
  { id: "hukum", label: "Konteks Hukum", Icon: Scale },
  { id: "brief", label: "Brief Kebijakan", Icon: FileText },
  { id: "berita", label: "Berita Terkait", Icon: Newspaper },
];

function StageBadge({ stageKey }: { stageKey: StageKey }) {
  const stage = STAGES.find((s) => s.key === stageKey);
  if (!stage) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[0.55rem] font-bold tracking-wider px-2 py-0.5 rounded-full ${stage.dotCls}/15 ${stage.colorCls}`}>
      <span className={`w-1 h-1 rounded-full ${stage.dotCls}`} />
      Tahap {stage.step}: {stage.label}
    </span>
  );
}

function IssueTimeline({ currentStage, timeline }: { currentStage: StageKey; timeline: TimelineEntry[] }) {
  const currentIdx = STAGES.findIndex((s) => s.key === currentStage);
  const byStage = new Map<string, TimelineEntry>();
  timeline.forEach((t) => byStage.set(t.stage, t));

  return (
    <div className="space-y-0">
      {STAGES.map((stage, i) => {
        const entry = byStage.get(stage.key);
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isLast = i === STAGES.length - 1;

        return (
          <div key={stage.key} className="flex gap-3 relative">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 z-10 transition-all ${
                  isCurrent
                    ? `${stage.dotCls} border-transparent ring-4 ring-current/15`
                    : isCompleted
                    ? `${stage.dotCls} border-transparent`
                    : "bg-card border-border"
                }`}
              />
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[3rem] transition-colors ${isCompleted ? "bg-stage-dibahas/40" : "bg-border"}`} />
              )}
            </div>
            <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
              <p className={`text-xs font-semibold leading-tight ${isCurrent ? stage.colorCls : isCompleted ? "text-foreground" : "text-muted-foreground/50"}`}>
                {stage.label}
                {isCurrent && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[0.55rem] font-black tracking-wider bg-current/10 px-1.5 py-0.5 rounded-full">
                    SAAT INI
                  </span>
                )}
              </p>
              {entry?.created_at ? (
                <>
                  <p className="text-[0.6rem] text-muted-foreground mt-0.5">{new Date(entry.created_at).toLocaleDateString("id-ID")}</p>
                  <p className="text-[0.6rem] text-muted-foreground leading-snug">{entry.note}</p>
                </>
              ) : (
                <p className="text-[0.6rem] text-muted-foreground/40 mt-0.5 italic">Belum tercapai</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VoteButton({
  label,
  type,
  active,
  onClick,
  disabled,
}: {
  label: string;
  type: "agree" | "abstain" | "disagree";
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const styles = {
    agree: { idle: "bg-vote-agree-bg text-vote-agree hover:bg-vote-agree hover:text-white", active: "bg-vote-agree text-white" },
    abstain: { idle: "bg-vote-abstain-bg text-vote-abstain hover:bg-vote-abstain hover:text-foreground", active: "bg-vote-abstain text-foreground" },
    disagree: { idle: "bg-vote-disagree-bg text-vote-disagree hover:bg-vote-disagree hover:text-white", active: "bg-vote-disagree text-white" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? styles[type].active : styles[type].idle
      }`}
    >
      {label}
    </button>
  );
}

function StanceCard({
  stance,
  onVote,
  authed,
}: {
  stance: Stance;
  onVote: (value: "agree" | "abstain" | "disagree") => void;
  authed: boolean;
}) {
  const total = stance.totalVotes || 1;
  const agreePct = Math.round((stance.agreeCount / total) * 100);
  const disagreePct = Math.round((stance.disagreeCount / total) * 100);
  const tier = stance.author.tier;
  const userVote = stance.userVote;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
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
        {stance.qualityScore !== null && stance.qualityScore !== undefined && (
          <span className="ml-auto text-[0.65rem] text-muted-foreground">
            Relevansi: <span className="font-medium text-foreground">{Math.round(stance.qualityScore * 100)}%</span>
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <p className="flex-1 text-[1rem] text-foreground font-medium leading-relaxed">&ldquo;{stance.content}&rdquo;</p>
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

      {stance.stageKey && (
        <div className="flex items-center gap-2">
          <StageBadge stageKey={stance.stageKey as StageKey} />
        </div>
      )}

      {userVote && (
        <div className="space-y-1.5">
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-vote-agree rounded-l-full" style={{ width: `${agreePct}%` }} />
            <div className="h-full bg-vote-disagree rounded-r-full" style={{ width: `${disagreePct}%` }} />
          </div>
          <div className="flex justify-between text-[0.65rem] text-muted-foreground">
            <span className="text-vote-agree font-medium">{agreePct}% setuju ({stance.agreeCount})</span>
            <span className="text-vote-disagree font-medium">{disagreePct}% tidak setuju ({stance.disagreeCount})</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <VoteButton label="Tidak Setuju" type="disagree" active={userVote === "disagree"} onClick={() => onVote("disagree")} disabled={!authed} />
        <VoteButton label="Abstain" type="abstain" active={userVote === "abstain"} onClick={() => onVote("abstain")} disabled={!authed} />
        <VoteButton label="Setuju" type="agree" active={userVote === "agree"} onClick={() => onVote("agree")} disabled={!authed} />
      </div>
      {!authed && <p className="text-[0.65rem] text-muted-foreground italic">Masuk untuk memberikan suara.</p>}
    </div>
  );
}

function OpinionMap({ slug }: { slug: string }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof deliberation.clusters>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliberation
      .clusters(slug, true)
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />;
  if (!data) return <p className="text-sm text-muted-foreground">Peta opini belum tersedia.</p>;
  if (!data.points.length) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
        {data.note ?? "Belum cukup partisipan untuk membentuk peta opini."}
      </div>
    );
  }

  const xs = data.points.map((p) => p.x);
  const ys = data.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padX = (maxX - minX || 1) * 0.1;
  const padY = (maxY - minY || 1) * 0.1;
  const width = 600;
  const height = 320;
  const project = (x: number, y: number) => {
    const fx = (x - minX + padX) / (maxX - minX + 2 * padX || 1);
    const fy = (y - minY + padY) / (maxY - minY + 2 * padY || 1);
    return { cx: fx * width, cy: height - fy * height };
  };

  const clusterColors = ["var(--color-cluster-0)", "var(--color-cluster-1)", "var(--color-cluster-2)", "#7c3aed", "#0ea5e9"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Peta Opini Real-time</p>
          <p className="text-xs text-muted-foreground">
            Posisi {data.total_participants} partisipan berdasarkan pola voting (PCA + KMeans).
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
          <Wifi className="w-3 h-3 text-status-open" />
          Live
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.08" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />
          {data.points.map((p) => {
            const { cx, cy } = project(p.x, p.y);
            return <circle key={p.user_id} cx={cx} cy={cy} r="5" fill={clusterColors[p.cluster % clusterColors.length]} fillOpacity="0.75" />;
          })}
          {data.clusters.map((c) => {
            const { cx, cy } = project(c.centroid[0], c.centroid[1]);
            return (
              <text key={c.id} x={cx} y={cy} fill={clusterColors[c.id % clusterColors.length]} fontSize="11" fontWeight="700" textAnchor="middle">
                {c.label} · {c.size}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        {data.clusters.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: clusterColors[c.id % clusterColors.length] }} />
            <span className="text-xs text-muted-foreground">
              {c.label} <span className="font-medium text-foreground">({c.size})</span>
            </span>
          </div>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">
          Score kohesi: <span className="font-medium text-foreground">{data.cohesion.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function PolicyBriefTab({ slug }: { slug: string }) {
  type Brief = Awaited<ReturnType<typeof deliberation.brief>>;
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const load = useCallback(
    async (regen = false) => {
      try {
        const data = await deliberation.brief(slug, regen);
        setBrief(data);
      } catch (e) {
        if (!(e instanceof ApiError) || e.status !== 404) throw e;
      } finally {
        setLoading(false);
        setRegenerating(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  if (loading) return <div className="h-64 bg-card border border-border rounded-2xl animate-pulse" />;

  if (!brief) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Belum ada brief kebijakan untuk isu ini.</p>
        <button
          onClick={() => {
            setRegenerating(true);
            void load(true);
          }}
          disabled={regenerating}
          className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl"
        >
          {regenerating ? "Memproses..." : "Generate Brief"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <p className="text-xs text-muted-foreground">
            Generator: <span className="font-medium text-foreground">{brief.generated_by}</span> · v{brief.version}
          </p>
        </div>
        <button
          onClick={() => {
            setRegenerating(true);
            void load(true);
          }}
          disabled={regenerating}
          className="text-xs text-primary hover:underline"
        >
          {regenerating ? "Memproses..." : "Regenerate"}
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">Ringkasan Eksekutif</p>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{brief.summary}</p>
        </div>
        {brief.consensus.length > 0 && (
          <div className="space-y-3">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">Titik Konsensus</p>
            {brief.consensus.map((c, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-status-enacted mt-0.5 shrink-0" />
                <p className="text-foreground flex-1">{c.text}</p>
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{c.agree_pct}% setuju</span>
              </div>
            ))}
          </div>
        )}
        {brief.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground">Rekomendasi Kebijakan</p>
            <ol className="space-y-2">
              {brief.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[0.65rem] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedNewsTab({ query }: { query: string }) {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setArticles(null);
    setError(null);
    news
      .search(query, 8)
      .then((items) => setArticles(items))
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat berita."));
  }, [query]);

  if (error) {
    return <p className="text-sm text-status-rejected">{error}</p>;
  }
  if (articles === null) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 bg-card border border-border rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!articles.length) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Tidak ada berita relevan. Pastikan NEXT_PUBLIC_NEWS_API_KEY sudah diisi di .env.local.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        Berita terkait via NewsAPI · query: "{query}"
      </p>
      {articles.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card border border-border rounded-2xl p-5 hover:border-accent/25 transition-all group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </p>
            {article.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <span className="font-medium">{article.source}</span>
              {article.publishedAt && (
                <>
                  <span>·</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString("id-ID")}</span>
                </>
              )}
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
        </a>
      ))}
    </div>
  );
}

function LegalContextTab({ slug }: { slug: string }) {
  const [laws, setLaws] = useState<Awaited<ReturnType<typeof ai.legalContext>>["laws"] | null>(null);
  useEffect(() => {
    ai.legalContext(slug)
      .then((d) => setLaws(d.laws))
      .catch(() => setLaws([]));
  }, [slug]);

  if (laws === null) return <div className="h-32 bg-card border border-border rounded-2xl animate-pulse" />;
  if (!laws.length) return <p className="text-sm text-muted-foreground">Belum ada peraturan relevan yang ditemukan.</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <p className="text-sm text-muted-foreground">
          Regulasi relevan ditemukan via keyword overlap (stub). Aktifkan RAG dengan GEMINI_API_KEY.
        </p>
      </div>
      {laws.map((ref) => (
        <a
          key={ref.id}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card border border-border rounded-2xl p-5 hover:border-accent/25 transition-all flex items-start gap-4"
        >
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
              <div className="h-full bg-accent rounded-full" style={{ width: `${ref.relevance * 100}%` }} />
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
        </a>
      ))}
    </div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DeliberationPage({ params }: PageProps) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [issue, setIssue] = useState<(IssueListItem & { timeline: TimelineEntry[] }) | null>(null);
  const [stances, setStances] = useState<Stance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("pernyataan");
  const [stanceText, setStanceText] = useState("");
  const [posting, setPosting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [stanceSort, setStanceSort] = useState<"newest" | "quality" | "bridge" | "votes">("newest");

  const refreshStances = useCallback(async () => {
    const list = await deliberation.stances(slug, stanceSort);
    setStances(list);
  }, [slug, stanceSort]);

  useEffect(() => {
    setLoading(true);
    Promise.all([issuesApi.detail(slug), deliberation.stances(slug, stanceSort)])
      .then(([d, s]) => {
        setIssue(d);
        setStances(s);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat isu."))
      .finally(() => setLoading(false));
  }, [slug, stanceSort]);

  const currentStage = (issue?.status as StageKey) ?? "DIAJUKAN";
  const stageConfig = STAGES.find((s) => s.key === currentStage);

  const bridges = useMemo(() => stances.filter((s) => s.isBridge), [stances]);
  const divisives = useMemo(() => stances.filter((s) => s.isDivisive), [stances]);
  const votedCount = stances.filter((s) => s.userVote !== null).length;
  const progress = stances.length ? (votedCount / stances.length) * 100 : 0;

  async function handleVote(stanceId: number, value: "agree" | "abstain" | "disagree") {
    const target = stances.find((s) => s.id === stanceId);
    if (!target) return;
    const current = target.userVote;
    const isToggleOff = current === value;
    const next = isToggleOff ? "clear" : value;

    // Optimistic update — adjust counts immediately so the user can't double-click.
    setStances((prev) =>
      prev.map((s) => {
        if (s.id !== stanceId) return s;
        const counts = { agree: s.agreeCount, abstain: s.abstainCount, disagree: s.disagreeCount };
        if (current) counts[current] = Math.max(0, counts[current] - 1);
        if (!isToggleOff) counts[value] += 1;
        return {
          ...s,
          userVote: isToggleOff ? null : value,
          agreeCount: counts.agree,
          abstainCount: counts.abstain,
          disagreeCount: counts.disagree,
          totalVotes: counts.agree + counts.abstain + counts.disagree,
        };
      }),
    );

    try {
      await deliberation.vote(slug, stanceId, next);
      // Don't refresh immediately; the server now matches our optimistic state.
    } catch (e) {
      console.error(e);
      // Rollback on error.
      void refreshStances();
    }
  }

  async function handlePostStance() {
    if (stanceText.length < 20) return;
    setPosting(true);
    try {
      await deliberation.postStance(slug, stanceText);
      setStanceText("");
      await refreshStances();
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  }

  async function handleSubscribe() {
    if (!issue || !user) return;
    try {
      const r = await issuesApi.subscribe(slug, !subscribed);
      setSubscribed(r.subscribed);
    } catch (e) {
      console.error(e);
    }
  }

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
  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-6 text-center">
          <p className="text-status-rejected">{error ?? "Isu tidak ditemukan."}</p>
          <Link href="/issues" className="text-sm text-primary hover:underline">
            Kembali ke daftar isu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <Link href="/issues" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Daftar Isu
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {issue.is_trending && (
                <span className="text-[0.65rem] font-black tracking-[0.1em] uppercase bg-status-hot text-white px-3 py-1 rounded-full">
                  Trending
                </span>
              )}
              <StageBadge stageKey={currentStage} />
              <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{issue.category}</span>
              <span className="text-[0.7rem] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{issue.scopeLabel}</span>
              <div className="w-full sm:ml-auto sm:w-auto flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  onClick={handleSubscribe}
                  disabled={!user}
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl border font-medium transition-all disabled:opacity-50 ${
                    subscribed
                      ? "bg-primary/10 border-primary/25 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{subscribed ? "Berlangganan" : "Ikuti Isu"}</span>
                  <span className="sm:hidden">{subscribed ? "Ikuti" : "Ikuti"}</span>
                </button>
                <button className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bagikan</span>
                </button>
              </div>
            </div>

            <h1 className="font-fraunces text-[1.5rem] sm:text-[2rem] font-bold text-foreground leading-tight">{issue.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{issue.description}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
                  {issue.author.initial}
                </div>
                <div className="truncate">
                  <span className="font-medium text-foreground">{issue.author.name}</span>
                  <span className="text-muted-foreground"> · {issue.author.profession}</span>
                </div>
                <span className="text-[0.6rem] font-black tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full shrink-0">
                  {issue.author.tier}
                </span>
              </div>
              <div className="flex items-center gap-4 sm:gap-5 sm:ml-auto text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{issue.participants}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{issue.stances}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{issue.votes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {issue.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {issue.tags.map((tag) => (
                  <span key={tag} className="text-[0.65rem] text-accent/70 bg-accent/8 px-2.5 py-0.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-border">
            <div className="flex items-center gap-1 -mb-px overflow-x-auto">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8 items-start">
            <div>
              {activeTab === "pernyataan" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress menilai pernyataan</span>
                      <span className="font-medium text-foreground">
                        {votedCount} / {stances.length} pernyataan dinilai
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {stances.length} pernyataan
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Urutkan:</span>
                      <select
                        value={stanceSort}
                        onChange={(e) => setStanceSort(e.target.value as typeof stanceSort)}
                        className="bg-card border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="quality">Relevansi AI</option>
                        <option value="newest">Terbaru</option>
                        <option value="bridge">Bridge dulu</option>
                        <option value="votes">Paling banyak vote</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {stances.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">Belum ada pernyataan untuk isu ini.</p>
                    )}
                    {stances.map((s) => (
                      <StanceCard key={s.id} stance={s} onVote={(v) => handleVote(s.id, v)} authed={!!user} />
                    ))}
                  </div>

                  {stageConfig?.allowComments && user && user.tier === "PEJABAT" && (
                    <div className="bg-muted/30 border border-border rounded-2xl p-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-semibold text-muted-foreground">
                          Pejabat tidak menulis pernyataan
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sebagai perwakilan instansi, Anda mengelola lifecycle isu di{" "}
                        <Link href="/gov" className="text-primary hover:underline">
                          dasbor pemerintah
                        </Link>
                        . Pernyataan deliberatif ditulis oleh Warga dan Pakar.
                      </p>
                    </div>
                  )}
                  {stageConfig?.allowComments && user && user.tier !== "PEJABAT" && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <p className="text-sm font-semibold text-foreground">Tulis Pernyataan Baru</p>
                        <StageBadge stageKey={currentStage} />
                      </div>
                      <div className="relative">
                        <textarea
                          value={stanceText}
                          onChange={(e) => setStanceText(e.target.value.slice(0, 280))}
                          placeholder="Tuliskan pernyataan Anda secara singkat dan substantif..."
                          className="w-full min-h-[100px] p-4 text-sm bg-muted/30 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent leading-relaxed"
                        />
                        <span className="absolute bottom-3 right-3 text-[0.65rem] font-mono text-muted-foreground">
                          {stanceText.length}/280
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <button
                          disabled={stanceText.length < 20 || posting}
                          onClick={handlePostStance}
                          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-primary/90"
                        >
                          {posting ? "Memposting..." : "Posting Pernyataan"}
                        </button>
                      </div>
                    </div>
                  )}

                  {bridges.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <p className="text-sm font-semibold text-foreground">Titik Temu Lintas Kubu</p>
                      </div>
                      {bridges.map((s) => (
                        <div key={s.id} className="bg-primary/[0.04] border border-primary/15 rounded-xl p-4 space-y-2">
                          <div className="flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 text-[0.6rem] font-black tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              BRIDGE
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">&ldquo;{s.content}&rdquo;</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {s.totalVotes ? Math.round((s.agreeCount / s.totalVotes) * 100) : 0}% setuju · konsensus lintas klaster
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {divisives.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-status-hot" />
                        <p className="text-sm font-semibold text-foreground">Titik Divisif</p>
                      </div>
                      {divisives.map((s) => (
                        <div key={s.id} className="bg-status-hot/[0.04] border border-status-hot/15 rounded-xl p-4 space-y-2">
                          <div className="flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 text-[0.6rem] font-black tracking-wider text-status-hot bg-status-hot/10 px-2 py-0.5 rounded-full">
                              DIVISIF
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">&ldquo;{s.content}&rdquo;</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "peta-opini" && <OpinionMap slug={slug} />}
              {activeTab === "hukum" && <LegalContextTab slug={slug} />}
              {activeTab === "brief" && <PolicyBriefTab slug={slug} />}
              {activeTab === "berita" && <RelatedNewsTab query={issue.title} />}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">Tahapan Isu</p>
                <IssueTimeline currentStage={currentStage} timeline={issue.timeline} />
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Statistik</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Partisipan", value: issue.participants.toString(), icon: Users },
                    { label: "Pernyataan", value: issue.stances.toString(), icon: MessageSquare },
                    { label: "Total Vote", value: issue.votes.toLocaleString(), icon: Vote },
                    { label: "Heat Score", value: (issue.heat_score ?? 0).toFixed(2), icon: Flag },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-muted/40 rounded-xl p-3 text-center">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                      <p className="font-fraunces text-lg font-bold text-foreground leading-none">{value}</p>
                      <p className="text-[0.6rem] text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab("hukum")}
                className="w-full text-sm text-primary hover:underline flex items-center justify-center gap-1"
              >
                Lihat konteks hukum <ChevronRight className="w-3 h-3" />
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
