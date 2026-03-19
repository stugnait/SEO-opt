"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
    Trash2,
    User,
    Shield,
    Plus,
    Pencil
} from "lucide-react";

export default function AdminAuthors() {

    const [authors, setAuthors] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const dialogRef = useRef(null);

    function getToken() {

        return document.cookie
            .split("; ")
            .find(r => r.startsWith("token="))
            ?.split("=")[1];

    }

    async function loadAuthors() {

        try {

            const res = await fetch("/proxy/admin/users", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            const data = await res.json();
            setAuthors(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error(err);
        }

    }

    function openDeleteModal(id) {

        setDeleteId(id);
        dialogRef.current?.showModal();

    }

    function closeModal() {

        dialogRef.current?.close();
        setDeleteId(null);

    }

    async function confirmDelete() {

        try {

            setDeleteLoading(true);

            await fetch(`/api/proxy/admin/users/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            closeModal();
            loadAuthors();

        } catch (err) {

            console.error(err);

        } finally {

            setDeleteLoading(false);

        }

    }

    useEffect(() => {
        loadAuthors();
    }, []);

    return (

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-12">

                <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                    <User size={26} />

                    Автори

                </h1>

                <Link
                    href="/admin/authors/create"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition shadow-lg"
                >

                    <Plus size={18} />

                    Створити автора

                </Link>

            </div>

            {authors.length === 0 && (

                <div className="text-zinc-500 text-lg">
                    Немає авторів
                </div>

            )}

            {/* GRID */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {authors.map(author => (

                    <div
                        key={author.id}
                        className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col transition transform hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]"
                    >

                        {/* AVATAR */}

                        {author.avatar_url ? (

                            <img
                                src={author.avatar_url}
                                alt={author.name}
                                className="w-20 h-20 rounded-full object-cover mb-4 border border-zinc-700"
                            />

                        ) : (

                            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">

                                <User size={28} />

                            </div>

                        )}

                        {/* NAME */}

                        <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition">

                            {author.name || "Немає імені"}

                        </h2>

                        {/* EMAIL */}

                        <p className="text-sm text-zinc-400 mb-2">
                            {author.email}
                        </p>

                        {/* BIO */}

                        <p className="text-zinc-400 text-sm mb-4 flex-grow">
                            {author.bio || "Немає опису"}
                        </p>

                        {/* ADMIN BADGE */}

                        {author.is_admin && (

                            <div className="flex items-center gap-1 text-xs text-white bg-blue-600 px-2 py-1 rounded w-fit mb-4">

                                <Shield size={14} />

                                Admin

                            </div>

                        )}

                        {/* ACTIONS */}

                        <div className="flex gap-3 mt-auto">

                            <Link
                                href={`/admin/authors/edit/${author.id}`}
                                className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
                            >

                                <Pencil size={16} />

                                Редагувати

                            </Link>

                            <button
                                onClick={() => openDeleteModal(author.id)}
                                className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
                            >

                                <Trash2 size={16} />

                                Видалити

                            </button>

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
                        Видалити автора
                    </h2>

                    <p className="text-zinc-400 text-sm mb-6">
                        Ви впевнені що хочете видалити автора?
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

                            <Trash2 size={16} />

                            {deleteLoading ? "Видалення..." : "Видалити"}

                        </button>

                    </div>

                </div>

            </dialog>

        </div>

    );

}