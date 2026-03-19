import express from "express";
import cors from "cors";
// Тимчасово коментуємо всі роути, щоб вони не крашили сервер при імпорті
// import articlesRouter from "./routes/articles.js";
// import categoriesRouter from "./routes/categories.js";
// import authorsRouter from "./routes/authors.js";
// import tagsRouter from "./routes/tags.js";
// import adminRouter from "./routes/admin.js";
// import authRouter from "./routes/auth.js";
// import searchRouter from "./routes/search.js";

const app = express();

app.use(cors());
app.use(express.json());

// Перевірка, чи живий сервер
app.get("/ping", (req, res) => {
    res.json({ status: "SERVER IS ALIVE FINALLY!" });
});

// Роути поки вимкнені
// app.use("/api/articles", articlesRouter);
// app.use("/api/categories", categoriesRouter);
// app.use("/api/authors", authorsRouter);
// app.use("/api/tags", tagsRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/search", searchRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});