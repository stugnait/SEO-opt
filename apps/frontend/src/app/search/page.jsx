"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

async function getArticleFull(slug) {
    try {
        const res = await fetch(`/api/proxy/articles/${encodeURIComponent(slug)}`);

        if (!res.ok) return null;

        return await res.json();

    } catch {
        return null;
    }
}

export default function SearchPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState(query);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!query) return;

        async function searchArticles() {

            try {

                setLoading(true);

                const res = await fetch(`/api/proxy/articles`);

                if (!res.ok) {
                    throw new Error("Search failed");
                }

                const data = await res.json();

                const filtered = data.filter(article =>

                    article.title?.toLowerCase().includes(query.toLowerCase()) ||
                    article.excerpt?.toLowerCase().includes(query.toLowerCase())

                );

                if (!Array.isArray(filtered)) {
                    setArticles([]);
                    return;
                }

                const fullArticles = await Promise.all(

                    filtered.map(async (article) => {

                        const full = await getArticleFull(article.slug);

                        return full || article;

                    })

                );

                setArticles(fullArticles);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        searchArticles();

    }, [query]);

    function handleSearch(e) {

        e.preventDefault();

        if (!search.trim()) return;

        router.push(`/search?q=${encodeURIComponent(search)}`);

    }

    return (

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] py-12 px-6">

            <div className="max-w-4xl mx-auto">

                {/* TITLE */}

                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Пошук статей
                </h1>

                {/* SEARCH */}

                <form
                    onSubmit={handleSearch}
                    className="flex gap-3 mb-10"
                >

                    <input
                        type="text"
                        placeholder="Пошук..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition shadow"
                    >
                        Пошук
                    </button>

                </form>

                {/* RESULT INFO */}

                {query && (

                    <p className="text-zinc-400 mb-10">

                        Результати для:{" "}
                        <span className="font-semibold text-white">
              {query}
            </span>{" "}
                        ({articles.length})

                    </p>

                )}

                {loading && (

                    <p className="text-zinc-500">
                        Пошук...
                    </p>

                )}

                {/* ARTICLES */}

                <div className="flex flex-col gap-8">

                    {!loading && articles.length === 0 && (

                        <p className="text-zinc-500">
                            Нічого не знайдено
                        </p>

                    )}

                    {articles.map(article => (

                        <div
                            key={article.id}
                            className="group border border-zinc-800 rounded-xl p-6 shadow hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition bg-zinc-900"
                        >

                            {/* COVER */}

                            {article.cover_url && (

                                <img
                                    src={article.cover_url}
                                    alt={article.title}
                                    className="w-full h-52 object-cover rounded-lg mb-5"
                                />

                            )}

                            {/* TITLE */}

                            <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition">

                                <Link
                                    href={`/articles/${encodeURIComponent(article.slug)}`}
                                >
                                    {article.title}
                                </Link>

                            </h2>

                            {/* DESCRIPTION */}

                            <p className="text-zinc-400 mb-4 line-clamp-3">

                                {article.excerpt ||
                                    article.content?.slice(0,160) ||
                                    "Без опису"}

                            </p>

                            {/* META */}

                            <div className="text-sm text-zinc-500 flex flex-wrap gap-3">

                <span>

                  👤{" "}

                    {article.author_slug ? (

                        <Link
                            href={`/authors/${article.author_slug}`}
                            className="text-blue-400 hover:underline"
                        >
                            {article.author_name}
                        </Link>

                    ) : "Немає"}

                </span>

                                <span>

                  📁{" "}

                                    {article.category_slug ? (

                                        <Link
                                            href={`/categories/${article.category_slug}`}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {article.category_name}
                                        </Link>

                                    ) : "Немає"}

                </span>

                                <span>

                  🏷{" "}

                                    {article.tags?.length ? (

                                        article.tags.map(tag => (

                                            <Link
                                                key={tag.slug}
                                                href={`/tags/${tag.slug}`}
                                                className="text-blue-400 hover:underline mr-2"
                                            >
                                                {tag.name}
                                            </Link>

                                        ))

                                    ) : "Немає"}

                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}