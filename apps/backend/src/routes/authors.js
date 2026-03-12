import { Router } from "express";
import {
    getAuthorBySlug,
    getArticlesByAuthor
} from "../controllers/authors.js";

const router = Router();

/**
 * @swagger
 * /authors/{slug}:
 *   get:
 *     summary: Отримати профіль автора
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Профіль автора
 */
router.get("/:slug", getAuthorBySlug);


/**
 * @swagger
 * /authors/{slug}/articles:
 *   get:
 *     summary: Отримати статті автора
 *     tags: [Authors]
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
router.get("/:slug/articles", getArticlesByAuthor);

export default router;