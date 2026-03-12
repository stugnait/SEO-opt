export async function getArticles({ page = 1, limit = 10 } = {}) {
    const res = await fetch(`/api/articles?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("Expected JSON, got HTML:\n" + text);
    }
}