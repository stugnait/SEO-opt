import Link from "next/link";

async function getArticleBySlug(slug) {
    // Беремо адресу бекенду з Railway
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://seo-opt-production.up.railway.app";

    const res = await fetch(
        `${baseUrl}/api/articles/${slug}`, // Стукаємо прямо на бекенд
        {
            method: "GET",
            cache: "no-store"
        }
    );

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
}

export default async function ArticlePage({ params }) {

    const { slug } = await params;

    const article = await getArticleBySlug(slug);

    if (!article) {

        return (

            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

                <div className="max-w-3xl mx-auto">

                    <h1 className="text-4xl font-bold mb-4">
                        Статтю не знайдено
                    </h1>

                    <Link
                        href="/apps/frontend/public"
                        className="text-blue-400 hover:underline"
                    >
                        Повернутись на головну
                    </Link>

                </div>

            </div>

        );

    }

    const date = article.published_at
        ? new Date(article.published_at).toLocaleDateString("uk-UA")
        : "Немає";

    return (

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] py-12 px-6">

            <div className="max-w-4xl mx-auto">

                {/* COVER */}

                {article.cover_url && (

                    <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-[360px] object-cover rounded-xl mb-8 border border-zinc-800"
                    />

                )}

                {/* TITLE */}

                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                    {article.title}

                </h1>

                {/* META */}

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-8">

          <span>
            👤 Автор:{" "}
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
            📁 Категорія:{" "}
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
            📅 Дата: {date}
          </span>

                    <span>
            👁 Перегляди: {article.views ?? 0}
          </span>

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

                            <span className="text-zinc-500">
                Немає
              </span>

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