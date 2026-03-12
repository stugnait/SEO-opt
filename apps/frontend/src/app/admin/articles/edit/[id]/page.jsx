"use client";

import { useParams,useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import Link from "next/link";
import { Save,ArrowLeft,FileText } from "lucide-react";

export default function EditArticle(){

    const params = useParams();
    const router = useRouter();

    const id = params.id;

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

        const values=[...e.target.selectedOptions].map(o=>Number(o.value));

        setForm({
            ...form,
            tag_ids:values
        });

    }

    async function loadData(){

        const t = token();

        try{

            const [authorsRes,categoriesRes,tagsRes,imagesRes,articleRes] = await Promise.all([

                fetch("/api/proxy/admin/users",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/proxy/admin/categories",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/proxy/admin/tags",{headers:{Authorization:`Bearer ${t}`}}),
                fetch("/api/images"),
                fetch(`/api/proxy/admin/articles/${id}`,{headers:{Authorization:`Bearer ${t}`}})

            ]);

            setAuthors(await authorsRes.json());
            setCategories(await categoriesRes.json());
            setTags(await tagsRes.json());
            setImages(await imagesRes.json());

            const article = await articleRes.json();

            if(article){

                setForm({

                    title:article.title || "",
                    excerpt:article.excerpt || "",
                    content:article.content || "",
                    cover_url:article.cover_url || "",
                    author_id:article.author_id || "",
                    category_id:article.category_id || "",
                    status:article.status || "draft",
                    meta_title:article.meta_title || "",
                    meta_description:article.meta_description || "",
                    published_at:article.published_at
                        ? article.published_at.slice(0,16)
                        : "",
                    tag_ids:article.tag_ids || []

                });

            }

        }catch(e){
            console.error(e);
        }

    }

    async function updateArticle(e){

        e.preventDefault();

        setLoading(true);

        try{

            const res = await fetch(`/api/proxy/admin/articles/${id}`,{

                method:"PUT",

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
                alert(err.message || "Помилка оновлення");
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
                        Редагувати статтю

                    </h1>

                    <Link
                        href="/admin/articles"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                    >

                        <ArrowLeft size={18}/>
                        Назад

                    </Link>

                </div>

                {/* FORM */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg">

                    <form onSubmit={updateArticle} className="flex flex-col gap-5">

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
                        />

                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
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
                                value={form.tag_ids}
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

                        <input
                            name="meta_title"
                            value={form.meta_title}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        <textarea
                            name="meta_description"
                            value={form.meta_description}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        <input
                            type="datetime-local"
                            name="published_at"
                            value={form.published_at}
                            onChange={handleChange}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
                        />

                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition shadow-lg"
                        >

                            <Save size={18}/>

                            {loading ? "Оновлення..." : "Оновити"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}