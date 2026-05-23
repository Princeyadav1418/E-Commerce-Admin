import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  const supabase = createRouteHandlerClient(req, response);
  await supabase.auth.signOut();

  // Cleanup legacy cookie if present.
  response.cookies.set({
    name: "adminToken",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
