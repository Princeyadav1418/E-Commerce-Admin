import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please provide all fields" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (createError || !createdUser.user) {
      return NextResponse.json({ error: createError?.message ?? "Failed to create account" }, { status: 400 });
    }

    await prisma.admin.create({
      data: {
        id: createdUser.user.id,
        name: String(name).trim(),
        email: normalizedEmail,
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          name: String(name).trim(),
          email: normalizedEmail,
        },
      },
      { status: 201 }
    );

    const supabase = createRouteHandlerClient(req, response);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
