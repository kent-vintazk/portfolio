"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

const MAX_WORDS = 100;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");

  const wordCount = countWords(message);
  const overLimit = wordCount > MAX_WORDS;
  const atLimit = wordCount >= MAX_WORDS;

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    // Hard cap: reject changes that would push past the word limit.
    // Edits within the existing words (backspace, fixing typos) stay allowed.
    if (countWords(next) > MAX_WORDS) return;
    setMessage(next);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (overLimit) {
      setStatus("error");
      setErrorMsg(`Message must be ${MAX_WORDS} words or fewer.`);
      return;
    }

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
      setMessage("");
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
                       focus:outline-none focus:border-[#ff6a00] transition-colors duration-300"
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
                       focus:outline-none focus:border-[#ff6a00] transition-colors duration-300"
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
                     focus:outline-none focus:border-[#ff6a00] transition-colors duration-300"
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-white/35">
            Message
          </label>
          <span
            className={`text-xs font-mono tracking-wider ${
              overLimit ? "text-red-400" : atLimit ? "text-[#ff6a00]" : "text-white/35"
            }`}
            aria-live="polite"
          >
            {wordCount} / {MAX_WORDS} words
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={message}
          onChange={handleMessageChange}
          placeholder="Tell me about your project or just say hi..."
          className={`w-full px-4 py-3 rounded-none bg-transparent border text-white placeholder:text-white/20
                     focus:outline-none transition-colors duration-300 resize-none ${
                       overLimit
                         ? "border-red-400/60 focus:border-red-400"
                         : "border-white/10 focus:border-[#ff6a00]"
                     }`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending" || overLimit}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <span className="text-sm text-[#ff6a00]">Message sent successfully.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-400">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}
