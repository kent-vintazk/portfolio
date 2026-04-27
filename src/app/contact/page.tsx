import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | KENTO_O",
  description: "Get in touch — I'm open to new opportunities and collaborations.",
};

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/yourusername",
    handle: "chirdnek",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    handle: "kendrickserrano",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/yourusername",
    handle: "@keydsky",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:you@example.com",
    handle: "kendrickserrano7@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        <div className="max-w-2xl">

          {/* ── Eyebrow ── */}
          <p
            className="text-xs font-mono uppercase tracking-[0.2em] mb-5"
            style={{ color: "var(--accent, #ff6a00)" }}
            data-reveal-blur
          >
            Let's work together
          </p>

          {/* ── Heading ── */}
          <h1
            className="font-black text-white leading-[0.95] mb-6 tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            data-reveal-heading
          >
            Get In Touch
          </h1>

          {/* ── Sub-copy ── */}
          <p
            className="text-lg mb-16 max-w-xl leading-relaxed"
            data-reveal-blur
            style={{ color: "var(--fg-muted)" }}
          >
            Currently open to new opportunities. Whether you have a project in mind,
            a question, or just want to say hi — my inbox is always open.
          </p>

          {/* ── Contact Form ── */}
          <ContactForm />

          {/* ── Divider ── */}
          <div
            className="my-12 h-px w-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
            data-reveal
          />

          {/* ── Social links ── */}
          <div data-reveal>
            <h2 className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
              Find me elsewhere
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-reveal-stagger>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.label !== "Email" ? "_blank" : undefined}
                  rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
                  className="card flex items-center justify-between gap-4 group"
                >
                  <span className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <span className="transition-colors duration-300 group-hover:text-white">
                      {s.icon}
                    </span>
                    <span className="text-sm transition-colors duration-300 group-hover:text-white">
                      {s.label}
                    </span>
                  </span>
                  <span className="text-xs font-mono truncate" style={{ color: "var(--accent, #ff6a00)" }}>
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}