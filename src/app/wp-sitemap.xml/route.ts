import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/data";

export async function GET() {
  return NextResponse.redirect(`${SITE_URL}/sitemap.xml`, 301);
}
