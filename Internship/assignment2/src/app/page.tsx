"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { translateToUrdu } from "../../utils/translateToUrdu";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [fullText, setFullText] = useState("");
  const handleScrape = async () => {
    setError("");
    setSummary("");
    setFullText("");
    setTranslatedSummary("");
    setLoading(true);
    if (!url.trim()) {
      setError("Please enter or select a valid URL.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok || !data.summary) {
        setError("Failed to scrape the blog. Try a different URL.");
      } else {
        setSummary(data.summary);
        setFullText(data.fullText);
        setTranslatedSummary(translateToUrdu(data.summary));
        const saveRes = await fetch("/api/savetosupa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, summary: data.summary }),
        });
        const saveData = await saveRes.json();
        if (!saveData.success) {
          console.error("Failed to save summary:", saveData.error);
        }
        console.log("Sending to MongoDB:", {
          url,
          fullText: data.fullText,
        });
    const mongoRes = await fetch("/api/save-fulltext-mongo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          fullText: data.fullText,
        }),
      });
 const mongoData = await mongoRes.json();
      if (!mongoRes.ok || !mongoData.success) {
        console.error("Failed to save to Mongo:", mongoData.error);
        setError(`Failed to save to Mongo: ${mongoData.error}`);
      } else {
        console.log("Saved to Mongo successfully!");
       alert(
  `Saved to MongoDB!\nID: ${mongoData.data.mongoId
  }\nTime: ${new Date(mongoData.data.createdAt).toLocaleString()}
  \nSaved to Supabase:\nID: ${saveData.id}`
);
      }
      }
    } catch {
      setError("Something went wrong. Please check the server.");
    }
    setLoading(false);
  };
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4 font-sans">
      <h1 className="text-2xl font-bold">Blog Summariser</h1>
      <div className="space-y-2">
        <label className="font-medium">Choose a sample blog:</label>
        <Select onValueChange={(val: string) => setUrl(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose blog URL..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="https://jamesclear.com/saying-no">
              James Clear - Saying No
            </SelectItem>
            <SelectItem value="https://fs.blog/michael-abrashoff-leadership/">
              Farnam Street - Leadership
            </SelectItem>
            <SelectItem value="https://www.dawn.com/news/1910002">
              STARBUZZ: THE SHAH OF DRAMAS
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="font-medium">Or enter a custom blog URL:</label>
        <Input
          placeholder="https://example.com/blog-post"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUrl(e.target.value)
          }
        />
      </div>

      <Button onClick={handleScrape} disabled={loading}>
        {loading ? "Scraping..." : "Scrape & Summarize"}
      </Button>
      {error && (
        <div className="text-red-500 border border-red-300 p-3 rounded bg-red-50">
          {error}
        </div>
      )}
      {summary && (
        <>
          <h2 className="text-xl font-semibold mt-6">AI Summary (English):</h2>
          <Textarea readOnly value={summary} className="min-h-[100px]" />
          <h2 className="text-xl font-semibold mt-6">
            ترجمہ شدہ خلاصہ (Urdu):
          </h2>
          <Textarea
            readOnly
            value={translatedSummary}
            className="min-h-[100px] font-[serif]"
          />
          <h2 className="text-xl font-semibold mt-6">Full Text:</h2>
          <Textarea readOnly value={fullText} className="min-h-[200px]" />
        </>
      )}
    </main>
  );
}
