"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send message.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form className="space-y-6 mb-20" onSubmit={handleSubmit} data-reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-white/35 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-none bg-transparent border border-white/10 text-white placeholder:text-white/20
                       focus:outline-none focus:border-[#4d65ff] transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-white/35 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-none bg-transparent border border-white/10 text-white placeholder:text-white/20
                       focus:outline-none focus:border-[#4d65ff] transition-colors duration-300"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-xs font-medium uppercase tracking-widest text-white/35 mb-2">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          className="w-full px-4 py-3 rounded-none bg-transparent border border-white/10 text-white placeholder:text-white/20
                     focus:outline-none focus:border-[#4d65ff] transition-colors duration-300"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-white/35 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Tell me about your project or just say hi..."
          className="w-full px-4 py-3 rounded-none bg-transparent border border-white/10 text-white placeholder:text-white/20
                     focus:outline-none focus:border-[#4d65ff] transition-colors duration-300 resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <span className="text-sm text-[#4d65ff]">Message sent successfully.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-400">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}
