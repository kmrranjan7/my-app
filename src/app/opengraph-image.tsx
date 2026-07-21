import { SITE_URL } from "@/lib/seo";

export const alt = "Sarkari Global Result Latest government jobs, admit cards, and results";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const response = await fetch(`${SITE_URL}/opengraph.png`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return new Response(null, { status: 404 });
  }

  return new Response(response.body, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400",
    },
  });
}
