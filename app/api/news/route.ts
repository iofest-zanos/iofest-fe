import { NextRequest, NextResponse } from "next/server";

// Google News RSS — tanpa API key, cakupan Indonesia jauh lebih baik daripada
// NewsAPI free tier (yang punya 0 hasil untuk query niche bahasa Indonesia).

const GNEWS_BASE = "https://news.google.com/rss/search";

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripCdata(s: string): string {
  const m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1] : s;
}

function pickTag(item: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = item.match(re);
  if (!m) return "";
  return decodeEntities(stripCdata(m[1])).trim();
}

interface ParsedItem {
  title: string;
  link: string;
  description: string;
  source: string;
  pubDate: string;
}

function parseRss(xml: string): ParsedItem[] {
  const out: ParsedItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const item = m[1];
    const fullTitle = pickTag(item, "title");
    // Google News titles end with " - SourceName"
    const dashIdx = fullTitle.lastIndexOf(" - ");
    const title = dashIdx > 0 ? fullTitle.slice(0, dashIdx) : fullTitle;
    const source = dashIdx > 0 ? fullTitle.slice(dashIdx + 3) : "";

    // Description on Google News is wrapped HTML; strip tags for snippet.
    const rawDesc = pickTag(item, "description");
    const descText = rawDesc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    out.push({
      title,
      link: pickTag(item, "link"),
      description: descText,
      source,
      pubDate: pickTag(item, "pubDate"),
    });
  }
  return out;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "kebijakan publik Indonesia";
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10", 10), 30);

    const url = `${GNEWS_BASE}?q=${encodeURIComponent(query)}&hl=id&gl=ID&ceid=ID:id`;
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30 menit cache
      headers: { "User-Agent": "Mozilla/5.0 SuaraKita" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil RSS", status: res.status, articles: [] },
        { status: 502 },
      );
    }

    const xml = await res.text();
    const items = parseRss(xml).slice(0, pageSize);

    const articles = items.map((it, i) => ({
      id: `${Date.now()}-${i}`,
      title: it.title,
      description: it.description,
      content: "",
      url: it.link,
      imageUrl: "",
      publishedAt: it.pubDate ? new Date(it.pubDate).toISOString() : "",
      source: it.source || "Google News",
      author: it.source || "",
    }));

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      query,
      provider: "google-news-rss",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown",
        articles: [],
      },
      { status: 500 },
    );
  }
}
