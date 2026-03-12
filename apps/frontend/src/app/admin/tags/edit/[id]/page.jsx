"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default function EditTag() {

    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    function getToken() {

        return document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

    }

    async function loadTag() {

        try {

            const res = await fetch("/api/proxy/admin/tags", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            const data = await res.json();

            const tag = data.find(t => t.id == id);

            if (!tag) return;

            setName(tag.name || "");

        } catch (err) {

            console.error(err);

        } finally {

            setLoadingData(false);

        }

    }

    async function updateTag(e) {

        e.preventDefault();

        if (!name.trim()) return;

        try {

            setLoading(true);

            await fetch(`/api/proxy/admin/tags/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    name
                })

            });

            router.push("/admin/tags");

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {
        loadTag();
    }, []);

    if (loadingData) {

        return (
            <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

                <div className="max-w-xl mx-auto text-zinc-400">
                    Завантаження тегу...
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
                        href="/admin/tags"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Назад
                    </Link>

                    <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        <Pencil size={26} />

                        Редагувати тег

                    </h1>

                </div>

                {/* FORM CARD */}

                <form
                    onSubmit={updateTag}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg flex flex-col gap-6"
                >

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Назва тегу
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                    >

                        <Pencil size={18} />

                        {loading ? "Оновлення..." : "Оновити тег"}

                    </button>

                </form>

            </div>

        </div>

    );

}