import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { pool } from "../../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
router.use(authMiddleware);

// Дозволені MIME типи
const allowedMimeTypes = ["image/webp", "image/avif"];

// Налаштування multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/articles";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const storageAvatars = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/avatars";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Перевірка типу файлу
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only WebP and AVIF images are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });

export const uploadAvatar = multer({ storage: storageAvatars, fileFilter });

export const getArticles = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM articles ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const articleResult = await pool.query(
            `SELECT * FROM articles WHERE id = $1`,
            [id]
        );

        if (articleResult.rowCount === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        const article = articleResult.rows[0];

        const tagsResult = await pool.query(
            `SELECT t.id, t.name, t.slug
             FROM article_tags at
             JOIN tags t ON t.id = at.tag_id
             WHERE at.article_id = $1
             ORDER BY t.name`,
            [id]
        );

        article.tags = tagsResult.rows;
        article.tag_ids = tagsResult.rows.map(tag => tag.id);

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// Створити нову статтю
// Допоміжна функція для створення slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // прибрати спецсимволи
        .replace(/\s+/g, '-')       // пробіли → дефіс
        .replace(/--+/g, '-');      // подвійні дефіси → один
};

// Створення статті
export const createArticle = async (req, res) => {
    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        let {
            title,
            content,
            excerpt,
            author_id,
            category_id,
            status,
            meta_title,
            meta_description,
            published_at,
            tag_ids,
            cover_url
        } = req.body;

        if (typeof tag_ids === "string") {
            tag_ids = tag_ids.split(",").map(Number);
        }

        // якщо файл завантажений
        if (req.file) {
            cover_url = `/uploads/articles/${req.file.filename}`;
        }

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content are required"
            });
        }

        const slug = generateSlug(title);

        const articleResult = await client.query(
            `INSERT INTO articles
            (title, slug, content, excerpt, cover_url, author_id, category_id, status, meta_title, meta_description, published_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [
                title,
                slug,
                content,
                excerpt || null,
                cover_url || null,
                author_id || null,
                category_id || null,
                status || "draft",
                meta_title || null,
                meta_description || null,
                published_at || null
            ]
        );

        const article = articleResult.rows[0];

        if (Array.isArray(tag_ids) && tag_ids.length > 0) {

            for (const tagId of tag_ids) {

                await client.query(
                    `INSERT INTO article_tags (article_id, tag_id)
                     VALUES ($1,$2)`,
                    [article.id, tagId]
                );

            }

        }

        await client.query("COMMIT");

        res.status(201).json(article);

    } catch (err) {

        await client.query("ROLLBACK");
        console.error(err);

        res.status(500).json({
            error: err.message
        });

    } finally {
        client.release();
    }
};

// Оновлення статті
export const updateArticle = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { id } = req.params;

        let {
            title,
            content,
            excerpt,
            author_id,
            category_id,
            status,
            meta_title,
            meta_description,
            published_at,
            tag_ids,
            cover_url
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content are required"
            });
        }

        if (typeof tag_ids === "string") {
            tag_ids = tag_ids.split(",").map(Number);
        }

        // якщо файл завантажили
        if (req.file) {
            cover_url = `/uploads/articles/${req.file.filename}`;
        }

        const slug = generateSlug(title);

        const fields = [
            "title",
            "slug",
            "content",
            "excerpt",
            "author_id",
            "category_id",
            "status",
            "meta_title",
            "meta_description",
            "published_at"
        ];

        const values = [
            title,
            slug,
            content,
            excerpt || null,
            author_id || null,
            category_id || null,
            status || "draft",
            meta_title || null,
            meta_description || null,
            published_at || null
        ];

        if (cover_url !== undefined) {
            fields.push("cover_url");
            values.push(cover_url);
        }

        fields.push("updated_at");
        values.push(new Date());

        const setString = fields
            .map((f, i) => `${f}=$${i + 1}`)
            .join(", ");

        values.push(id);

        const result = await client.query(
            `UPDATE articles
             SET ${setString}
             WHERE id=$${values.length}
             RETURNING *`,
            values
        );

        if (result.rowCount === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                error: "Article not found"
            });

        }

        // оновлення тегів

        if (tag_ids !== undefined) {

            await client.query(
                `DELETE FROM article_tags
                 WHERE article_id=$1`,
                [id]
            );

            if (Array.isArray(tag_ids) && tag_ids.length > 0) {

                for (const tagId of tag_ids) {

                    await client.query(
                        `INSERT INTO article_tags (article_id, tag_id)
                         VALUES ($1,$2)`,
                        [id, tagId]
                    );

                }

            }

        }

        await client.query("COMMIT");

        res.json(result.rows[0]);

    } catch (err) {

        await client.query("ROLLBACK");
        console.error(err);

        res.status(500).json({
            error: err.message || "DB error"
        });

    } finally {

        client.release();

    }
};

// Видалення статті
export const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM articles WHERE id=$1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Article not found" });
        }

        res.json({ message: "Article deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// Отримати всі категорії
export const getCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM categories WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// Створити нову категорію
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) return res.status(400).json({ error: "Name is required" });

        const slug = generateSlug(name);

        const result = await pool.query(
            `INSERT INTO categories (name, slug, description)
             VALUES ($1, $2, $3)
                 RETURNING *`,
            [name, slug, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === "23505") { // duplicate key
            res.status(400).json({ error: "Category with this slug already exists" });
        } else {
            res.status(500).json({ error: "DB error" });
        }
    }
};

// Оновити категорію
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) return res.status(400).json({ error: "Name is required" });

        const slug = generateSlug(name);

        const result = await pool.query(
            `UPDATE categories
             SET name = $1,
                 slug = $2,
                 description = $3
             WHERE id = $4
             RETURNING *`,
            [name, slug, description || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === "23505") { // duplicate slug
            res.status(400).json({ error: "Category with this slug already exists" });
        } else {
            res.status(500).json({ error: "DB error" });
        }
    }
};

// Видалити категорію
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted", category: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// Отримати всі теги
export const getTags = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM tags ORDER BY created_at DESC"
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

export const getTagById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM tags WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tag not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};


// Створити новий тег
export const createTag = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const slug = generateSlug(name);

        const result = await pool.query(
            `INSERT INTO tags (name, slug)
             VALUES ($1, $2)
             RETURNING *`,
            [name, slug]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            res.status(400).json({ error: "Tag with this slug already exists" });
        } else {
            res.status(500).json({ error: "DB error" });
        }
    }
};


// Оновити тег
export const updateTag = async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const slug = generateSlug(name);

        const result = await pool.query(
            `UPDATE tags
             SET name = $1,
                 slug = $2
             WHERE id = $3
             RETURNING *`,
            [name, slug, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tag not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            res.status(400).json({ error: "Tag with this slug already exists" });
        } else {
            res.status(500).json({ error: "DB error" });
        }
    }
};


// Видалити тег
export const deleteTag = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tags WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tag not found" });
        }

        res.json({
            message: "Tag deleted",
            tag: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// GET /admin/users
export const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, slug, email, bio, avatar_url, is_admin, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// GET /admin/users/:id
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT id, name, slug, email, bio, avatar_url, is_admin, created_at
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// POST /admin/users
export const createUser = async (req, res) => {
    try {
        const { name, email, password, bio, is_admin } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        const slug = generateSlug(name);
        const avatar_url = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO users (name, slug, email, password, bio, avatar_url, is_admin)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, slug, email, bio, avatar_url, is_admin, created_at`,
            [
                name,
                slug,
                email,
                password,
                bio || null,
                avatar_url,
                is_admin === "true" || is_admin === true
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({ error: "User with this email or slug already exists" });
        }

        res.status(500).json({ error: err.message || "DB error" });
    }
};

// PUT /admin/users/:id
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, bio, is_admin } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const slug = generateSlug(name);
        const avatar_url = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        const fields = ["name", "slug", "email", "bio", "is_admin"];
        const values = [
            name,
            slug,
            email,
            bio || null,
            is_admin === "true" || is_admin === true
        ];

        if (password) {
            fields.push("password");
            values.push(password);
        }

        if (avatar_url) {
            fields.push("avatar_url");
            values.push(avatar_url);
        }

        const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");
        values.push(id);

        const result = await pool.query(
            `UPDATE users
             SET ${setString}
             WHERE id=$${values.length}
             RETURNING id, name, slug, email, bio, avatar_url, is_admin, created_at`,
            values
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({ error: "User with this email or slug already exists" });
        }

        res.status(500).json({ error: err.message || "DB error" });
    }
};

// DELETE /admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING id, name, slug, email, bio, avatar_url, is_admin, created_at`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            message: "User deleted",
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

router.post("/upload", (req, res) => res.json({ message: "File uploaded" }));

export default router;