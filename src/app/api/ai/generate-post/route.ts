import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GeneratePostBody = {
  readonly title?: string;
};

type GeneratedPost = Readonly<{
  readonly contentHtml: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoFocusKeyword: string;
  readonly slug: string;
}>;

function sanitizeTitle(input: string): string {
  return input.replace(/^#+\s*/, "").trim();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function safeText(input: unknown): string {
  return typeof input === "string" ? input.trim() : "";
}

function clamp(input: string, maxLength: number): string {
  return input.length > maxLength ? `${input.slice(0, maxLength - 3).trimEnd()}...` : input;
}

function fallbackKeyword(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

  return words.slice(0, 4).join(" ") || "job update";
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const markdownFenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = markdownFenceMatch?.[1] ?? text;

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeGeneratedPost(title: string, payload: Record<string, unknown>): GeneratedPost {
  const seoTitleBase = safeText(payload.seoTitle) || `${title} | Eligibility, Dates, Apply Online`;
  const seoDescriptionBase =
    safeText(payload.seoDescription) ||
    `Check complete details for ${title} including eligibility, important dates, application process, fees, and official links.`;
  const seoFocusKeywordBase = safeText(payload.seoFocusKeyword) || fallbackKeyword(title);
  const slugBase = safeText(payload.slug) || slugify(title);
  const contentBase = safeText(payload.contentHtml);

  const contentHtml = contentBase
    ? contentBase
    : `<h2>${title}</h2><p>${title} details are being updated. Check back soon for full eligibility, dates, and links.</p>`;

  return {
    contentHtml,
    seoTitle: clamp(seoTitleBase, 60),
    seoDescription: clamp(seoDescriptionBase, 160),
    seoFocusKeyword: clamp(seoFocusKeywordBase, 40),
    slug: slugify(slugBase) || slugify(title),
  };
}

function buildPrompt(title: string): string {
  return [
    "You are an expert content writer for government job and exam notifications.",
    "Generate content for the provided post title.",
    "Return only JSON with keys: contentHtml, seoTitle, seoDescription, seoFocusKeyword, slug.",
    "Requirements:",
    "- contentHtml: production-ready HTML article with sections and lists.",
    "- seoTitle: max 60 characters.",
    "- seoDescription: max 160 characters.",
    "- seoFocusKeyword: 2-4 words.",
    "- slug: lowercase hyphenated.",
    `Title: ${title}`,
  ].join("\n");
}

function generateFallbackPost(title: string): GeneratedPost {
  const keyword = fallbackKeyword(title);
  const seoTitle = clamp(`${title} | Eligibility, Dates, Apply Online`, 60);
  const seoDescription = clamp(
    `Check complete details for ${title} including eligibility, important dates, application process, fees, and official links.`,
    160,
  );

  const contentHtml = [
    `<h2>${title}</h2>`,
    `<p>${title} notification has been released. Candidates should review complete instructions before applying.</p>`,
    "<h3>Important Highlights</h3>",
    "<ul><li>Post Name: Specialist Officer (SO)</li><li>Department: IDBI Bank</li><li>Application Start: Check official schedule</li><li>Last Date: Check official schedule</li></ul>",
    "<h3>Eligibility Criteria</h3>",
    "<p>Review age limit, educational qualifications, category relaxation, and required experience in the official notification.</p>",
    "<h3>Selection Process</h3>",
    "<p>The expected process may include shortlisting, online test, interview, document verification, and medical fitness.</p>",
    "<h3>How to Apply</h3>",
    "<ol><li>Visit the official IDBI Bank careers portal.</li><li>Register with valid contact details.</li><li>Fill the SO online form carefully.</li><li>Upload required documents.</li><li>Submit and keep the application printout.</li></ol>",
    `<p><strong>Focus Keyword:</strong> ${keyword}</p>`,
  ].join("");

  return {
    contentHtml,
    seoTitle,
    seoDescription,
    seoFocusKeyword: keyword,
    slug: slugify(title),
  };
}

async function generateWithOpenAI(title: string): Promise<GeneratedPost> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON API. Return only valid JSON and no markdown.",
        },
        {
          role: "user",
          content: buildPrompt(title),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    readonly choices?: ReadonlyArray<{
      readonly message?: {
        readonly content?: string;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = parseJsonObject(content);

  if (!parsed) {
    throw new Error("OpenAI response did not contain a valid JSON object.");
  }

  return normalizeGeneratedPost(title, parsed);
}

async function generateWithGemini(title: string): Promise<GeneratedPost> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: [
                "You are a strict JSON API. Return only valid JSON and no markdown.",
                buildPrompt(title),
              ].join("\n\n"),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    readonly candidates?: ReadonlyArray<{
      readonly content?: {
        readonly parts?: ReadonlyArray<{
          readonly text?: string;
        }>;
      };
    }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const parsed = parseJsonObject(text);

  if (!parsed) {
    throw new Error("Gemini response did not contain a valid JSON object.");
  }

  return normalizeGeneratedPost(title, parsed);
}

function resolveProvider(): "openai" | "gemini" {
  const configured = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();

  if (configured === "openai" || configured === "gemini") {
    return configured;
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  if (process.env.GEMINI_API_KEY) {
    return "gemini";
  }

  throw new Error(
    "No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY, or set AI_PROVIDER.",
  );
}

export async function POST(request: Request) {
  let body: GeneratePostBody;

  try {
    body = (await request.json()) as GeneratePostBody;
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const title = sanitizeTitle(body.title?.trim() ?? "");
  if (title.length < 8) {
    return NextResponse.json(
      { message: "Title must be at least 8 characters for AI generation." },
      { status: 400 },
    );
  }

  try {
    const provider = resolveProvider();
    const generated =
      provider === "openai" ? await generateWithOpenAI(title) : await generateWithGemini(title);

    return NextResponse.json({ provider, generated });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown AI generation error.";
    const errorName =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { readonly name?: unknown }).name ?? "")
        : "";
    const causeMessage =
      typeof error === "object" &&
      error !== null &&
      "cause" in error &&
      (error as { readonly cause?: unknown }).cause instanceof Error
        ? (error as { readonly cause: Error }).cause.message
        : "";
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { readonly code?: unknown }).code ?? "")
        : "";

    const fallback = generateFallbackPost(title);

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          message:
            "AI provider call failed; fallback content was generated.",
          detail,
          errorName,
          causeMessage,
          code,
          provider: "fallback",
          generated: fallback,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        provider: "fallback",
        generated: fallback,
      },
      { status: 200 },
    );
  }
}
