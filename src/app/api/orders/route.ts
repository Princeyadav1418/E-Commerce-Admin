import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "10"), 1), 50);
    const where = search
      ? {
          OR: [
            { customerName: { contains: search, mode: "insensitive" as const } },
            { customerEmail: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      orders: orders.map((order) => ({
        ...withMongoLikeId(order),
        items: order.items.map((item) => ({
          _id: item.id,
          quantity: item.quantity,
          price: item.price,
          productId: item.product ? withMongoLikeId(item.product) : item.productId,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
