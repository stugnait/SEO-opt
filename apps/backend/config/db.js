import pkg from "pg";

import path from "path";
import dotenv from "dotenv";

// Піднімаємося на один рівень вгору від поточної робочої директорії
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD || '') // Forces a string type
});