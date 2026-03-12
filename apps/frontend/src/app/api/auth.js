export async function loginUser(data) {
    const res = await fetch("/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    const text = await res.text()
    try {
        return JSON.parse(text)
    } catch {
        throw new Error("Expected JSON, got HTML:\n" + text)
    }
}