import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/yourusername" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
  { label: "Twitter", href: "https://twitter.com/yourusername" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container-custom py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-white font-bold text-lg tracking-tight">
              YourName<span className="text-indigo-400">.</span>
            </Link>
            <p className="text-white/40 text-sm mt-1">Building things for the web.</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          © {new Date().getFullYear()} YourName. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
