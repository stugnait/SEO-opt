"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function getArticles(page = 1, limit = 10) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://seo-opt-production.up.railway.app";

    // Стукаємо напряму на бекенд
    const res = await fetch(`${baseUrl}/articles?page=${page}&limit=${limit}`);

    if (!res.ok) throw new Error("Failed to load articles");
    return res.json();
}

async function getArticleTags(slug) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://seo-opt-production.up.railway.app";

        // Беремо теги напряму з бекенду
        const res = await fetch(`${baseUrl}/articles/${encodeURIComponent(slug)}`);

        if (!res.ok) return [];
        const data = await res.json();
        return data.tags || [];
    } catch {
        return [];
    }
}
function slugify(text) {
    return text
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-а-яіїєґ]/gi, "");
}

function readingTime(text = "") {
    const words = text.split(" ").length;
    return Math.ceil(words / 200);
}

export default function HomePage() {
    const router = useRouter();

    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadArticles() {
            try {
                setLoading(true);

                const data = await getArticles(page, 10);

                if (!Array.isArray(data)) {
                    setArticles([]);
                    return;
                }

                const articlesWithTags = await Promise.all(
                    data.map(async (article) => {
                        const tags = await getArticleTags(article.slug);
                        return { ...article, tags };
                    })
                );

                setArticles(articlesWithTags);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadArticles();
    }, [page]);

    function handleSearch(e) {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/search?q=${encodeURIComponent(search)}`);
    }

    function goAdmin() {
        router.push("/admin");
    }

    function logout() {
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push("/auth/login");
    }

    return (
        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)]">

            {/* HERO */}

            <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">

                <h2 className="text-5xl font-bold mb-4 leading-tight">

                    Discover{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Programming
          </span>{" "}
                    Knowledge

                </h2>

                <p className="text-zinc-400 mb-10 max-w-xl">
                    Tutorials, tips and insights from the world of software development.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="flex gap-3 max-w-xl"
                >

                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Search
                    </button>

                </form>

            </section>

            {/* ARTICLES */}

            <main className="max-w-7xl mx-auto px-6 pb-20">

                {loading && (
                    <div className="grid md:grid-cols-3 gap-6">

                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-60 bg-zinc-900 animate-pulse rounded-xl"
                            />
                        ))}

                    </div>
                )}

                {!loading && articles.length === 0 && (
                    <p className="text-zinc-500">No articles yet</p>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {articles.map((article) => (

                        <article
                            key={article.id}
                            className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                        >

                            {article.cover_url && (

                                <img
                                    src={article.cover_url}
                                    alt={article.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                                />

                            )}

                            <div className="p-5 flex flex-col gap-4">

                                <h3 className="text-lg font-semibold group-hover:text-blue-400 transition">

                                    <Link href={`/articles/${encodeURIComponent(article.slug)}`}>
                                        {article.title}
                                    </Link>

                                </h3>

                                <p className="text-zinc-400 text-sm line-clamp-3">
                                    {article.excerpt || "Без опису"}
                                </p>

                                {/* META */}

                                <div className="text-xs text-zinc-500 flex justify-between">

                  <span>

                    👤{" "}

                      {article.author_slug ? (
                          <Link
                              href={`/authors/${encodeURIComponent(article.author_slug)}`}
                              className="hover:text-blue-400"
                          >
                              {article.author_name}
                          </Link>
                      ) : (
                          article.author_name || "Unknown"
                      )}

                  </span>

                                    <span>
                    ⏱ {readingTime(article.excerpt)} min
                  </span>

                                </div>

                                {/* TAGS */}

                                <div className="flex flex-wrap gap-2">

                                    {article.tags?.length ? (
                                        article.tags.map((tag) => (

                                            <Link
                                                key={tag.slug}
                                                href={`/tags/${encodeURIComponent(tag.slug)}`}
                                                className="text-xs px-3 py-1 rounded-full bg-zinc-800 hover:bg-blue-600 transition"
                                            >
                                                #{tag.name}
                                            </Link>

                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-600">
                      No tags
                    </span>
                                    )}

                                </div>

                            </div>

                        </article>

                    ))}

                </div>

                {/* PAGINATION */}

                <div className="flex justify-center items-center gap-6 mt-16">

                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-6 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                    >
                        ← Previous
                    </button>

                    <span className="text-lg font-semibold">
            {page}
          </span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-6 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                    >
                        Next →
                    </button>

                </div>

            </main>

        </div>
    );
}