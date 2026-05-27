"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/app/components/Navbar";

export default function ContactUsPage() {
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setStatus("submitting");

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem("subject") as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim();

    if (!name || !email || !description) {
      setError("Please fill in your name, email, and description.");
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, description }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to send your message.");
      }

      setSuccess("Your message was sent successfully. Our support team will respond soon.");
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again later.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-border bg-card/95 p-8 shadow-lg shadow-black/5 dark:border-border dark:bg-card dark:shadow-black/10">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary dark:text-primary">
              Contact Support
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground sm:text-4xl">
              Send us a message
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
              Share your name, email, subject, and message. Our support team will get back to you as soon as possible. We look forward to assisting you!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground dark:text-foreground">Name</span>
                <Input id="name" name="name" type="text" placeholder="Your name" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground dark:text-foreground">Email</span>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground dark:text-foreground">Subject</span>
              <Input id="subject" name="subject" type="text" placeholder="Optional subject" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground dark:text-foreground">Description</span>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-white/5"
                placeholder="Tell us what you need help with..."
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/40 dark:bg-destructive/20 dark:text-destructive">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl border border-secondary/50 bg-chart-6/35 px-4 py-3 text-sm text-primary dark:border-secondary/40 dark:bg-chart-1/20 dark:text-primary">
                {success}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={status === "submitting"}
              className="text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-md hover:shadow-violet-500/30">
                {status === "submitting" ? "Sending..." : "Send message"}
              </Button>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                Prefer email? Write directly to <Link href="mailto:support@linkid.qzz.io" className="text-indigo-600 hover:underline ">support@linkid.qzz.io</Link>
              </p>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
