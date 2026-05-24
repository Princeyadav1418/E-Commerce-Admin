import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, admin }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const normalizedName = parsed.data.name.trim();

    const existing = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && existing.id !== admin.id) {
      return NextResponse.json({ success: false, error: "Email is already in use" }, { status: 409 });
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name: normalizedName,
        email: normalizedEmail,
      },
    });

    return NextResponse.json({ success: true, admin: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
