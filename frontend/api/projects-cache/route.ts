import { NextResponse } from "next/server";

export const revalidate = 3600; 

export async function GET() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json(data);
}
