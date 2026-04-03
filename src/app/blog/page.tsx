import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | KENTO_O",
  description: "Thoughts on development, design, and building for the web.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        <div className="mb-16">
          <h1
            className="font-black text-white leading-[0.95] mb-4 tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            data-reveal-heading
          >
            Blog
          </h1>
          <p className="section-subtitle" data-reveal-blur>
            Thoughts on development, design, and building for the web.
          </p>
        </div>

        {posts.length === 0 ? (
          <p style={{ color: "var(--fg-muted)" }} data-reveal>No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-1" data-reveal-stagger>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-5 border-b border-white/5 hover:border-white/15 transition-colors duration-300"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-semibold text-lg group-hover:text-[#4d65ff] transition-colors duration-300 truncate">
                    {post.title}
                  </h2>
                  <p className="text-sm mt-1 truncate" style={{ color: "var(--fg-muted)" }}>
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-white/10 text-white/40 text-xs font-medium tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="text-white/20 text-sm font-mono whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
