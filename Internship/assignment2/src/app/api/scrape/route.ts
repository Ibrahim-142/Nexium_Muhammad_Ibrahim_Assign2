import { scrapeBlogText } from "@/lib/scrapeBlog";
import { simulateSummary } from "@/lib/simulateSummary";
export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url) {
    return new Response("Missing URL", { status: 400 });
  }
  try {
    console.log("Received URL:", url); 
    const fullText = await scrapeBlogText(url);
    console.log("Scraped Text:", fullText?.slice(0, 300)); 
    const summary = simulateSummary(fullText);
    console.log("Summary:", summary);
    return Response.json({ summary, fullText });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Failed to scrape or summarize", { status: 500 });
  }
}
