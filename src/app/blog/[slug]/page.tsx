import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import MdxContent from "@/components/MdxContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | KENTO_O`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        {/* Back link */}
        <Link
          href="/blog"
          className="link-underline text-xs uppercase tracking-widest font-medium mb-12 inline-block"
        >
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1
            className="font-black text-white leading-[0.95] mb-4 tracking-tight"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            data-reveal-heading
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4" data-reveal-blur>
            <time className="text-white/20 text-sm font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-white/10 text-white/40 text-xs font-medium tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <div data-reveal>
          <MdxContent source={post.content} />
        </div>
      </div>
    </div>
  );
}
