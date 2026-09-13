import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;

const DOC_KEYS = ["resume", "cv"] as const;
type DocKey = (typeof DOC_KEYS)[number];

function isDocKey(value: string): value is DocKey {
  return DOC_KEYS.includes(value as DocKey);
}

function sanitizeName(name: string): string {
  const clean = name.replace(/["\\\r\n]/g, "").trim().slice(0, 160);
  return clean || "document.pdf";
}

function updateData(doc: DocKey, bytes: Uint8Array<ArrayBuffer>, filename: string) {
  return doc === "resume"
    ? {
        resumeBlob: bytes,
        resumePublicId: filename,
        resumeUrl: "blob:resume",
      }
    : {
        cvBlob: bytes,
        cvPublicId: filename,
        cvUrl: "blob:cv",
      };
}

export async function POST(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const doc = searchParams.get("doc") ?? "";
  if (!isDocKey(doc)) {
    return NextResponse.json({ error: "Invalid document field." }, { status: 400 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
    return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 10 MB or smaller." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const data = updateData(doc, bytes, sanitizeName(file.name));

  await prisma.about.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", heading: "About Me", ...data },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const doc = searchParams.get("doc") ?? "";
  if (!isDocKey(doc)) {
    return NextResponse.json({ error: "Invalid document field." }, { status: 400 });
  }

  const data =
    doc === "resume"
      ? { resumeBlob: null, resumePublicId: null, resumeUrl: null }
      : { cvBlob: null, cvPublicId: null, cvUrl: null };

  await prisma.about.update({
    where: { id: "main" },
    data,
  });

  return NextResponse.json({ ok: true });
}