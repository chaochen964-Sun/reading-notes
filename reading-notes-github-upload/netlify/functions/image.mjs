export async function handler(event) {
  const url = new URL(event.rawUrl || `https://readingnotes.local${event.path || "/api/image"}`);
  const target = url.searchParams.get("url");
  if (!target) return { statusCode: 400, body: "Missing url" };

  try {
    const response = await fetch(target, {
      headers: {
        "user-agent": "Mozilla/5.0",
        referer: "https://book.douban.com/",
      },
    });
    const body = Buffer.from(await response.arrayBuffer()).toString("base64");
    return {
      statusCode: response.status,
      isBase64Encoded: true,
      headers: {
        "content-type": response.headers.get("content-type") || "image/jpeg",
        "cache-control": "public, max-age=86400",
      },
      body,
    };
  } catch {
    return { statusCode: 502, body: "Image proxy failed" };
  }
}
