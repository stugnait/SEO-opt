import Link from "next/link";

async function getArticleBySlug(slug) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const res = await fetch(`${baseUrl}/articles/${slug}`, {
        method: "GET",
        cache: "no-store"
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    return res.json();
}

// 🔥 СХОЖІ СТАТТІ
async function getRelatedArticles(article) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const params = new URLSearchParams();

    if (article.category_slug) {
        params.append("category", article.category_slug);
    }

    if (article.tags?.length) {
        const tagSlugs = article.tags.map(tag => tag.slug).join(",");
        params.append("tags", tagSlugs);
    }

    const res = await fetch(`${baseUrl}/articles?${params.toString()}`, {
        method: "GET",
        cache: "no-store"
    });

    if (!res.ok) return [];

    const data = await res.json();

    return data
        .filter(a => a.slug !== article.slug)
        .slice(0, 3);
}

function getImage(url) {
    if (!url) return null;

    if (url.startsWith("http")) return url;
    if (url.startsWith("/images")) return url;

    const backendBase =
        (process.env.NEXT_PUBLIC_API_BASE_URL || "https://seo-opt-production.up.railway.app")
            .replace(/\/api$/, "");

    return `${backendBase}${url}`;
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    const relatedArticles = article ? await getRelatedArticles(article) : [];

    if (!article) {
        return (
            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Статтю не знайдено</h1>
                    <Link href="/" className="text-blue-400 hover:underline">
                        Повернутись на головну
                    </Link>
                </div>
            </div>
        );
    }

    const published = article.published_at
        ? new Date(article.published_at).toLocaleDateString("uk-UA")
        : "Немає";

    const updated = article.updated_at
        ? new Date(article.updated_at).toLocaleDateString("uk-UA")
        : null;

    const avatar =
        article.author_avatar ||
        article.avatar_url ||
        article.author?.avatar_url ||
        null;

    const authorName =
        article.author_name ||
        article.author?.name ||
        "Невідомий автор";

    const authorSlug =
        article.author_slug ||
        article.author?.slug ||
        null;

    const authorBio =
        article.author_bio ||
        article.author?.bio ||
        "Автор блогу";

    return (
        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] py-12 px-6">
            <div className="max-w-4xl mx-auto">

                {/* BREADCRUMBS */}
                <div className="mb-6 flex flex-wrap items-center gap-2 text-[15px] md:text-base font-medium">
                    <Link href="/" className="text-zinc-300 hover:text-blue-400 transition">
                        Головна
                    </Link>

                    <span className="text-zinc-500">→</span>

                    {article.category_slug && (
                        <>
                            <Link
                                href={`/categories/${article.category_slug}`}
                                className="text-zinc-300 hover:text-blue-400 transition"
                            >
                                {article.category_name}
                            </Link>
                            <span className="text-zinc-500">→</span>
                        </>
                    )}

                    <span className="text-white font-semibold">
                        {article.title}
                    </span>
                </div>

                {/* COVER */}
                {article.cover_url && (
                    <img
                        src={getImage(article.cover_url)}
                        alt={article.title}
                        className="w-full h-[360px] object-cover rounded-xl mb-8 border border-zinc-800"
                    />
                )}

                {/* TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {article.title}
                </h1>

                {/* META */}
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-10">
                    <span>
                        📁{" "}
                        {article.category_slug ? (
                            <Link href={`/categories/${article.category_slug}`} className="text-blue-400 hover:underline">
                                {article.category_name}
                            </Link>
                        ) : "Немає"}
                    </span>

                    <span>📅 {published}</span>

                    {updated && <span>✏️ Оновлено: {updated}</span>}

                    <span>👁 {article.views ?? 0}</span>
                </div>

                {/* AUTHOR */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-5 items-center mb-10">
                    {avatar ? (
                        <img
                            src={getImage(avatar)}
                            alt={authorName}
                            className="w-16 h-16 rounded-full object-cover border border-zinc-700"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                            👤
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="text-sm text-zinc-400">Автор</div>

                        {authorSlug ? (
                            <Link href={`/authors/${authorSlug}`} className="text-lg font-semibold text-blue-400 hover:underline">
                                {authorName}
                            </Link>
                        ) : (
                            <div className="text-lg font-semibold">{authorName}</div>
                        )}

                        <p className="text-zinc-400 text-sm mt-1">
                            {authorBio}
                        </p>
                    </div>
                </div>

                {/* TAGS */}
                <div className="mb-8">
                    <div className="text-sm text-zinc-400 mb-3">Теги</div>

                    <div className="flex flex-wrap gap-2">
                        {article.tags?.length ? (
                            article.tags.map((tag) => (
                                <Link
                                    key={tag.slug}
                                    href={`/tags/${tag.slug}`}
                                    className="px-3 py-1 text-sm rounded-full bg-zinc-800 hover:bg-blue-600 transition"
                                >
                                    #{tag.name}
                                </Link>
                            ))
                        ) : (
                            <span className="text-zinc-500">Немає</span>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <article className="text-zinc-300 leading-8 text-[17px] whitespace-pre-line">
                    {article.content || "Немає"}
                </article>

                {/* RELATED ARTICLES */}
                {relatedArticles.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Схожі статті
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedArticles.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/articles/${item.slug}`}
                                    className="group block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 transition"
                                >
                                    {item.cover_url && (
                                        <img
                                            src={getImage(item.cover_url)}
                                            alt={item.title}
                                            className="w-full h-[160px] object-cover group-hover:scale-105 transition"
                                        />
                                    )}

                                    <div className="p-4">
                                        {item.category_name && (
                                            <div className="text-xs text-blue-400 mb-2">
                                                {item.category_name}
                                            </div>
                                        )}

                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                                            {item.title}
                                        </h3>

                                        {item.published_at && (
                                            <div className="text-xs text-zinc-500 mt-2">
                                                {new Date(item.published_at).toLocaleDateString("uk-UA")}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}