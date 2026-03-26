"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

// FIX ДЛЯ КАРТИНОК
function getImage(url) {
    if (!url) return null;

    if (url.startsWith("http")) return url;
    if (url.startsWith("/images")) return url;

    const backendBase =
        (process.env.NEXT_PUBLIC_API_BASE_URL || "https://seo-opt-production.up.railway.app")
            .replace(/\/api$/, "");

    return `${backendBase}${url}`;
}

// 🔥 SLUG HELPER
function makeSlug(name = "") {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-а-яіїєґ]/gi, "");
}

export default function AuthorPage() {

    const params = useParams();
    const slug = decodeURIComponent(params.slug);

    const [author, setAuthor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!slug) return;

        async function loadData() {

            try {

                setLoading(true);

                const authorRes = await fetch(`/api/proxy/authors/${encodeURIComponent(slug)}`);
                const authorData = await authorRes.json();

                setAuthor(authorData);

                const articlesRes = await fetch(`/api/proxy/authors/${encodeURIComponent(slug)}/articles`);
                const list = await articlesRes.json();

                if (!Array.isArray(list)) {
                    setArticles([]);
                    return;
                }

                const fullArticles = await Promise.all(
                    list.map(async (article) => {
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

        loadData();

    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen text-zinc-400 bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">
                Завантаження...
            </div>
        );
    }

    if (!author) {
        return (
            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">
                Автор не знайдений
            </div>
        );
    }

    const authorSlug = author.slug || makeSlug(author.name);

    return (

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] py-12 px-6">

            {/* HEADER АВТОРА */}

            <div className="max-w-5xl mx-auto mb-16 flex flex-col md:flex-row items-center gap-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

                {/* AVATAR */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">

                    {author.avatar_url ? (
                        <img
                            src={getImage(author.avatar_url)}
                            alt={author.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-xl">
                            👤
                        </div>
                    )}

                </div>

                {/* INFO */}
                <div className="flex-1 text-center md:text-left">

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {author.name}
                    </h1>

                    <p className="text-zinc-400 mt-3 max-w-xl">
                        {author.bio || "Автор блогу"}
                    </p>

                    {/* 🔥 СОЦІАЛЬНІ КНОПКИ */}
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">

                        <a
                            href={`https://github.com/${authorSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition text-sm"
                        >
                            GitHub
                        </a>

                        <a
                            href={`https://linkedin.com/in/${authorSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            LinkedIn
                        </a>

                    </div>

                </div>

                {/* STATS */}
                <div className="text-center">

                    <div className="text-3xl font-bold text-blue-400">
                        {articles.length}
                    </div>

                    <div className="text-zinc-400 text-sm">
                        Статей
                    </div>

                </div>

            </div>

            {/* TITLE */}

            <div className="max-w-5xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold">
                    Статті автора
                </h2>
            </div>

            {/* ARTICLES */}

            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                {articles.length === 0 && (
                    <p className="text-zinc-500">
                        У цього автора ще немає статей
                    </p>
                )}

                {articles.map(article => (

                    <div
                        key={article.id}
                        className="group border border-zinc-800 rounded-xl p-6 shadow hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition bg-zinc-900"
                    >

                        {article.cover_url && (
                            <img
                                src={getImage(article.cover_url)}
                                alt={article.title}
                                className="w-full h-52 object-cover rounded-lg mb-5"
                            />
                        )}

                        <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition">
                            <Link href={`/articles/${encodeURIComponent(article.slug)}`}>
                                {article.title}
                            </Link>
                        </h2>

                        <p className="text-zinc-400 mb-4 line-clamp-3">
                            {article.excerpt || "Без опису"}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );
}