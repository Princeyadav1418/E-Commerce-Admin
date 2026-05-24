import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    
    const customersCount = await prisma.customer.count();
    const productsCount = await prisma.product.count({
      where: {
        status: "active"
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        subscriptions: customersCount,
        sales: totalOrders,
        activeNow: productsCount,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
