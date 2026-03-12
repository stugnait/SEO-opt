"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

export default function EditCategory() {

    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    function getToken() {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
    }

    async function loadCategory() {

        try {

            const res = await fetch("/api/proxy/admin/categories", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            const data = await res.json();

            const category = data.find(c => c.id == id);

            if (!category) return;

            setName(category.name || "");
            setDescription(category.description || "");

        } catch (err) {

            console.error(err);

        } finally {

            setLoadingData(false);

        }

    }

    async function updateCategory(e) {

        e.preventDefault();

        if (!name.trim()) return;

        try {

            setLoading(true);

            await fetch(`/api/proxy/admin/categories/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    name,
                    description
                })

            });

            router.push("/admin/categories");

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {
        loadCategory();
    }, []);

    if (loadingData) {

        return (
            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

                <div className="max-w-xl mx-auto text-zinc-400">
                    Завантаження категорії...
                </div>

            </div>
        );

    }

    return (

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

            <div className="max-w-xl mx-auto">

                {/* HEADER */}

                <div className="flex items-center gap-5 mb-10">

                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Назад
                    </Link>

                    <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        <Pencil size={26} />

                        Редагувати категорію

                    </h1>

                </div>

                {/* FORM CARD */}

                <form
                    onSubmit={updateCategory}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg flex flex-col gap-6"
                >

                    {/* NAME */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Назва
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Опис
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 h-28 resize-none"
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                    >

                        <Pencil size={18} />

                        {loading ? "Оновлення..." : "Оновити категорію"}

                    </button>

                </form>

            </div>

        </div>

    );

}