import { NextResponse } from "next/server";

type ProxyBackendRequestOptions = Readonly<{
  readonly request?: Request;
  readonly backendUrl: string | URL;
  readonly method?: string;
  readonly headers?: HeadersInit;
  readonly body?: BodyInit | null;
  readonly unavailableMessage?: string;
  readonly unavailableStatus?: number;
}>;

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

function createProxyResponseHeaders(response: Response) {
  const headers = new Headers();
  const contentType = response.headers.get("content-type");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  headers.set("Cache-Control", "no-store");
  return headers;
}

function createBackendRequestHeaders(
  request: Request | undefined,
  method: string,
  headers: HeadersInit | undefined,
) {
  const backendHeaders = new Headers(headers);

  if (!backendHeaders.has("Accept")) {
    backendHeaders.set("Accept", request?.headers.get("accept") ?? "application/json");
  }

  if (!METHODS_WITHOUT_BODY.has(method) && !backendHeaders.has("Content-Type")) {
    backendHeaders.set("Content-Type", request?.headers.get("content-type") ?? "application/json");
  }

  return backendHeaders;
}

export async function proxyBackendRequest({
  request,
  backendUrl,
  method,
  headers,
  body,
  unavailableMessage = "Backend service is unavailable.",
  unavailableStatus = 503,
}: ProxyBackendRequestOptions) {
  const requestMethod = (method ?? request?.method ?? "GET").toUpperCase();
  const requestBody = METHODS_WITHOUT_BODY.has(requestMethod)
    ? undefined
    : body !== undefined
      ? body
      : await request?.text();

  try {
    const response = await fetch(backendUrl.toString(), {
      method: requestMethod,
      headers: createBackendRequestHeaders(request, requestMethod, headers),
      body: requestBody,
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: createProxyResponseHeaders(response),
    });
  } catch {
    return NextResponse.json(
      { message: unavailableMessage },
      { status: unavailableStatus },
    );
  }
}
