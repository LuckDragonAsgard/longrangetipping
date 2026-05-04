import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { email, password, display_name } = await request.json();
    if (!email || !password || !display_name) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-supabase")) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { display_name } },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ user: { id: data.user?.id, email: data.user?.email, display_name }, message: "Account created - check your email to confirm" });
    }
    return NextResponse.json({ user: { id: "demo-" + Date.now(), email, display_name }, message: "Demo mode - account created" });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
