import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Please provide email and password" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const response = NextResponse.json({ success: true }, { status: 200 });
    const supabase = createRouteHandlerClient(req, response);

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let admin = await prisma.admin.findUnique({
      where: { id: user.id },
    });

    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          id: user.id,
          email: normalizedEmail,
          name: user.user_metadata?.name ?? normalizedEmail.split("@")[0],
        },
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
