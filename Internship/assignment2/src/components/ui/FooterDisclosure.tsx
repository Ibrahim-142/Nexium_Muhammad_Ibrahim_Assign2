"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface FooterDisclosureProps {
  collapsed: boolean;
}
export default function FooterDisclosure({ collapsed }: FooterDisclosureProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [open]);

  return (
    <footer
      className={`text-center text-sm text-gray-600 mt-12 mb-6 px-4 transition-all duration-300 ${
        collapsed ? "ml-16" : "ml-60"
      }`}
    >
      <div className="mx-auto max-w-3xl text-left bg-white/70 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-sm">
        <button
          onClick={() => setOpen(!open)}
          className="cursor-pointer font-semibold text-blue-700 flex items-center justify-between w-full"
        >
          <span>What content gets scraped?</span>
          <span className="ml-2">{open ? "−" : "+"}</span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
  ref={contentRef}
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="overflow-hidden mt-2 space-y-2 text-gray-700 text-sm scroll-mt-24"
>
              <p>The scraper removes the following elements:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Headers, footers, navigation bars, sidebars</li>
                <li>Scripts, style tags, hidden elements</li>
                <li>Comment counts, share buttons, social links</li>
                <li>Duplicate titles, promotional overlays</li>
              </ul>
              <p>Only main article content is retained for clarity.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
