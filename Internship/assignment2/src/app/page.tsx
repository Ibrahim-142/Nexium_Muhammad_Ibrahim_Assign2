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
import { motion } from "framer-motion";

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
          position: "top-center",
          description: (
            <>
              ID: {saveData.id},
              <br />
              Date: {new Date().toLocaleDateString("en-PK", {
                timeZone: "Asia/Karachi",
              })},
              <br />
              Time: {new Date().toLocaleTimeString("en-PK", {
                timeZone: "Asia/Karachi",
              })}
            </>
          ),
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
        toast.success("Saved to MongoDB", {
          position: "top-center",
          description: (
            <>
              ID: {mongoData.data.mongoId},
              <br />
              Date: {new Date(mongoData.data.createdAt).toLocaleDateString("en-PK", {
                timeZone: "Asia/Karachi",
              })},
              <br />
              Time: {new Date(mongoData.data.createdAt).toLocaleTimeString("en-PK", {
                timeZone: "Asia/Karachi",
              })}
            </>
          ),
        });
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
   <motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#E0E7FF] to-[#F0F4FF] px-4 py-12 font-sans text-[#1E293B]"
>
  <div className="max-w-3xl mx-auto space-y-10">
    <div className="text-center space-y-3">
      <h1 className="text-5xl font-extrabold tracking-tight text-[#7C3AED] drop-shadow-md">
        Blog Summarizer & Translator
      </h1>
      <p className="text-base text-[#475569]">
        Instantly summarize and translate blogs into Urdu — powered by Next.js.
      </p>
    </div>

    <Card className="rounded-2xl shadow-md border border-[#7C3AED]/30 bg-white text-[#1E293B]">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[#7C3AED] font-semibold text-sm">
            Choose a sample blog:
          </label>
          <Select onValueChange={(val: string) => setUrl(val)}>
            <SelectTrigger className="bg-white border border-[#CBD5E1] focus:ring-[#7C3AED] text-[#1E293B]">
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
          <label className="text-[#7C3AED] font-semibold text-sm">
            Or enter a custom blog URL:
          </label>
          <Input
            placeholder="https://example.com/blog"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white text-[#1E293B] border border-[#94A3B8] focus:ring-[#7C3AED]"
          />
        </div>
        <Button
          onClick={handleScrape}
          disabled={isLoading}
          className={`hover:cursor-pointer w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm tracking-wide transition-all duration-300 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
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
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
    {!isLoading && summary && (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-[#7C3AED]/40 shadow-sm rounded-2xl text-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#7C3AED]">
                AI Summary (English)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={summary}
                className="min-h-[100px] bg-[#F8FAFC] text-[#1E293B] border border-gray-200"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white border border-[#38BDF8]/40 rounded-2xl text-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#38BDF8]">
                خلاصے کا ترجمہ (Urdu)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={translatedSummary}
                className="min-h-[100px] bg-[#F0F9FF] text-[#0F172A] font-[serif]"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white border border-[#A5F3FC]/40 rounded-2xl text-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#0E7490]">
                Full Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={fullText}
                className="min-h-[200px] bg-[#ECFEFF] text-[#0F172A]"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )}
  </div>
</motion.main>

  );
}
