import { pool } from "../../config/db.js";

export const searchArticles = async (req, res) => {
    try {
        const { q = "", page = 1, limit = 10 } = req.query;

        if (!q.trim()) {
            return res.status(400).json({ error: "Query parameter q is required" });
        }

        const currentPage = Number(page);
        const currentLimit = Number(limit);
        const offset = (currentPage - 1) * currentLimit;
        const searchTerm = `%${q.trim()}%`;

        // Загальна кількість знайдених статей
        const countResult = await pool.query(
            `SELECT COUNT(*)::int AS total
             FROM articles a
             WHERE a.status = 'published'
               AND (
                    a.title ILIKE $1
                    OR a.excerpt ILIKE $1
                    OR a.content ILIKE $1
               )`,
            [searchTerm]
        );

        const total = countResult.rows[0].total;

        // Дані сторінки
        const result = await pool.query(
            `SELECT 
                a.id,
                a.title,
                a.slug,
                a.excerpt,
                a.cover_url,
                a.views,
                a.published_at,
                u.name AS author_name,
                u.slug AS author_slug,
                c.name AS category_name,
                c.slug AS category_slug
             FROM articles a
             LEFT JOIN users u ON a.author_id = u.id
             LEFT JOIN categories c ON a.category_id = c.id
             WHERE a.status = 'published'
               AND (
                    a.title ILIKE $1
                    OR a.excerpt ILIKE $1
                    OR a.content ILIKE $1
               )
             ORDER BY a.published_at DESC
             LIMIT $2 OFFSET $3`,
            [searchTerm, currentLimit, offset]
        );

        res.json({
            query: q,
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages: Math.ceil(total / currentLimit),
            results: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};