import { pool } from "../../config/db.js";

// Отримати всі теги
export const getTags = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, slug, created_at FROM tags ORDER BY name"
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
            `SELECT id, name, slug, created_at
             FROM tags
             WHERE id = $1`,
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

// Отримати статті за тегом
export const getArticlesByTag = async (req, res) => {
    const { slug } = req.params;

    try {

        const result = await pool.query(
            `SELECT a.*
             FROM articles a
             JOIN article_tags at ON a.id = at.article_id
             JOIN tags t ON t.id = at.tag_id
             WHERE t.slug = $1
             AND a.status = 'published'
             ORDER BY a.created_at DESC`,
            [slug]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};