import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
export async function POST(req: Request) {
  const { url, summary } = await req.json();
  const { data, error } = await supabase
    .from("summaries")
    .insert([{ url, summary }])
    .select("id, created_at") 
    .single();
  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({
    success: true,
    id: data.id,
    createdAt: data.created_at,
  });
}
