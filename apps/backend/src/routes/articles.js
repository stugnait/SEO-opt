import { Router } from "express";
import { getArticles, getArticleBySlug, getRelatedArticles, incrementViews } from "../controllers/articles.js";

const router = Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Отримати список статей
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер сторінки для пагінації
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Кількість статей на сторінці
 *     responses:
 *       200:
 *         description: Список статей
 */
router.get("/", getArticles);

/**
 * @swagger
 * /articles/{slug}/related:
 *   get:
 *     summary: Отримати пов'язані статті тієї ж категорії
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug статті
 *     responses:
 *       200:
 *         description: Список пов’язаних статей
 */
router.get("/:slug/related", getRelatedArticles);

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Отримати статтю за slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug статті
 *     responses:
 *       200:
 *         description: Стаття
 *       404:
 *         description: Стаття не знайдена
 */
router.get("/:slug", getArticleBySlug);

/**
 * @swagger
 * /articles/{id}/view:
 *   post:
 *     summary: Збільшити лічильник переглядів статті
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статті
 *     responses:
 *       200:
 *         description: Лічильник оновлено
 */
router.post("/:id/view", incrementViews);

export default router;