"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch("/api/proxy/categories");
                const data = await res.json();
                if (Array.isArray(data)) setCategories(data);
            } catch (e) {
                console.error(e);
            }
        }
        loadCategories();
    }, []);

    function goAdmin() {
        router.push("/admin");
    }

    function logout() {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push("/auth/login");
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-zinc-800">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LOGO */}
                <h1
                    onClick={() => router.push("/")}
                    className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                    IT Blog
                </h1>

                {/* NAV */}
                <div className="flex items-center gap-6">

                    {/* КАТЕГОРІЇ */}
                    <div className="relative group">

                        <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition">
                            Категорії ▾
                        </button>

                        <div className="absolute top-full left-0 mt-0 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">

                            {categories.length === 0 && (
                                <div className="px-4 py-2 text-zinc-400 text-sm">
                                    Немає категорій
                                </div>
                            )}

                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categories/${encodeURIComponent(cat.slug)}`}
                                    className="block px-4 py-2 text-white text-sm rounded-lg hover:bg-zinc-700 transition"
                                >
                                    {cat.name}
                                </Link>
                            ))}

                        </div>

                    </div>

                    {/* ПРО НАС */}
                    <Link
                        href="/about"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
                    >
                        Про нас
                    </Link>

                    {/* ADMIN */}
                    <button
                        onClick={goAdmin}
                        className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                    >
                        Admin
                    </button>

                    {/* LOGOUT */}
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </header>
    );
}