export function simulateSummary(blogText: string): string {
  const sentences = blogText
    .split(/(?<=[.?!])\s+/)
    .filter((s) => s.length > 50 && s.length < 500); 
  if (sentences.length === 0) return "No content to summarize.";
  const middleIndex = Math.floor(sentences.length / 2);
  const contextWindow = 1; 
  const summary = sentences
    .slice(middleIndex - contextWindow, middleIndex + contextWindow + 1)
    .join(" ");
  return summary;
}
