export default function AboutPage() {
    return (
        <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,#1a1a1f,#0b0b0d)] px-6 py-16">

            <div className="max-w-6xl mx-auto space-y-20">

                {/* HERO */}
                <section className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Про{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                            IT Blog
                        </span>
                    </h1>

                    <p className="text-zinc-400 text-lg leading-8">
                        Сучасний блог про програмування, технології та digital-світ.
                        Тут ти знайдеш корисні статті, гіди та інсайти для розвитку в IT.
                    </p>

                </section>

                {/* МІСІЯ + ВІЖН */}
                <section className="grid md:grid-cols-2 gap-8">

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] transition">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                            Наша місія
                        </h2>

                        <p className="text-zinc-300 leading-7">
                            Ми створюємо якісний контент, який допомагає людям
                            входити в IT, прокачувати навички та залишатись
                            в курсі сучасних технологій.
                        </p>
                    </div>

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                            Наш підхід
                        </h2>

                        <p className="text-zinc-300 leading-7">
                            Простота, практичність і реальний досвід.
                            Ми пояснюємо складні речі простою мовою,
                            щоб ти реально розумів, а не просто читав.
                        </p>
                    </div>

                </section>

                {/* ЩО МИ ПУБЛІКУЄМО */}
                <section>

                    <h2 className="text-3xl font-bold mb-10 text-center">
                        Що ти тут знайдеш
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        {[
                            {
                                title: "Гайди",
                                desc: "Покрокові інструкції по технологіях",
                                color: "blue"
                            },
                            {
                                title: "Туторіали",
                                desc: "Практичні приклади та проекти",
                                color: "purple"
                            },
                            {
                                title: "Інсайти",
                                desc: "Ринок IT, тренди та досвід",
                                color: "pink"
                            }
                        ].map((item, i) => (

                            <div
                                key={i}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:-translate-y-2 hover:shadow-xl transition"
                            >
                                <h3 className={`text-xl font-semibold mb-3 text-${item.color}-400`}>
                                    {item.title}
                                </h3>

                                <p className="text-zinc-400">
                                    {item.desc}
                                </p>
                            </div>

                        ))}

                    </div>

                </section>

                {/* КОНТАКТИ */}
                <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center">

                    <h2 className="text-3xl font-bold mb-4">
                        Зв'язок з нами
                    </h2>

                    <p className="text-zinc-400 mb-6">
                        Маєш питання або пропозицію? Напиши нам
                    </p>

                    <a
                        href="mailto:info@itblog.com"
                        className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition font-medium"
                    >
                        info@itblog.com
                    </a>

                </section>

                {/* СОЦМЕРЕЖІ */}
                <section className="text-center">

                    <h2 className="text-2xl font-semibold mb-6">
                        Ми в соцмережах
                    </h2>

                    <div className="flex justify-center gap-6">

                        {["Telegram", "Instagram", "Twitter"].map((social, i) => (
                            <a
                                key={i}
                                href="#"
                                className="px-6 py-2 bg-zinc-800 rounded-lg hover:bg-blue-600 transition"
                            >
                                {social}
                            </a>
                        ))}

                    </div>

                </section>

                {/* FOOTER */}
                <section className="text-center text-zinc-500 text-sm pt-10 border-t border-zinc-800">
                    © 2026 IT Blog. Всі права захищені.
                </section>

            </div>

        </div>
    );
}