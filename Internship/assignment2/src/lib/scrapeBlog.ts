import puppeteer from "puppeteer";
export async function scrapeBlogText(url: string): Promise<string> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const text = await page.evaluate(() => {
      const disallowedTags = [
        "nav",
        "footer",
        "aside",
        "header",
        "script",
        "style",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ];
      const container =
        document.querySelector("article") ||
        document.querySelector(".story__content") ||
        document.querySelector("main") ||
        document.body;
      function isInsideDisallowedTag(node: Node | null): boolean {
        while (node && node.nodeType === Node.ELEMENT_NODE) {
          const tag = (node as HTMLElement).tagName?.toLowerCase();
          if (disallowedTags.includes(tag)) return true;
          node = (node as HTMLElement).parentElement;
        }
        return false;
      }
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node: Node) => {
            const parent = node.parentElement;
            if (!parent || isInsideDisallowedTag(parent)) {
              return NodeFilter.FILTER_REJECT;
            }
            const style = window.getComputedStyle(parent);
            if (style.display === "none" || style.visibility === "hidden") {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );
      let output = "";
      let node = walker.nextNode();
      while (node) {
        const trimmed = node.textContent?.trim();
        if (trimmed) {
          output += trimmed + " ";
        }
        node = walker.nextNode();
      }
      return output.replace(/\s+/g, " ").trim();
    });
    await browser.close();
    return text;
  } catch (err) {
    console.error("Scrape error:", err);
    throw new Error("Failed to scrape blog content.");
  }
}
