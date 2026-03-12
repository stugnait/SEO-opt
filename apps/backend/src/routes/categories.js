import { Router } from "express";
import { getCategories, getArticlesByCategory, getCategoryById } from "../controllers/categories.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Отримати список категорій
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорій
 */
router.get("/", getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Отримати одну категорію
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані категорії
 *       404:
 *         description: Категорія не знайдена
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /categories/{slug}/articles:
 *   get:
 *     summary: Отримати статті конкретної категорії
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список статей
 */
router.get("/:slug/articles", getArticlesByCategory);

export default router;