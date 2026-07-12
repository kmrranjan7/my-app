import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const mimeToExtension: Readonly<Record<string, string>> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fileField = formData.get("file");

  if (!(fileField instanceof File)) {
    return NextResponse.json(
      { message: "Image file is required." },
      { status: 400 },
    );
  }

  if (!(fileField.type in mimeToExtension)) {
    return NextResponse.json(
      { message: "Only PNG, JPG, WEBP, and GIF images are allowed." },
      { status: 415 },
    );
  }

  if (fileField.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Image size must be 5MB or less." },
      { status: 413 },
    );
  }

  const extension = mimeToExtension[fileField.type];
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const destinationPath = path.join(uploadsDir, fileName);

  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await fileField.arrayBuffer());
  await writeFile(destinationPath, buffer);

  return NextResponse.json({ location: `/uploads/${fileName}` });
}
