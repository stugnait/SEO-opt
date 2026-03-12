"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    FileText,
    Folder,
    Tag,
    Users,
    Upload,
    LogOut
} from "lucide-react";

export default function AdminPage() {

    const router = useRouter();

    function logout() {

        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

        router.replace("/auth/login");

    }

    const items = [

        {
            title: "Статті",
            description: "Управління статтями блогу",
            href: "/admin/articles",
            icon: FileText
        },

        {
            title: "Категорії",
            description: "Категорії для статей",
            href: "/admin/categories",
            icon: Folder
        },

        {
            title: "Теги",
            description: "Теги для фільтрації статей",
            href: "/admin/tags",
            icon: Tag
        },

        {
            title: "Автори",
            description: "Керування авторами",
            href: "/admin/authors",
            icon: Users
        },

        {
            title: "Upload Image",
            description: "Завантаження зображень",
            href: "/admin/upload",
            icon: Upload
        }

    ];

    return (

        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] text-white p-10">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-14">

                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                    Admin Panel

                </h1>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition shadow-lg"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

            {/* DASHBOARD GRID */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (

                        <Link
                            key={item.title}
                            href={item.href}
                            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-hidden transition transform hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                        >

                            {/* glow overlay */}

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

                            <div className="relative flex flex-col gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-blue-600 transition">

                                        <Icon size={24} />

                                    </div>

                                    <h2 className="text-xl font-semibold group-hover:text-blue-400 transition">

                                        {item.title}

                                    </h2>

                                </div>

                                <p className="text-zinc-400 text-sm">

                                    {item.description}

                                </p>

                            </div>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}