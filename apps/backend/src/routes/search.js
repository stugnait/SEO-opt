import { Router } from "express";
import { searchArticles } from "../controllers/search.js";

const router = Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Пошук статей за заголовком, описом та текстом
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Пошуковий запит
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Кількість результатів на сторінку
 *     responses:
 *       200:
 *         description: Результати пошуку
 *       400:
 *         description: Параметр q не переданий
 */
router.get("/", searchArticles);

export default router;