import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (query.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({
        take: 5,
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, category: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.order.findMany({
        take: 5,
        where: {
          OR: [
            { customerName: { contains: query, mode: "insensitive" } },
            { customerEmail: { contains: query, mode: "insensitive" } },
          ],
        },
        select: { id: true, customerName: true, totalAmount: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.findMany({
        take: 5,
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, email: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      results: [
        ...products.map((product) => ({
          id: product.id,
          type: "Product",
          title: product.title,
          description: product.category,
          href: `/dashboard/products?search=${encodeURIComponent(query)}`,
        })),
        ...orders.map((order) => ({
          id: order.id,
          type: "Order",
          title: order.customerName,
          description: `$${order.totalAmount.toFixed(2)}`,
          href: `/dashboard/orders?search=${encodeURIComponent(query)}`,
        })),
        ...customers.map((customer) => ({
          id: customer.id,
          type: "Customer",
          title: customer.name,
          description: customer.email,
          href: `/dashboard/customers?search=${encodeURIComponent(query)}`,
        })),
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
