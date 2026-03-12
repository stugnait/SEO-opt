import jwt from "jsonwebtoken";
import { pool } from "../../config/db.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const logout = (req, res) => {
    res.json({ message: "Logged out" });
};