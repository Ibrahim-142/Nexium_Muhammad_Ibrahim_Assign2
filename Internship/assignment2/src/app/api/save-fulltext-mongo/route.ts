import { NextResponse } from "next/server";
import connectMongo from "../../../../utils/mongodb";
import FullText from "../../../../models/FullText";
export async function POST(req: Request) {
  try {
    const { url, fullText } = await req.json();

    if (typeof url !== "string" || typeof fullText !== "string" || !url.trim() || !fullText.trim()) {
      return NextResponse.json({ success: false, error: "Missing or invalid url or fullText" }, { status: 400 });
    }
    await connectMongo();
    const created = await FullText.create({ url, fullText });
    return NextResponse.json({
      success: true,
      data: {
        mongoId: created._id,
        createdAt: created.createdAt,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Mongo insert error:", err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
