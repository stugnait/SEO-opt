"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

async function getArticleFull(slug){

    try{

        const res = await fetch(`/api/proxy/articles/${encodeURIComponent(slug)}`);

        if(!res.ok) return null;

        return await res.json();

    }catch{

        return null;

    }

}

export default function CategoryPage(){

    const params = useParams();
    const slug = decodeURIComponent(params.slug);

    const [category,setCategory] = useState(null);
    const [articles,setArticles] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{

        if(!slug) return;

        async function loadData(){

            try{

                setLoading(true);

                const catRes = await fetch("/api/proxy/categories");
                const categories = await catRes.json();

                const currentCategory = categories.find(
                    (c)=>c.slug === slug
                );

                setCategory(currentCategory || null);

                const artRes = await fetch(
                    `/api/proxy/categories/${encodeURIComponent(slug)}/articles`
                );

                const list = await artRes.json();

                if(!Array.isArray(list)){
                    setArticles([]);
                    return;
                }

                const fullArticles = await Promise.all(

                    list.map(async(article)=>{

                        const full = await getArticleFull(article.slug);

                        return full || article;

                    })

                );

                setArticles(fullArticles);

            }catch(err){

                console.error(err);

            }finally{

                setLoading(false);

            }

        }

        loadData();

    },[slug]);

    if(loading){

        return(
            <div className="min-h-screen text-zinc-400 bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">
                Завантаження...
            </div>
        );

    }

    if(!category){

        return(
            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">
                Категорію не знайдено
            </div>
        );

    }

    return(

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] py-12 px-6">

            {/* CATEGORY HEADER */}

            <div className="max-w-4xl mx-auto mb-14">

                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                    {category.name}

                </h1>

                <p className="text-zinc-400 mt-3 max-w-xl">
                    {category.description || "Категорія блогу"}
                </p>

            </div>

            {/* ARTICLES TITLE */}

            <div className="max-w-4xl mx-auto mb-8">

                <h2 className="text-2xl font-semibold">
                    Статті категорії ({articles.length})
                </h2>

            </div>

            {/* ARTICLES */}

            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {articles.length === 0 && (

                    <p className="text-zinc-500">
                        У цій категорії ще немає статей
                    </p>

                )}

                {articles.map(article=>(

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

                        {/* EXCERPT */}

                        <p className="text-zinc-400 mb-4 line-clamp-3">
                            {article.excerpt || "Без опису"}
                        </p>

                        {/* META */}

                        <div className="text-sm text-zinc-500 flex flex-wrap gap-3">

              <span>

                👤{" "}

                  {article.author_slug && (

                      <Link
                          href={`/authors/${article.author_slug}`}
                          className="text-blue-400 hover:underline"
                      >
                          {article.author_name}
                      </Link>

                  )}

              </span>

                            <span>

                📁{" "}

                                {article.category_slug && (

                                    <Link
                                        href={`/categories/${article.category_slug}`}
                                        className="text-blue-400 hover:underline"
                                    >
                                        {article.category_name}
                                    </Link>

                                )}

              </span>

                            <span>

                🏷{" "}

                                {article.tags?.length ? (

                                    article.tags.map(tag=>(

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

    );

}