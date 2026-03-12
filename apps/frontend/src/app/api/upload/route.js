import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "Файл не передано" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = Date.now() + "-" + file.name;

        const filePath = path.join(
            process.cwd(),
            "public/images",
            fileName
        );

        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/images/${fileName}`
        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            { error: "Помилка upload" },
            { status: 500 }
        );

    }

}