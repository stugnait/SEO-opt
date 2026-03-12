import { pool } from "../../config/db.js"; // шлях до db.js

// GET /api/articles — список статей
export const getArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_url, a.views, a.published_at,
              u.name as author_name, u.slug AS author_slug, c.name as category_name
       FROM articles a
       LEFT JOIN users u ON a.author_id = u.id
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'published'
       ORDER BY a.published_at DESC
       LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// GET /api/articles/:slug — стаття за slug
export const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await pool.query(
            `SELECT a.id, a.title, a.slug, a.content, a.cover_url, a.views, a.published_at,
              u.name as author_name, u.slug as author_slug, u.avatar_url,
              c.name as category_name, c.slug as category_slug
       FROM articles a
       LEFT JOIN users u ON a.author_id = u.id
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = $1 AND a.status = 'published'`,
            [slug]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Article not found" });

        const article = result.rows[0];

        // отримати теги
        const tagsResult = await pool.query(
            `SELECT t.name, t.slug
       FROM tags t
       JOIN article_tags at ON t.id = at.tag_id
       WHERE at.article_id = $1`,
            [article.id]
        );

        article.tags = tagsResult.rows;

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// GET /api/articles/:slug/related — пов’язані статті тієї ж категорії
export const getRelatedArticles = async (req, res) => {
    try {
        const { slug } = req.params;

        // спершу знайти статтю
        const articleResult = await pool.query(
            `SELECT id, category_id FROM articles WHERE slug = $1 AND status = 'published'`,
            [slug]
        );

        if (articleResult.rows.length === 0) return res.status(404).json({ error: "Article not found" });

        const { id, category_id } = articleResult.rows[0];

        // отримати інші статті тієї ж категорії
        const relatedResult = await pool.query(
            `SELECT id, title, slug, excerpt, cover_url
       FROM articles
       WHERE category_id = $1 AND id <> $2 AND status = 'published'
       ORDER BY published_at DESC
       LIMIT 5`,
            [category_id, id]
        );

        res.json(relatedResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// POST /api/articles/:id/view — збільшити лічильник переглядів
export const incrementViews = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE articles SET views = views + 1 WHERE id = $1 RETURNING views`,
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Article not found" });

        res.json({ views: result.rows[0].views });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};