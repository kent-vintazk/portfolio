import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | KENTO_O",
  description: "Get in touch — I'm open to new opportunities and collaborations.",
};

const socials = [
  { label: "GitHub", href: "https://github.com/yourusername", handle: "@yourusername" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername", handle: "yourusername" },
  { label: "Twitter / X", href: "https://twitter.com/yourusername", handle: "@yourusername" },
  { label: "Email", href: "mailto:you@example.com", handle: "you@example.com" },
];

export default function ContactPage() {
  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        <div className="max-w-2xl">
          <h1
            className="font-black text-white leading-[0.95] mb-4 tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            data-reveal-heading
          >
            Get In Touch
          </h1>
          <p className="text-lg mb-16" data-reveal-blur style={{ color: "var(--fg-muted)" }}>
            I&apos;m currently open to new opportunities. Whether you have a project in mind,
            a question, or just want to say hi — my inbox is always open.
          </p>

          {/* Contact Form */}
          <ContactForm />

          {/* Socials */}
          <div data-reveal>
            <h2 className="text-xs font-medium uppercase tracking-widest text-white/35 mb-6">Find me elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-reveal-stagger>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center justify-between group"
                >
                  <span className="text-white/35 group-hover:text-white transition-colors duration-300">{s.label}</span>
                  <span className="text-[#4d65ff] text-sm font-mono">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
