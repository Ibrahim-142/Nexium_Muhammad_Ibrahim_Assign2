import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
export async function POST(req: Request) {
  const { url, summary } = await req.json();
  const { error } = await supabase.from("summaries").insert([
    { url, summary },
  ]);
  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
