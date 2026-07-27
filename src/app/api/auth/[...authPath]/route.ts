import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { proxyBackendRequest } from "@/lib/backendProxy";

export const runtime = "nodejs";

type RouteContext = Readonly<{
  readonly params: Promise<{
    readonly authPath?: string[];
  }>;
}>;

async function proxyAuthRequest(request: Request, context: RouteContext) {
  const { authPath = [] } = await context.params;
  const { search } = new URL(request.url);
  const backendPath = authPath.map((segment) => encodeURIComponent(segment)).join("/");
  const backendUrl = `${API_PUBLIC_BASE_URL}/auth/${backendPath}${search}`;

  return proxyBackendRequest({
    request,
    backendUrl,
    unavailableMessage: "Authentication service is unavailable.",
  });
}

export {
  proxyAuthRequest as DELETE,
  proxyAuthRequest as GET,
  proxyAuthRequest as POST,
  proxyAuthRequest as PUT,
};
