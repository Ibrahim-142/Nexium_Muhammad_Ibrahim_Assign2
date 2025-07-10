import * as cheerio from "cheerio";
export async function scrapeBlogText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BlogScraper/1.0)",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch the blog page: ${res.statusText}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const content =
    $("article").length > 0
      ? $("article")
      : $(".story__content").length > 0
      ? $(".story__content")
      : $("main").length > 0
      ? $("main")
      : $("body");
  content.find("script, style, nav, footer, header, aside").remove();
  const text = content.text().replace(/\s+/g, " ").trim();
  if (!text || text.length < 100) {
    throw new Error("Scraped content is too short or empty.");
  }
  return text;
}
