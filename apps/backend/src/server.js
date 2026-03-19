


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { pool } from "../config/db.js";

import { setupSwagger } from "./swagger.js";

import articlesRouter from "./routes/articles.js";
import categoriesRouter from "./routes/categories.js";
import authorsRouter from "./routes/authors.js";
import tagsRouter from "./routes/tags.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import searchRouter from "./routes/search.js";


const app = express();

app.get("/ping", (req, res) => {
    res.json({ status: "Server is ALIVE!" });
});

console.log("Password from ENV:", process.env.DB_PASSWORD);

pool.connect()
    .then(() => console.log("PostgreSQL connected"))
    .catch(err => console.error("DB connection error", err));

app.use(cors());
app.use(express.json());

app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/search", searchRouter);

app.use("/uploads", express.static("uploads"));

// Swagger
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});