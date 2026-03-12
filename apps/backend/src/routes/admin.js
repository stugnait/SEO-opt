import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    upload,
    getTags,
    createTag,
    updateTag,
    deleteTag,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadAvatar,
    getArticleById,
    getCategoryById,
    getTagById,
} from "../controllers/admin.js";

const router = Router();
router.use(authMiddleware); // всі маршрути захищені

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Адмінські ендпоінти
 */

/**
 * @swagger
 * /admin/articles:
 *   get:
 *     summary: Отримати всі статті (включно з чернетками)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список статей
 */
router.get("/articles", getArticles);

/**
 * @swagger
 * /admin/articles/{id}:
 *   get:
 *     summary: Отримати одну статтю
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані статті
 *       404:
 *         description: Стаття не знайдена
 */
router.get("/articles/:id", getArticleById);


/**
 * @swagger
 * /admin/articles:
 *   post:
 *     summary: Створити нову статтю
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               author_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               meta_title:
 *                 type: string
 *               meta_description:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               tag_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Стаття створена
 */
router.post("/articles", upload.single("file"), createArticle);

/**
 * @swagger
 * /admin/articles/{id}:
 *   put:
 *     summary: Оновити статтю
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               author_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *               meta_title:
 *                 type: string
 *               meta_description:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               tag_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Стаття оновлена
 *       404:
 *         description: Стаття не знайдена
 */
router.put("/articles/:id", upload.single("file"), updateArticle);

/**
 * @swagger
 * /admin/articles/{id}:
 *   delete:
 *     summary: Видалити статтю
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Стаття видалена
 *       404:
 *         description: Стаття не знайдена
 */
router.delete("/articles/:id", deleteArticle);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Отримати всі категорії
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список категорій
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /admin/categories/{id}:
 *   get:
 *     summary: Отримати одну категорію
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
router.get("/categories/:id", getCategoryById);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Створити категорію
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Категорія створена
 */
router.post("/categories", createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Оновити категорію
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Категорія оновлена
 */
router.put("/categories/:id", updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Видалити категорію
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Категорія видалена
 */
router.delete("/categories/:id", deleteCategory);

/**
 * @swagger
 * /admin/tags:
 *   get:
 *     summary: Отримати всі теги
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список тегів
 */
router.get("/tags", getTags);

/**
 * @swagger
 * /admin/tags/{id}:
 *   get:
 *     summary: Отримати один тег
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані тега
 *       404:
 *         description: Тег не знайдений
 */
router.get("/tags/:id", getTagById);

/**
 * @swagger
 * /admin/tags:
 *   post:
 *     summary: Створити тег
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Тег створений
 */
router.post("/tags", createTag);

/**
 * @swagger
 * /admin/tags/{id}:
 *   put:
 *     summary: Оновити тег
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Тег оновлений
 */
router.put("/tags/:id", updateTag);

/**
 * @swagger
 * /admin/tags/{id}:
 *   delete:
 *     summary: Видалити тег
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Тег видалений
 */
router.delete("/tags/:id", deleteTag);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Отримати список авторів
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список авторів
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Отримати одного автора
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані автора
 *       404:
 *         description: Автор не знайдений
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Створити автора
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Автор створений
 */
router.post("/users", uploadAvatar.single("file"), createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Оновити автора
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Автор оновлений
 *       404:
 *         description: Автор не знайдений
 */
router.put("/users/:id", uploadAvatar.single("file"), updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Видалити автора
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Автор видалений
 *       404:
 *         description: Автор не знайдений
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /admin/upload:
 *   post:
 *     summary: Завантажити зображення
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл завантажено
 */
router.post("/upload", (req, res) => res.json({ message: "File uploaded" }));

export default router;