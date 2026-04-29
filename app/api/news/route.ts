import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "Indonesia kebijakan pemerintah";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";
    const category = searchParams.get("category") || "";

    if (!NEWS_API_KEY || NEWS_API_KEY === "your_newsapi_key_here") {
      return NextResponse.json(
        { 
          error: "API key belum dikonfigurasi",
          message: "Silakan tambahkan NEXT_PUBLIC_NEWS_API_KEY di file .env.local"
        },
        { status: 500 }
      );
    }

    // Build URL untuk NewsAPI
    let apiUrl: string;
    
    if (category && category !== "all") {
      // Gunakan top-headlines untuk kategori
      apiUrl = `${NEWS_API_BASE_URL}/top-headlines?country=id&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    } else {
      // Gunakan everything untuk search
      apiUrl = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=id&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    }

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache 1 jam
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: "Gagal mengambil data dari NewsAPI",
          message: errorData.message || "Unknown error"
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Format data untuk frontend
    const formattedArticles = data.articles.map((article: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || "Unknown",
      author: article.author || article.source?.name || "Unknown",
    }));

    return NextResponse.json({
      articles: formattedArticles,
      totalResults: data.totalResults,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
