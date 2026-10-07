import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  // BACKEND_URL is automatically injected by Vercel Service Bindings into the frontend service
  const backendBase =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const subPath = pathSegments.join("/");
  const queryString = req.nextUrl.search;
  const targetUrl = `${backendBase.replace(/\/$/, "")}/api/${subPath}${queryString}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    // Exclude hop-by-hop headers and host header
    if (lower !== "host" && lower !== "content-length" && lower !== "connection") {
      headers.set(key, value);
    }
  });

  try {
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.arrayBuffer()
        : undefined;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // @ts-expect-error duplex required for streaming request body in Node fetch
      duplex: "half",
    });

    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers();

    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "content-encoding" && lower !== "transfer-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[API Proxy Error] Failed to proxy to ${targetUrl}:`, err);
    return NextResponse.json(
      {
        error: "Backend Service Unavailable",
        target: targetUrl,
        detail: message,
      },
      { status: 502 }
    );
  }
}
