import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
		? process.env.NEXT_PUBLIC_SITE_URL
		: "https://www.sarkariglobalresult.com";

const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
const SLUG_REVALIDATE_SECONDS = 60;

type PageProps = Readonly<{
	params: Promise<{
		slug: string;
	}>;
}>;

type ApiPostItem = Readonly<{
	id?: string;
	applicationId?: string;
	postTitle?: string;
	postSlug?: string;
	imageUrl?: string;
	imageUrls?: string;
	contentHtml?: string;
	department?: string;
	organization?: string;
	qualification?: string | null;
	vacancies?: number | null;
	startDate?: string;
	endDate?: string;
	stateName?: string;
	faqSchemaJson?: string;
	postStatus?: string;
	scheduledAt?: string | null;
	postType?: string;
	seoTitle?: string;
	seoDescription?: string;
	seoFocusKeyword?: string;
	createdAt?: string;
	updatedAt?: string;
}>;

type ApiResponse = Readonly<{
	success?: boolean;
	message?: string;
	data?: ApiPostItem[];
}>;

function toText(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown): number | null {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return null;
	}

	return value;
}

function formatDate(value?: string | null): string {
	const raw = toText(value);
	if (!raw) {
		return "-";
	}

	const parsed = new Date(raw);
	if (Number.isNaN(parsed.getTime())) {
		return "-";
	}

	return parsed.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function normalizeContentHtml(html: string): string {
	if (!html) {
		return "";
	}

	return html.replace(/(src\s*=\s*["'])uploads\//gi, "$1/uploads/");
}

function statusClasses(status: string): string {
	const normalized = status.toLowerCase();

	if (normalized.includes("published")) {
		return "border-emerald-200 bg-emerald-50 text-emerald-700";
	}

	if (normalized.includes("pending")) {
		return "border-amber-200 bg-amber-50 text-amber-700";
	}

	if (normalized.includes("scheduled")) {
		return "border-blue-200 bg-blue-50 text-blue-700";
	}

	return "border-slate-200 bg-slate-100 text-slate-700";
}

const fetchBySlug = cache(async (slug: string): Promise<ApiPostItem | null> => {
	try {
		const response = await fetch(`${API_PUBLIC_BASE_URL}/${encodeURIComponent(slug)}`, {
			method: "GET",
			next: { revalidate: SLUG_REVALIDATE_SECONDS },
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as ApiResponse;
		return payload.data?.[0] ?? null;
	} catch {
		return null;
	}
});

function buildFaqJsonLd(rawFaqSchemaJson: string | undefined): Record<string, unknown> | null {
	const value = toText(rawFaqSchemaJson);
	if (!value) {
		return null;
	}

	try {
		return JSON.parse(value) as Record<string, unknown>;
	} catch {
		return null;
	}
}

function getPrimaryImageUrl(item: ApiPostItem): string | null {
	const firstFromImageUrls = toText(item.imageUrls)
		.split(",")
		.map((value) => value.trim())
		.find((value) => value.length > 0);

	const raw = firstFromImageUrls || toText(item.imageUrl);
	if (!raw) {
		return null;
	}

	if (raw.startsWith("http://") || raw.startsWith("https://")) {
		return raw;
	}

	if (raw.startsWith("/")) {
		return `${normalizedSiteUrl}${raw}`;
	}

	if (raw.toLowerCase().startsWith("uploads/")) {
		return `${normalizedSiteUrl}/${raw}`;
	}

	return `${normalizedSiteUrl}/uploads/${raw}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const item = await fetchBySlug(slug);

	if (!item) {
		return {
			title: "Post",
			description: "Post details",
		};
	}

	const title = toText(item.seoTitle) || toText(item.postTitle) || "Post";
	const description =
		toText(item.seoDescription) ||
		`Read full details for ${toText(item.postTitle) || slug}.`;
	const canonicalUrl = `${normalizedSiteUrl}/${slug}`;
	const imageUrl = getPrimaryImageUrl(item);
	const focusKeyword = toText(item.seoFocusKeyword);
	const keywordSet = new Set<string>(DEFAULT_SEO_KEYWORDS);
	if (focusKeyword) {
		keywordSet.add(focusKeyword);
	}

	const postTitleKeyword = toText(item.postTitle);
	if (postTitleKeyword) {
		keywordSet.add(postTitleKeyword);
	}

	return {
		title,
		description,
		applicationName: "Sarkari Global Result",
		keywords: Array.from(keywordSet),
		creator: "Sarkari Global Result",
		publisher: "Sarkari Global Result",
		alternates: {
			canonical: `/${slug}`,
		},
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			siteName: "Sarkari Global Result",
			type: "article",
			images: imageUrl
				? [
					{
						url: imageUrl,
						width: 1200,
						height: 630,
						alt: title,
					},
				]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: imageUrl ? [imageUrl] : undefined,
		},
	};
}

export default async function SlugPage({ params }: PageProps) {
	const { slug } = await params;
	const item = await fetchBySlug(slug);

	if (!item) {
		redirect("/");
	}

	const contentHtml = normalizeContentHtml(toText(item.contentHtml));
	const title = toText(item.seoTitle) || toText(item.postTitle) || slug;
	const description =
		toText(item.seoDescription) || `Read full details for ${toText(item.postTitle) || slug}.`;
	const canonicalUrl = `${normalizedSiteUrl}/${slug}`;
	const imageUrl = getPrimaryImageUrl(item);
	const publishedAt = toText(item.createdAt);
	const modifiedAt = toText(item.updatedAt);
	const faqJsonLd = buildFaqJsonLd(item.faqSchemaJson);

	const webPageJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: title,
		description,
		url: canonicalUrl,
		inLanguage: "en-IN",
	};

	const articleJsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		mainEntityOfPage: canonicalUrl,
		author: {
			"@type": "Organization",
			name: "Sarkari Global Result",
		},
		publisher: {
			"@type": "Organization",
			name: "Sarkari Global Result",
			logo: {
				"@type": "ImageObject",
				url: `${normalizedSiteUrl}/favicon.ico`,
			},
		},
	};

	if (publishedAt) {
		articleJsonLd.datePublished = publishedAt;
	}

	if (modifiedAt) {
		articleJsonLd.dateModified = modifiedAt;
	}

	if (imageUrl) {
		articleJsonLd.image = [imageUrl];
	}

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: normalizedSiteUrl,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: title,
				item: canonicalUrl,
			},
		],
	};

	return (
		<main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_42%,#f7f9fc_100%)] py-4 sm:py-6">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			{faqJsonLd ? (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
				/>
			) : null}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(30,64,175,0.10),transparent_35%)]"
			/>

			<article className="relative mx-auto w-[min(1160px,96vw)] space-y-3">

				<section>
					<div>
						<div dangerouslySetInnerHTML={{ __html: contentHtml }} />
					</div>
				</section>
			</article>
		</main>
	);
}
