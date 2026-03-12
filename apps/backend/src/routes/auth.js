import { Router } from "express";
import { login, logout } from "../controllers/auth.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Логін користувача (отримати JWT)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: JWT токен
 *       401:
 *         description: Невірні дані
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вихід користувача
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успішний вихід
 */
router.post("/logout", logout);

export default router;