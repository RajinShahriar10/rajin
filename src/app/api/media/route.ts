import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { cloudinary, cloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const mediaIndexSchema = z.object({
  publicId: z.string().trim().min(1).max(300),
  url: z.string().url().max(1000),
  format: z.string().trim().max(20).nullable().optional(),
  width: z.number().int().positive().max(20000).nullable().optional(),
  height: z.number().int().positive().max(20000).nullable().optional(),
  bytes: z.number().int().positive().max(100 * 1024 * 1024).nullable().optional(),
  resourceType: z.string().trim().max(20).default("image"),
  alt: z.string().trim().max(500).nullable().optional(),
  entityType: z.string().trim().max(100).nullable().optional(),
  entityId: z.string().trim().max(200).nullable().optional(),
  order: z.number().int().default(0),
});

export async function GET(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");

  const media = await prisma.media.findMany({
    where: {
      ...(entityType ? { entityType } : {}),
      ...(entityId ? { entityId } : {}),
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 200,
  });
  return NextResponse.json({ media, configured: cloudinaryConfigured() });
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = mediaIndexSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media payload." }, { status: 400 });
  }

  const { publicId, ...data } = parsed.data;

  await prisma.media.upsert({
    where: { publicId },
    update: data,
    create: { publicId, ...data },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { publicId } = (await request.json().catch(() => ({}))) as { publicId?: string };
  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  if (cloudinaryConfigured()) {
    try {
      await cloudinary().api.delete_resources([publicId]);
    } catch {
      // ignore deletion failures from Cloudinary; still remove the DB row
    }
  }

  await prisma.media.deleteMany({ where: { publicId } });
  return NextResponse.json({ ok: true });
}
