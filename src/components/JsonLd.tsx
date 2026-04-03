const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kento-o.dev";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "KENTO_O",
  url: BASE_URL,
  jobTitle: "Creative Developer",
  description: "Creative developer building refined digital experiences.",
  sameAs: [
    "https://github.com/yourusername",
    "https://linkedin.com/in/yourusername",
    "https://twitter.com/yourusername",
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
