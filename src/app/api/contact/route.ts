import { NextResponse } from "next/server";

/**
 * Contact endpoint.
 * Sends mail through Resend's HTTP API when RESEND_API_KEY and CONTACT_TO_EMAIL are set.
 * Without them it reports "not configured", and the form falls back to opening a
 * pre-filled email draft in the visitor's own mail app (nothing is claimed as sent).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function GET() {
  return NextResponse.json({ configured: isConfigured() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(data.name);
  const email = str(data.email);
  const subject = str(data.subject);
  const message = str(data.message);

  // honeypot: real visitors never fill this hidden field
  if (str(data.company)) return NextResponse.json({ ok: true });

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) fieldErrors.name = "Enter your name.";
  if (!EMAIL_RE.test(email) || email.length > 200) fieldErrors.email = "Enter a valid email address.";
  if (subject.length > 150) fieldErrors.subject = "Keep the subject under 150 characters.";
  if (message.length < 10 || message.length > 5000) fieldErrors.message = "Write a message of at least 10 characters.";
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ ok: false, error: "validation", fieldErrors }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio: ${subject || "New message"}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
