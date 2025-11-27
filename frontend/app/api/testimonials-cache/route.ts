import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET(req: Request) {
    const lang = new URL(req.url).searchParams.get("lang") || "en";
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials?lang=${lang}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return NextResponse.json(data);
}
