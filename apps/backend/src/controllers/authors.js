import { pool } from "../../config/db.js";

// Отримати автора по slug
export const getAuthorBySlug = async (req, res) => {
    const { slug } = req.params;

    try {

        const result = await pool.query(
            `SELECT id, name, slug, bio, avatar_url, created_at
             FROM users
             WHERE slug = $1`,
            [slug]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};


// Отримати статті автора
export const getArticlesByAuthor = async (req, res) => {
    const { slug } = req.params;

    try {

        const result = await pool.query(
            `SELECT a.*
             FROM articles a
             JOIN users u ON a.author_id = u.id
             WHERE u.slug = $1
             AND a.status = 'published'
             ORDER BY a.published_at DESC`,
            [slug]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};