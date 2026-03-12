"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ArrowLeft, FileText } from "lucide-react";

export default function CreateArticle() {

    const router = useRouter();

    const [authors,setAuthors] = useState([]);
    const [categories,setCategories] = useState([]);
    const [tags,setTags] = useState([]);
    const [images,setImages] = useState([]);

    const [loading,setLoading] = useState(false);

    const [form,setForm] = useState({
        title:"",
        excerpt:"",
        content:"",
        cover_url:"",
        author_id:"",
        category_id:"",
        status:"draft",
        meta_title:"",
        meta_description:"",
        published_at:"",
        tag_ids:[]
    });

    function token(){
        return document.cookie.split("; ")
            .find(r=>r.startsWith("token="))
            ?.split("=")[1];
    }

    function handleChange(e){

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    }

    function handleTagsChange(e){

        const values = [...e.target.selectedOptions].map(o=>Number(o.value));

        setForm({
            ...form,
            tag_ids:values
        });

    }

    async function loadData(){

        const t = token();

        try{

            const [authorsRes,categoriesRes,tagsRes,imagesRes] = await Promise.all([

                fetch("/api/proxy/admin/users",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/proxy/admin/categories",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/proxy/admin/tags",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/images")

            ]);

            setAuthors(await authorsRes.json());
            setCategories(await categoriesRes.json());
            setTags(await tagsRes.json());
            setImages(await imagesRes.json());

        }catch(e){
            console.error(e);
        }

    }

    async function createArticle(e){

        e.preventDefault();

        if(!form.title){
            alert("Введіть назву");
            return;
        }

        if(!form.author_id || !form.category_id){
            alert("Оберіть автора і категорію");
            return;
        }

        setLoading(true);

        try{

            const res = await fetch("/api/proxy/admin/articles",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token()}`
                },

                body:JSON.stringify({
                    ...form,
                    author_id:Number(form.author_id),
                    category_id:Number(form.category_id),
                    tag_ids:form.tag_ids,
                    published_at:form.published_at
                        ? new Date(form.published_at).toISOString()
                        : null
                })

            });

            if(!res.ok){

                const err = await res.json();
                alert(err.message || "Помилка створення");
                return;

            }

            router.push("/admin/articles");

        }catch(err){

            console.error(err);
            alert("Server error");

        }finally{

            setLoading(false);

        }

    }

    useEffect(()=>{
        loadData();
    },[]);

    return(

        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] p-10">

            <div className="max-w-3xl mx-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-10">

                    <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

                        <FileText size={24}/>
                        Створити статтю

                    </h1>

                    <Link
                        href="/admin/articles"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >

                        <ArrowLeft size={18}/>
                        Назад

                    </Link>

                </div>

                {/* FORM CARD */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg">

                    <form onSubmit={createArticle} className="flex flex-col gap-5">

                        {/* TITLE */}

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Назва статті"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                        {/* EXCERPT */}

                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            placeholder="Короткий опис"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
                        />

                        {/* CONTENT */}

                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Контент"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 h-40"
                        />

                        {/* COVER */}

                        <div>

                            <label className="text-sm text-zinc-400">
                                Cover Image
                            </label>

                            <select
                                name="cover_url"
                                value={form.cover_url}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 mt-2"
                            >

                                <option value="">Оберіть зображення</option>

                                {images.map(img=>(

                                    <option key={img} value={img}>
                                        {img}
                                    </option>

                                ))}

                            </select>

                            {form.cover_url && (

                                <img
                                    src={form.cover_url}
                                    className="mt-4 h-44 rounded-lg object-cover border border-zinc-700"
                                />

                            )}

                        </div>

                        {/* AUTHOR */}

                        <select
                            name="author_id"
                            value={form.author_id}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        >

                            <option value="">Автор</option>

                            {authors.map(a=>(

                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>

                            ))}

                        </select>

                        {/* CATEGORY */}

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        >

                            <option value="">Категорія</option>

                            {categories.map(c=>(

                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>

                            ))}

                        </select>

                        {/* TAGS */}

                        <div>

                            <label className="text-sm text-zinc-400">
                                Теги
                            </label>

                            <select
                                multiple
                                onChange={handleTagsChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 mt-2 h-32"
                            >

                                {tags.map(tag=>(

                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* STATUS */}

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        >

                            <option value="draft">draft</option>
                            <option value="published">published</option>

                        </select>

                        {/* META */}

                        <input
                            name="meta_title"
                            value={form.meta_title}
                            onChange={handleChange}
                            placeholder="Meta title"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        <textarea
                            name="meta_description"
                            value={form.meta_description}
                            onChange={handleChange}
                            placeholder="Meta description"
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        {/* DATE */}

                        <input
                            type="datetime-local"
                            name="published_at"
                            value={form.published_at}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                        >

                            <Save size={18}/>

                            {loading ? "Створення..." : "Створити"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}