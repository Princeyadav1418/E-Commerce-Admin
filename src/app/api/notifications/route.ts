import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [pendingOrders, lowStockProducts, draftProducts] = await Promise.all([
      prisma.order.count({ where: { status: "pending" } }),
      prisma.product.findMany({
        take: 5,
        where: { stock: { lte: 5 } },
        select: { id: true, title: true, stock: true },
        orderBy: { stock: "asc" },
      }),
      prisma.product.count({ where: { status: "draft" } }),
    ]);

    const notifications = [
      ...(pendingOrders > 0
        ? [{
            id: "pending-orders",
            title: `${pendingOrders} pending orders`,
            description: "Review fulfillment queue",
            href: "/dashboard/orders",
          }]
        : []),
      ...lowStockProducts.map((product) => ({
        id: product.id,
        title: `${product.title} is low on stock`,
        description: `${product.stock} units remaining`,
        href: "/dashboard/products",
      })),
      ...(draftProducts > 0
        ? [{
            id: "draft-products",
            title: `${draftProducts} draft products`,
            description: "Publish or archive unfinished listings",
            href: "/dashboard/products",
          }]
        : []),
    ];

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
