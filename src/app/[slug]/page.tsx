import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

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

async function fetchBySlug(slug: string): Promise<ApiPostItem | null> {
	try {
		const response = await fetch(`${API_PUBLIC_BASE_URL}/${encodeURIComponent(slug)}`, {
			method: "GET",
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as ApiResponse;
		return payload.data?.[0] ?? null;
	} catch {
		return null;
	}
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

	return {
		title,
		description,
	};
}

export default async function SlugPage({ params }: PageProps) {
	const { slug } = await params;
	const item = await fetchBySlug(slug);

	if (!item) {
		redirect("/");
	}

	const contentHtml = normalizeContentHtml(toText(item.contentHtml));

	return (
		<main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_42%,#f7f9fc_100%)] py-4 sm:py-6">
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
