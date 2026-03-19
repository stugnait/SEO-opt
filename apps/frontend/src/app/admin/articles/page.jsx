"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    Pencil,
    Trash2,
    Plus,
    User,
    Folder,
    ArrowLeft
} from "lucide-react";

export default function AdminArticles() {

    const router = useRouter();

    const [articles,setArticles] = useState([]);
    const [loading,setLoading] = useState(true);

    const [deleteId,setDeleteId] = useState(null);
    const [deleteLoading,setDeleteLoading] = useState(false);

    const dialogRef = useRef(null);

    function token(){

        return document.cookie
            .split("; ")
            .find(r=>r.startsWith("token="))
            ?.split("=")[1];

    }

    async function loadArticles(){

        try{

            const res = await fetch("/proxy/admin/articles",{
                headers:{Authorization:`Bearer ${token()}`}
            });

            const data = await res.json();

            let list = [];

            if(Array.isArray(data)) list = data;
            else if(Array.isArray(data.articles)) list = data.articles;
            else if(Array.isArray(data.data)) list = data.data;

            setArticles(list);

        }catch(e){

            console.error(e);
            setArticles([]);

        }finally{

            setLoading(false);

        }

    }

    function openDeleteModal(id){

        setDeleteId(id);
        dialogRef.current?.showModal();

    }

    function closeModal(){

        dialogRef.current?.close();
        setDeleteId(null);

    }

    async function confirmDelete(){

        try{

            setDeleteLoading(true);

            await fetch(`/api/proxy/admin/articles/${deleteId}`,{
                method:"DELETE",
                headers:{Authorization:`Bearer ${token()}`}
            });

            closeModal();
            loadArticles();

        }catch(e){

            console.error(e);

        }finally{

            setDeleteLoading(false);

        }

    }

    useEffect(()=>{
        loadArticles();
    },[]);

    return(

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-12">

                <div className="flex items-center gap-5">

                    <button
                        onClick={()=>router.back()}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >

                        <ArrowLeft size={18}/>
                        Назад

                    </button>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        Статті

                    </h1>

                </div>

                <Link
                    href="/admin/articles/create"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition shadow-lg"
                >

                    <Plus size={18}/>
                    Створити

                </Link>

            </div>

            {/* LOADING */}

            {loading && (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {Array.from({length:6}).map((_,i)=>(

                        <div
                            key={i}
                            className="h-64 rounded-xl bg-zinc-900 animate-pulse"
                        />

                    ))}

                </div>

            )}

            {/* EMPTY */}

            {!loading && articles.length === 0 && (

                <div className="text-zinc-500 text-lg">
                    Немає статей
                </div>

            )}

            {/* GRID */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {articles.map(article=>(

                    <div
                        key={article.id}
                        className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col transition transform hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]"
                    >

                        {/* COVER */}

                        {article.cover_url ? (

                            <img
                                src={article.cover_url}
                                alt={article.title}
                                className="h-52 w-full object-cover group-hover:scale-105 transition"
                            />

                        ) : (

                            <div className="h-52 flex items-center justify-center bg-zinc-800 text-zinc-500">
                                Немає зображення
                            </div>

                        )}

                        <div className="p-5 flex flex-col flex-grow">

                            {/* TITLE */}

                            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">

                                {article.title || "Без назви"}

                            </h2>

                            {/* DESCRIPTION */}

                            <p className="text-zinc-400 text-sm mb-4 line-clamp-3">

                                {article.excerpt ||
                                    article.content ||
                                    "Немає опису"}

                            </p>

                            {/* META */}

                            <div className="text-sm text-zinc-500 mb-6 space-y-1">

                                <div className="flex items-center gap-2">

                                    <User size={16}/>

                                    <span>

                    {article.author_name ||
                        article.author ||
                        "Немає автора"}

                  </span>

                                </div>

                                <div className="flex items-center gap-2">

                                    <Folder size={16}/>

                                    <span>

                    {article.category_name ||
                        article.category ||
                        "Немає категорії"}

                  </span>

                                </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex gap-3 mt-auto">

                                <Link
                                    href={`/admin/articles/edit/${article.id}`}
                                    className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
                                >

                                    <Pencil size={16}/>
                                    Редагувати

                                </Link>

                                <button
                                    onClick={()=>openDeleteModal(article.id)}
                                    className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
                                >

                                    <Trash2 size={16}/>
                                    Видалити

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* DELETE MODAL */}

            <dialog
                ref={dialogRef}
                className="rounded-xl p-0 bg-zinc-900 text-white backdrop:bg-black/60 border border-zinc-800"
            >

                <div className="w-[420px] p-6">

                    <h2 className="text-lg font-semibold mb-2">
                        Видалити статтю
                    </h2>

                    <p className="text-zinc-400 text-sm mb-6">
                        Ви впевнені що хочете видалити статтю?
                    </p>

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800"
                        >

                            Скасувати

                        </button>

                        <button
                            onClick={confirmDelete}
                            disabled={deleteLoading}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                        >

                            <Trash2 size={16}/>

                            {deleteLoading
                                ? "Видалення..."
                                : "Видалити"}

                        </button>

                    </div>

                </div>

            </dialog>

        </div>

    );

}