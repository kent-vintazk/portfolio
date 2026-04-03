import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Portfolio",
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
    <div className="pt-24 pb-24">
      <div className="container-custom">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-white/60 text-lg mb-12">
            I&apos;m currently open to new opportunities. Whether you have a project in mind,
            a question, or just want to say hi — my inbox is always open.
          </p>

          {/* Contact Form */}
          <form className="space-y-6 mb-16" action="#" method="POST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30
                             focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30
                             focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="Tell me about your project or just say hi..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Send Message
            </button>
          </form>

          {/* Socials */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Find me elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center justify-between group"
                >
                  <span className="text-white/70 group-hover:text-white transition-colors">{s.label}</span>
                  <span className="text-indigo-400 text-sm font-mono">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
