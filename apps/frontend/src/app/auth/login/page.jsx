"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        if (!email || !password) {
            alert("Введіть username і password");
            return;
        }

        setLoading(true);

        try {

            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Login failed");
                setLoading(false);
                return;
            }

            document.cookie = `token=${data.token}; path=/; SameSite=Lax`;

            router.replace("/");

        } catch (err) {

            console.error(err);
            alert("Server error");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)]">

            <form
                onSubmit={handleSubmit}
                className="w-[380px] bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl flex flex-col gap-5"
            >

                {/* TITLE */}

                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Login
                </h1>

                {/* EMAIL */}

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />

                {/* PASSWORD */}

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />

                {/* BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                >

                    {loading ? "Loading..." : "Login"}

                </button>

            </form>

        </div>

    );

}