import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/projects?limit=100`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json(data);
}
