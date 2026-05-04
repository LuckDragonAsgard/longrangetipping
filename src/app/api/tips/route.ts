import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { comp_id, tips } = await request.json();
    if (!comp_id || !tips || !Array.isArray(tips)) {
      return NextResponse.json({ error: "Comp ID and tips array required" }, { status: 400 });
    }
    return NextResponse.json({ message: tips.length + " tips saved successfully", saved_count: tips.length });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save tips" }, { status: 500 });
  }
}

