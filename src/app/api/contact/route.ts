import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/* ─── Server-side sanitizer ─── */
function sanitize(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[&<>"'`]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c] ?? c)
    )
    .trim();
}

/* ─── Server-side validators ─── */
function isValidEmail(email: string): boolean {
  return email.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const MAX_WORDS = 100;

/* ─── Rate-limit: simple in-memory store (per-IP, 3 req / 10 min) ─── */
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

/* ─── POST /api/contact ─── */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = sanitize((body as Record<string, unknown>).name);
  const email = sanitize((body as Record<string, unknown>).email);
  const subject = sanitize((body as Record<string, unknown>).subject);
  const message = sanitize((body as Record<string, unknown>).message);

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 422 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 422 });
  }
  if (!message || message.length < 1) {
    return NextResponse.json({ error: "Message is required." }, { status: 422 });
  }
  if (countWords(message) > MAX_WORDS) {
    return NextResponse.json({ error: `Message must be ${MAX_WORDS} words or fewer.` }, { status: 422 });
  }
  if (subject && subject.length > 200) {
    return NextResponse.json({ error: "Subject must be 200 characters or fewer." }, { status: 422 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    console.error("[contact] Missing Resend env vars");
    return NextResponse.json({ error: "Email service is not configured. Please try again later." }, { status: 503 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const mailSubject = subject
      ? `[Portfolio] ${subject} — ${name}`
      : `[Portfolio Contact] New message from ${name}`;

    const fromAddress = process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: mailSubject,
      text: `Name: ${name}\nEmail: ${email}${subject ? `\nSubject: ${subject}` : ""}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: monospace; background: #0d0d0d; color: #f0f0f0; padding: 32px; border-radius: 8px; max-width: 520px;">
          <h2 style="color: #ff6a00; margin: 0 0 24px; font-size: 1rem; letter-spacing: 0.05em; text-transform: uppercase;">
            New Portfolio Message
          </h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="color:#ffffff55; padding: 8px 0; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.08em; width:80px;">Name</td>
              <td style="color:#fff; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color:#ffffff55; padding: 8px 0; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.08em;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color:#ff6a00;">${email}</a></td>
            </tr>
            ${
              subject
                ? `<tr>
              <td style="color:#ffffff55; padding: 8px 0; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.08em;">Subject</td>
              <td style="color:#fff; padding: 8px 0;">${subject}</td>
            </tr>`
                : ""
            }
          </table>
          <hr style="border:none; border-top: 1px solid #ffffff15; margin: 20px 0;" />
          <p style="color:#ffffff55; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; margin: 0 0 8px;">Message</p>
          <p style="color:#fff; margin:0; line-height:1.6; white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "Message sent! I'll get back to you soon." }, { status: 200 });
  } catch (err) {
    console.error("[contact] send error:", err);
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }
}
