import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // На локалці підтягне .env, на Railway просто проігнорує

const { Pool } = pkg;

// Пріоритет: DATABASE_URL (для Railway), інакше окремі змінні (для локалки)
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        // Якщо це внутрішня мережа Railway, SSL зазвичай не потрібен,
        // але для зовнішніх підключень до БД він обов'язковий
        ssl: process.env.DATABASE_URL.includes('railway.internal')
            ? false
            : { rejectUnauthorized: false }
    }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD || '')
    };

export const pool = new Pool(poolConfig);