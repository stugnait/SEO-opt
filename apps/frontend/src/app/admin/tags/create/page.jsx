"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

export default function CreateTag() {

    const router = useRouter();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    function getToken() {

        return document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

    }

    async function createTag(e) {

        e.preventDefault();

        if (!name.trim()) return;

        try {

            setLoading(true);

            await fetch("/api/proxy/admin/tags", {

                method: "POST",

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

                        <Tag size={26} />

                        Створити тег

                    </h1>

                </div>

                {/* FORM CARD */}

                <form
                    onSubmit={createTag}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg flex flex-col gap-6"
                >

                    {/* NAME */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Назва тегу
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Наприклад: JavaScript"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                    >

                        <Tag size={18} />

                        {loading ? "Створення..." : "Створити тег"}

                    </button>

                </form>

            </div>

        </div>

    );

}