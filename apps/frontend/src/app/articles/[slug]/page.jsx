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

    // 🔥 автор
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

                    {updated && (
                        <span>✏️ Оновлено: {updated}</span>
                    )}

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

                        <div className="text-sm text-zinc-400">
                            Автор
                        </div>

                        {authorSlug ? (
                            <Link
                                href={`/authors/${authorSlug}`}
                                className="text-lg font-semibold text-blue-400 hover:underline"
                            >
                                {authorName}
                            </Link>
                        ) : (
                            <div className="text-lg font-semibold">
                                {authorName}
                            </div>
                        )}

                        <p className="text-zinc-400 text-sm mt-1">
                            {authorBio}
                        </p>

                    </div>

                </div>

                {/* TAGS */}
                <div className="mb-8">

                    <div className="text-sm text-zinc-400 mb-3">
                        Теги
                    </div>

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

            </div>

        </div>
    );
}