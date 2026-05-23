import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
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
