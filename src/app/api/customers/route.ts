import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, customers: customers.map(withMongoLikeId) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
