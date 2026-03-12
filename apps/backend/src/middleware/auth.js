import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    console.log("Headers:", req.headers); // <- побачиш, що реально приходить
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7) // обрізаємо "Bearer "
        : authHeader;

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token" });
    }
};