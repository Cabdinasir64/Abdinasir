import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const lang = new URL(req.url).searchParams.get("lang") || "en";
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/skills?lang=${lang}`;

    const res = await fetch(apiUrl, { cache: "no-store" });
     if (!res.ok) throw new Error("Failed to fetch backend skills");
    const data = await res.json();

    return NextResponse.json(data);
}
