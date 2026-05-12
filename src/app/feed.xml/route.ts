import { SITE_URL } from "@/lib/seo";
import { articles } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  const items = articles
    .slice()
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .map((article) => {
      const url = `${SITE_URL}/es/blog/${article.slug}`;
      const pubDate = new Date(article.datePublished).toUTCString();
      return `    <item>
      <title><![CDATA[${article.es.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${article.es.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>info@djshipsupply.com (De Jesús Ship Supply)</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Marítimo — De Jesús Ship Supply</title>
    <link>${SITE_URL}/es/blog</link>
    <description>Guías técnicas y recursos prácticos sobre MARPOL, provisiones marítimas y operaciones de ship chandler en República Dominicana.</description>
    <language>es-do</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>© ${new Date().getFullYear()} De Jesús Ship Supply</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
