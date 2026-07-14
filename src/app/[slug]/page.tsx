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

	const postTitle = toText(item.postTitle) || "Untitled Post";
	const postType = toText(item.postType) || "-";
	const postStatus = toText(item.postStatus) || "Draft";
	const applicationId = toText(item.applicationId) || "-";
	const postId = toText(item.id) || "-";
	const postSlug = toText(item.postSlug) || slug;
	const organization = toText(item.organization) || "-";
	const department = toText(item.department) || "-";
	const stateName = toText(item.stateName) || "All India";
	const qualification = toText(item.qualification) || "-";
	const vacancies = toNumber(item.vacancies);
	const startDate = formatDate(item.startDate);
	const endDate = formatDate(item.endDate);
	const createdAt = formatDate(item.createdAt);
	const updatedAt = formatDate(item.updatedAt);
	const scheduledAt = formatDate(item.scheduledAt);
	const seoTitle = toText(item.seoTitle) || "-";
	const seoDescription = toText(item.seoDescription) || "-";
	const seoFocusKeyword = toText(item.seoFocusKeyword) || "-";
	const faqSchemaJson = toText(item.faqSchemaJson) || "-";
	const contentHtml = normalizeContentHtml(toText(item.contentHtml));

	return (
		<main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_42%,#f7f9fc_100%)] py-4 sm:py-6">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(30,64,175,0.10),transparent_35%)]"
			/>

			<article className="relative mx-auto w-[min(1160px,96vw)] space-y-3">
				<header className="rounded-2xl border border-blue-200/70 bg-white/90 px-4 py-4 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:px-6">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-700">
							{postType}
						</p>
						<span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClasses(postStatus)}`}>
							{postStatus}
						</span>
					</div>

					<h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
						{postTitle}
					</h1>

					<p className="mt-1 break-all text-xs text-slate-500">
						Slug: <span className="font-semibold text-slate-700">/{postSlug}</span>
					</p>

					<div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-700 md:grid-cols-4 xl:grid-cols-6">
						<p><span className="font-bold text-slate-900">Post ID:</span> {postId}</p>
						<p><span className="font-bold text-slate-900">App ID:</span> {applicationId}</p>
						<p><span className="font-bold text-slate-900">Org:</span> {organization}</p>
						<p><span className="font-bold text-slate-900">Dept:</span> {department}</p>
						<p><span className="font-bold text-slate-900">State:</span> {stateName}</p>
						<p>
							<span className="font-bold text-slate-900">Vacancies:</span>{" "}
							{vacancies === null ? "-" : vacancies.toLocaleString("en-IN")}
						</p>
						<p><span className="font-bold text-slate-900">Qualification:</span> {qualification}</p>
						<p><span className="font-bold text-slate-900">Start:</span> {startDate}</p>
						<p><span className="font-bold text-slate-900">End:</span> {endDate}</p>
						<p><span className="font-bold text-slate-900">Created:</span> {createdAt}</p>
						<p><span className="font-bold text-slate-900">Updated:</span> {updatedAt}</p>
						<p><span className="font-bold text-slate-900">Scheduled:</span> {scheduledAt}</p>
					</div>
				</header>

				<section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px]">
					<div className="rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.08)] sm:px-6">
						<h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
							Post Content
						</h2>
						<div className="prose prose-slate mt-3 max-w-none prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm">
							<div dangerouslySetInnerHTML={{ __html: contentHtml }} />
						</div>
					</div>

					<aside className="space-y-3">
						<article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
							<p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
								SEO
							</p>
							<div className="mt-2 space-y-2 text-xs text-slate-700">
								<p><span className="font-bold text-slate-900">SEO Title:</span> {seoTitle}</p>
								<p><span className="font-bold text-slate-900">Focus Keyword:</span> {seoFocusKeyword}</p>
								<p><span className="font-bold text-slate-900">Description:</span> {seoDescription}</p>
							</div>
						</article>

						<article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
							<p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
								FAQ Schema JSON
							</p>
							<pre className="mt-2 max-h-[300px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700">
								{faqSchemaJson}
							</pre>
						</article>
					</aside>
				</section>
			</article>
		</main>
	);
}
