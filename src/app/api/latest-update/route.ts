import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { proxyBackendRequest } from "@/lib/backendProxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const backendUrl = new URL(`${API_PUBLIC_BASE_URL}/latest-update`);

  searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  return proxyBackendRequest({
    backendUrl,
    unavailableMessage: "Unable to reach the latest updates service.",
    unavailableStatus: 502,
  });
}
