"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";

export default function UploadPage() {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    function handleFile(e) {

        const f = e.target.files[0];

        if (!f) return;

        setFile(f);
        setPreview(URL.createObjectURL(f));

    }

    async function upload(e) {

        e.preventDefault();

        if (!file) {
            alert("Оберіть файл");
            return;
        }

        try {

            setLoading(true);

            const form = new FormData();
            form.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: form
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload error");
            }

            setUrl(data.url);

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
                        href="/admin"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Назад
                    </Link>

                    <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        <UploadCloud size={26} />

                        Upload Image

                    </h1>

                </div>

                {/* UPLOAD CARD */}

                <form
                    onSubmit={upload}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg flex flex-col gap-6"
                >

                    {/* FILE INPUT */}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 cursor-pointer"
                    />

                    {/* PREVIEW */}

                    {preview && (

                        <img
                            src={preview}
                            className="w-full h-60 object-cover rounded-lg border border-zinc-800"
                        />

                    )}

                    {/* RESULT URL */}

                    {url && (

                        <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-sm">

                            Uploaded URL:

                            <div className="text-blue-400 break-all mt-1">
                                {url}
                            </div>

                        </div>

                    )}

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                    >

                        <UploadCloud size={18} />

                        {loading ? "Uploading..." : "Upload"}

                    </button>

                </form>

            </div>

        </div>

    );

}