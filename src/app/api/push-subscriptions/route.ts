import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { proxyBackendRequest } from "@/lib/backendProxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return proxyBackendRequest({
    request,
    backendUrl: `${API_PUBLIC_BASE_URL}/push-subscriptions`,
    unavailableMessage: "Unable to save notification preferences.",
    unavailableStatus: 502,
  });
}
