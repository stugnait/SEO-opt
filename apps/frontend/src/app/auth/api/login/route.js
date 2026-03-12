// app/api/auth/login/route.js
import { NextResponse } from "next/server"

export async function POST(req) {
    const { email, password } = await req.json()

    // простий приклад: перевірка логіна
    if (email === "ivan@example.com" && password === "hashedpassword1") {
        return NextResponse.json({ token: "abc123", user: { username } })
    } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
}