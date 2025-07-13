# Blog Summarizer & Urdu Translator  
Instantly scrape blog articles, summarize them using AI, and translate the summary into Urdu.  
Clean UI · Dual DB (Supabase + MongoDB) · Urdu Translation · AI Summaries  
Built with Shadcn, Tailwind CSS, and Framer Motion
## Features
- Scrape any blog post (custom URL or choose from samples)
- AI Summary generation (Static Logic)
- Urdu translation using a custom JS dictionary file
- Dual database persistence: Supabase for summaries, MongoDB for full text
- Elegant UI with Tailwind CSS, Shadcn UI, and Framer Motion for basic Tranistions
- Responsive and accessible design
- Localized toast notifications via Sonner
  - Notifications now appear for 2 seconds
  - Hover over the notification to view notification details with clarity
- Notified saving to DB. Don't forget to => "Hover over the notification to view notification details with clarity"
- Custom built Footer component to tell the User what was scraped
- Session resets automatically on browser refresh or via navbar refresh
- Sidebar (Navbar) includes working refresh button and route navigation (Home, Full Text)
  Vercel Link:https://nexium-muhammad-ibrahim-assign2.vercel.app/