import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalOrders, totalRevenue, customersCount, productsCount, monthlyOrders, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.customer.count(),
      prisma.product.count({
        where: {
          status: "active",
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfYear,
          },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
    ]);

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthLabels.map((name) => ({ name, total: 0 }));

    monthlyOrders.forEach((order) => {
      const monthIndex = order.createdAt.getMonth();
      chartData[monthIndex].total += order.totalAmount;
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        subscriptions: customersCount,
        sales: totalOrders,
        activeNow: productsCount,
      },
      chartData,
      recentSales: recentOrders.map((order) => ({
        _id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
