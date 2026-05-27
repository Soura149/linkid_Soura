import { NextResponse } from "next/server";
import { sendSupportEmail } from "@/lib/email";

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = isValidEmail(body?.email) ? body.email.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const description = typeof body?.description === "string" ? body.description.trim() : "";

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required." },
        { status: 400 }
      );
    }

    const supportEmail = process.env.SUPPORT_EMAIL || "support@linkid.qzz.io";
    const subjectLine = subject || "Contact form submission";

    await sendSupportEmail({
      to: supportEmail,
      subject: `LinkID Contact Form: ${subjectLine}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subjectLine}\n\n${description}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111827;">
          <h2 style="margin-bottom: 16px;">LinkID Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subjectLine}</p>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 12px;">
            <p style="white-space: pre-wrap; line-height: 1.6;">${description}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
