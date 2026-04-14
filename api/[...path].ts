import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const backendUrl = process.env.BACKEND_URL?.trim();
  if (!backendUrl) {
    return res.status(500).json({ error: "BACKEND_URL not configured" });
  }

  // Parse path from the URL directly — more reliable than req.query.path
  const reqUrl = req.url || "";
  const stripped = reqUrl.replace(/^\/api\//, "");
  const [pathPart, queryPart] = stripped.split("?");

  const target = `${backendUrl.replace(/\/$/, "")}/${pathPart}`;
  const finalUrl = queryPart ? `${target}?${queryPart}` : target;

  const headers: Record<string, string> = {};
  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"];
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(finalUrl, fetchOptions);

    // Forward redirects to the browser instead of following them
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        return res.redirect(response.status, location);
      }
    }

    const contentType = response.headers.get("content-type") || "";

    res.status(response.status);
    res.setHeader("Content-Type", contentType);

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    }

    const text = await response.text();
    return res.send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(502).json({ error: "Backend unavailable" });
  }
}
