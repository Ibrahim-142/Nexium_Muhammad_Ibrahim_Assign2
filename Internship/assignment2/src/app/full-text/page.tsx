"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import FooterDisclosure from "@/components/ui/FooterDisclosure";

export default function FullTextPage() {
  const [fullText, setFullText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fullText");
    if (stored) {
      setFullText(stored);
    }
  }, []);

  return (
    <>
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        } min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#E0E7FF] to-[#F0F4FF] px-4 py-12 font-sans text-[#1E293B]`}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-white border border-[#A5F3FC]/40 rounded-2xl text-[#1E293B]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#0E7490]">
                Full Blog Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={fullText || "No full text found in session."}
                className="min-h-[300px] bg-[#ECFEFF] text-[#0F172A]"
              />
            </CardContent>
          </Card>
        </div>
      </motion.main>
      <FooterDisclosure collapsed={collapsed} />
    </>
  );
}
