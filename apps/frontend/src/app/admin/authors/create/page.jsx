"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function CreateAuthor() {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [loading, setLoading] = useState(false);

    function getToken() {

        return document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

    }

    async function createAuthor(e) {

        e.preventDefault();

        if (!name || !email || !password) {
            alert("Заповніть name, email і password");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);

            if (bio) formData.append("bio", bio);

            formData.append("is_admin", isAdmin ? "true" : "false");

            if (file) {
                formData.append("file", file);
            }

            const res = await fetch("/api/proxy/admin/users", {

                method: "POST",

                headers: {
                    Authorization: `Bearer ${getToken()}`
                },

                body: formData

            });

            const data = await res.json();

            console.log("CREATE AUTHOR:", data);

            if (!res.ok) {
                throw new Error(data.message || "Помилка створення автора");
            }

            router.push("/admin/authors");

        } catch (err) {

            console.error(err);
            alert(err.message);

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
                        href="/admin/authors"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Назад
                    </Link>

                    <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        <UserPlus size={26} />

                        Створити автора

                    </h1>

                </div>

                {/* FORM CARD */}

                <form
                    onSubmit={createAuthor}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg flex flex-col gap-6"
                >

                    {/* NAME */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Ім'я *
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ivan Ivanov"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* EMAIL */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Email *
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ivan@example.com"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Password *
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* BIO */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Біо
                        </label>

                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Короткий опис автора"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 h-24"
                        />

                    </div>

                    {/* AVATAR */}

                    <div className="flex flex-col gap-2">

                        <label className="text-sm text-zinc-400">
                            Avatar
                        </label>

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        {file && (

                            <div className="text-xs text-zinc-500">
                                {file.name}
                            </div>

                        )}

                    </div>

                    {/* ADMIN */}

                    <label className="flex items-center gap-3 text-sm text-zinc-300">

                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="accent-blue-500"
                        />

                        Адміністратор

                    </label>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                    >

                        <UserPlus size={18} />

                        {loading ? "Створення..." : "Створити автора"}

                    </button>

                </form>

            </div>

        </div>

    );

}