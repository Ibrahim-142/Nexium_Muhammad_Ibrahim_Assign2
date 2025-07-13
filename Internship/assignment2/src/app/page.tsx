"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { translateToUrdu } from "../../utils/translateToUrdu";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [fullText, setFullText] = useState("");
  const [scraping, setScraping] = useState(false);
  const [savingSupa, setSavingSupa] = useState(false);
  const [savingMongo, setSavingMongo] = useState(false);

  const handleScrape = async () => {
    setError("");
    setSummary("");
    setFullText("");
    setTranslatedSummary("");
    setScraping(true);
    if (!url.trim()) {
      setError("Please enter or select a valid URL.");
      setScraping(false);
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
        setScraping(false);
        return;
      }
      setSummary(data.summary);
      setFullText(data.fullText);
      setTranslatedSummary(translateToUrdu(data.summary));
      setScraping(false);
      setSavingSupa(true);
      const saveRes = await fetch("/api/savetosupa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, summary: data.summary }),
      });
      const saveData = await saveRes.json();
      setSavingSupa(false);

      if (!saveData.success) {
        toast.error("Supabase Error", {
          description: saveData.error || "Failed to save summary.",
        });
      } else {
        toast.success("Saved to Supabase", {
          description: `ID: ${saveData.id} at ${new Date().toLocaleString()}`,
        });
      }
      setSavingMongo(true);
      const mongoRes = await fetch("/api/save-fulltext-mongo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, fullText: data.fullText }),
      });
      const mongoData = await mongoRes.json();
      setSavingMongo(false);
      if (!mongoRes.ok || !mongoData.success) {
        setError(`Failed to save to Mongo: ${mongoData.error}`);
        toast.error("MongoDB Error", {
          description: mongoData.error || "Could not save full text.",
        });
      } else {
        setTimeout(() => {
          toast.success("Saved to MongoDB", {
            description: `ID: ${mongoData.data.mongoId} at ${new Date(
              mongoData.data.createdAt
            ).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
          });
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please check the server.");
      toast.error("Unexpected Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setScraping(false);
      setSavingSupa(false);
      setSavingMongo(false);
    }
  };

  const isLoading = scraping || savingSupa || savingMongo;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#00F260] via-[#0575E6] to-[#845EC2] px-4 py-12 font-sans text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#00F9FF] drop-shadow-lg">
            Blog Summarizer & Translator
          </h1>
          <p className="text-base text-white/80">
            Instantly summarize and translate blogs into Urdu — powered by AI.
          </p>
        </div>

        <Card className="rounded-2xl shadow-xl border border-[#38BDF8]/40 bg-[#0f172a]/80 backdrop-blur-sm text-white">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[#A78BFA] font-semibold text-sm">
                Choose a sample blog:
              </label>
              <Select onValueChange={(val: string) => setUrl(val)}>
                <SelectTrigger className="bg-[#1E293B] border border-[#64748B]/40 focus:ring-[#60A5FA] text-white">
                  <SelectValue placeholder="Select a blog URL..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https://jamesclear.com/saying-no">
                    James Clear – Saying No
                  </SelectItem>
                  <SelectItem value="https://fs.blog/michael-abrashoff-leadership/">
                    Farnam Street – Leadership
                  </SelectItem>
                  <SelectItem value="https://www.dawn.com/news/1910002">
                    STARBUZZ: The Shah of Dramas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[#A78BFA] font-semibold text-sm">
                Or enter a custom blog URL:
              </label>
              <Input
                placeholder="https://example.com/blog"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-[#1E293B] text-white border border-[#4ADE80]/40 focus:ring-[#22D3EE]"
              />
            </div>

            <Button
              onClick={handleScrape}
              disabled={isLoading}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm tracking-wide"
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {scraping
                ? "Scraping..."
                : savingSupa
                  ? "Saving to Supabase..."
                  : savingMongo
                    ? "Saving to MongoDB..."
                    : "Scrape & Summarize"}
            </Button>

            {error && (
              <div className="bg-red-500/10 border border-red-400 text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {summary && (
          <div className="space-y-6">
            <Card className="bg-[#1E293B]/90 border border-[#22D3EE]/40 shadow-md rounded-2xl text-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#22D3EE]">
                  AI Summary (English)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={summary}
                  className="min-h-[100px] bg-[#0F172A] text-white border-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-[#2D2A55]/90 border border-[#F472B6]/40 rounded-2xl text-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#22D3EE]">
                  خلاصے کا ترجمہ   (Urdu)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={translatedSummary}
                  className="min-h-[100px] bg-[#1E1B4B] text-white font-[serif]"
                />
              </CardContent>
            </Card>

            <Card className="bg-[#164E63]/80 border border-[#67E8F9]/40 rounded-2xl text-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#67E8F9]">
                  Full Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={fullText}
                  className="min-h-[200px] bg-[#082F49] text-white"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>

  );
}
