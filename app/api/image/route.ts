import { NextRequest, NextResponse } from "next/server";

const allowedHosts = new Set(["img1.doubanio.com", "img2.doubanio.com", "img3.doubanio.com", "img9.doubanio.com"]);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url") || "";

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
      return NextResponse.json({ error: "不支持的图片地址" }, { status: 400 });
    }

    const image = await fetch(url.toString(), {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer: "https://book.douban.com/",
        "user-agent": "Mozilla/5.0",
      },
    });

    if (!image.ok) return NextResponse.json({ error: "图片无法读取" }, { status: image.status });

    return new Response(image.body, {
      headers: {
        "content-type": image.headers.get("content-type") || "image/jpeg",
        "cache-control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "图片地址无效" }, { status: 400 });
  }
}
