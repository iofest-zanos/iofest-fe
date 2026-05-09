// Thin fetch wrapper around the SuaraKita Django API. Token persisted in localStorage.

const ENV_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
export const API_BASE = ENV_BASE && ENV_BASE.length > 0 ? ENV_BASE : "http://127.0.0.1:8000/api";

const ACCESS_KEY = "sk_access";
const REFRESH_KEY = "sk_refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, payload: unknown, message: string) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function refreshAccess(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  setTokens(data.access);
  return data.access;
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const access = getAccessToken();
  if (options.auth !== false && access) headers["Authorization"] = `Bearer ${access}`;

  let res = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (res.status === 401 && options.auth !== false) {
    const newAccess = await refreshAccess();
    if (newAccess) {
      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await fetch(buildUrl(path, options.query), {
        method: options.method ?? "GET",
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
      });
    }
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "detail" in payload && typeof payload.detail === "string"
        ? payload.detail
        : `Request gagal (${res.status})`) || `Request gagal (${res.status})`;
    throw new ApiError(res.status, payload, message);
  }
  return payload as T;
}

// ── Domain endpoints ────────────────────────────────────────────────

export interface MeUser {
  id: number;
  email: string;
  name: string;
  profession: string;
  bio: string;
  tier: "WARGA" | "PAKAR" | "PEJABAT";
  phone: string;
  avatar_initial: string;
  is_email_verified: boolean;
  instansi: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: MeUser;
}

export const auth = {
  register: (body: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    profession?: string;
    bio?: string;
  }) => apiRequest<{ message: string; email: string }>("/auth/register", { method: "POST", body, auth: false }),
  verifyOtp: (body: { email: string; code: string }) =>
    apiRequest<AuthResponse>("/auth/verify-otp", { method: "POST", body, auth: false }),
  resendOtp: (email: string) => apiRequest("/auth/resend-otp", { method: "POST", body: { email }, auth: false }),
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body, auth: false }),
  me: () => apiRequest<MeUser>("/users/me"),
  patchMe: (body: Partial<MeUser>) => apiRequest<MeUser>("/users/me", { method: "PATCH", body }),
};

export interface IssueAuthor {
  name: string;
  profession: string;
  tier: "WARGA" | "PAKAR" | "PEJABAT";
  initial: string;
}

export interface IssueListItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  category: string;
  scope: string;
  scopeKey: string;
  scopeLabel: string;
  tags: string[];
  author: IssueAuthor;
  participants: number;
  stances: number;
  votes: number;
  timeAgo: string;
  is_trending: boolean;
  heat_score: number;
  forwarded_to: string;
  notes: string;
  created_at: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const issues = {
  list: (params?: { status?: string; category?: string; scope?: string; q?: string; sort?: string }) =>
    apiRequest<Paginated<IssueListItem>>("/issues/", { query: params, auth: false }),
  detail: (slug: string) => apiRequest<IssueListItem & { timeline: TimelineEntry[] }>(`/issues/${slug}/`, { auth: false }),
  create: (body: { title: string; description: string; category: string; scope: string; tags: string[] }) =>
    apiRequest<IssueListItem>("/issues/", { method: "POST", body }),
  updateStatus: (slug: string, body: { stage: string; note?: string; forwarded_to?: string }) =>
    apiRequest<IssueListItem>(`/issues/${slug}/status/`, { method: "PATCH", body }),
  subscribe: (slug: string, on: boolean) =>
    apiRequest<{ subscribed: boolean }>(`/issues/${slug}/subscribe/`, { method: on ? "POST" : "DELETE" }),
};

export interface TimelineEntry {
  stage: string;
  from_stage: string;
  note: string;
  actor: string;
  created_at: string;
}

export interface Stance {
  id: number;
  content: string;
  author: IssueAuthor;
  agreeCount: number;
  abstainCount: number;
  disagreeCount: number;
  totalVotes: number;
  isBridge: boolean;
  isDivisive: boolean;
  qualityScore: number | null;
  stageKey: string;
  timeAgo: string;
  userVote: "agree" | "abstain" | "disagree" | null;
  cluster_breakdown: Record<string, { agree_pct: number; n: number }>;
  created_at: string;
}

export const deliberation = {
  // NOTE: auth dikirim opsional supaya backend bisa hitung userVote per user.
  stances: (slug: string, sort: "newest" | "quality" | "bridge" | "votes" = "newest") =>
    apiRequest<Stance[]>(`/issues/${slug}/stances`, { query: { sort } }),
  postStance: (slug: string, content: string) =>
    apiRequest<Stance>(`/issues/${slug}/stances`, { method: "POST", body: { content } }),
  vote: (slug: string, stanceId: number, value: "agree" | "abstain" | "disagree" | "clear") =>
    apiRequest<{ vote: string | null }>(`/issues/${slug}/stances/${stanceId}/vote`, {
      method: "POST",
      body: { value },
    }),
  clusters: (slug: string, recompute = false) =>
    apiRequest<{
      clusters: { id: number; label: string; size: number; centroid: [number, number] }[];
      points: { user_id: number; x: number; y: number; cluster: number }[];
      cohesion: number;
      total_participants: number;
      total_stances: number;
      stance_breakdown?: Record<string, Record<string, { agree_pct: number; n: number }>>;
      note?: string;
    }>(`/issues/${slug}/clusters`, { method: recompute ? "POST" : "GET", auth: false }),
  brief: (slug: string, regenerate = false) =>
    apiRequest<{
      summary: string;
      consensus: { text: string; agree_pct: number }[];
      divisive: { text: string }[];
      recommendations: string[];
      generated_by: string;
      version: number;
      updated_at: string;
    }>(`/issues/${slug}/policy-brief`, { method: regenerate ? "POST" : "GET", auth: false }),
};

export interface ThreadListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  category: string;
  author: IssueAuthor;
  replies: number;
  views: number;
  upvotes: number;
  heatScore: number;
  tags: string[];
  timeAgo: string;
  isAnswered: boolean;
  created_at: string;
}

export interface ForumReply {
  id: number;
  content: string;
  author: IssueAuthor;
  upvotes: number;
  isBestAnswer: boolean;
  userUpvoted: boolean;
  timeAgo: string;
  created_at: string;
}

export interface ThreadDetail extends Omit<ThreadListItem, "replies"> {
  content: string;
  isBookmarked: boolean;
  userUpvoted: boolean;
  replies: ForumReply[];
}

export const forum = {
  list: (params?: { category?: string; q?: string; sort?: string }) =>
    apiRequest<ThreadListItem[]>("/forum/threads", { query: params, auth: false }),
  detail: (slug: string, replySort: "newest" | "oldest" | "likes" = "newest") =>
    apiRequest<ThreadDetail>(`/forum/threads/${slug}`, { query: { reply_sort: replySort } }),
  reply: (slug: string, content: string) =>
    apiRequest<ForumReply>(`/forum/threads/${slug}`, { method: "POST", body: { content } }),
  create: (body: { title: string; content: string; category: string; tags: string[] }) =>
    apiRequest<ThreadDetail>("/forum/threads", { method: "POST", body }),
  bookmark: (slug: string, on: boolean) =>
    apiRequest<{ bookmarked: boolean }>(`/forum/threads/${slug}/bookmark`, { method: on ? "POST" : "DELETE" }),
  upvoteThread: (slug: string, on: boolean) =>
    apiRequest<{ upvoted: boolean; upvotes: number }>(`/forum/threads/${slug}/upvote`, {
      method: on ? "POST" : "DELETE",
    }),
  upvoteReply: (replyId: number, on: boolean) =>
    apiRequest<{ upvoted: boolean; upvotes: number }>(`/forum/replies/${replyId}/upvote`, {
      method: on ? "POST" : "DELETE",
    }),
  myBookmarks: () => apiRequest<ThreadListItem[]>("/forum/bookmarks"),
};

export interface LawDocument {
  id: number;
  code: string;
  type: string;
  number: string;
  year: number;
  title: string;
  description: string;
  status: string;
  category: string;
  dateEnacted: string;
  tags: string[];
  url: string;
  views: number;
  bookmarked: boolean;
}

export const laws = {
  list: (params?: { type?: string; status?: string; q?: string }) =>
    apiRequest<LawDocument[]>("/laws/", { query: params }),
  detail: (code: string) => apiRequest<LawDocument>(`/laws/${code}`),
  bookmark: (code: string, on: boolean) =>
    apiRequest<{ bookmarked: boolean }>(`/laws/${code}/bookmark`, { method: on ? "POST" : "DELETE" }),
};

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  author: string;
}

export const news = {
  search: (q: string, pageSize = 10) =>
    fetch(`/api/news?q=${encodeURIComponent(q)}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then(
        (d: { articles?: NewsArticle[]; error?: string }) =>
          (d.articles ?? []) as NewsArticle[],
      ),
};

export const ai = {
  legalContext: (slug: string) =>
    apiRequest<{ laws: { id: string; type: string; number: string; title: string; relevance: number; url: string }[] }>(
      `/ai/issues/${slug}/legal-context`,
      { auth: false },
    ),
  stanceQuality: (content: string) =>
    apiRequest<{ score: number }>("/ai/stance-quality", { method: "POST", body: { content }, auth: false }),
};
