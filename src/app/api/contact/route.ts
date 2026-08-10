import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

const messageWithHoneypot = z
  .object({
    website: z.string().max(0).optional().default(""),
  })
  .merge(contactMessageSchema);

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return `contact:${ip}`;
}

export async function POST(request: Request) {
  const rate = checkRateLimit(clientKey(request));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = messageWithHoneypot.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form and try again." },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
