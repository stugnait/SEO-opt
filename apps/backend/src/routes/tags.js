import { Router } from "express";
import { getTags, getTagById, getArticlesByTag } from "../controllers/tags.js";

const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Отримати список тегів
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Список тегів
 */
router.get("/", getTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Отримати один тег
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані тегу
 *       404:
 *         description: Тег не знайдений
 */
router.get("/:id", getTagById);

/**
 * @swagger
 * /tags/{slug}/articles:
 *   get:
 *     summary: Отримати статті за тегом
 *     tags: [Tags]
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
router.get("/:slug/articles", getArticlesByTag);

export default router;