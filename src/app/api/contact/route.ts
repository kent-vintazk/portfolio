import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    // Validate required fields
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // ──────────────────────────────────────────────
    // TODO: Connect to your preferred email service.
    // Options:
    //   1. Resend  — npm install resend
    //   2. Nodemailer + SMTP
    //   3. Formspree / Web3Forms (external POST)
    //
    // Example with Resend:
    //   import { Resend } from "resend";
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: "contact@yourdomain.com",
    //     to: "you@example.com",
    //     subject: body.subject || "New contact form message",
    //     text: `From: ${body.name} (${body.email})\n\n${body.message}`,
    //   });
    // ──────────────────────────────────────────────

    console.log("Contact form submission:", {
      name: body.name,
      email: body.email,
      subject: body.subject || "(none)",
      message: body.message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
