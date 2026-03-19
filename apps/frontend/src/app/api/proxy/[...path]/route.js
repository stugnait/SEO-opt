import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req, context) {
    return handleProxy(req, context);
}

export async function POST(req, context) {
    return handleProxy(req, context);
}

export async function PUT(req, context) {
    return handleProxy(req, context);
}

export async function PATCH(req, context) {
    return handleProxy(req, context);
}

export async function DELETE(req, context) {
    return handleProxy(req, context);
}

async function handleProxy(req, context) {
    try {
        const { path } = await context.params;
        const search = req.nextUrl.search;
        const joinedPath = path.join("/");

        const backendUrl = `${BACKEND_URL}/${joinedPath}${search}`;

        const headers = new Headers(req.headers);
        headers.delete("host");
        headers.delete("content-length");

        const body =
            req.method === "GET" || req.method === "DELETE"
                ? undefined
                : await req.text();

        const res = await fetch(backendUrl, {
            method: req.method,
            headers,
            body,
        });

        const text = await res.text();

        return new NextResponse(text, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "application/json",
            },
        });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Proxy error" },
            { status: 500 }
        );
    }
}
