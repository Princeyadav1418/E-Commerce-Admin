import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";

    const products = await prisma.product.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(withMongoLikeId),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: data.category,
        stock: Number(data.stock),
        status: data.status as ProductStatus,
      },
    });

    return NextResponse.json({ success: true, product: withMongoLikeId(product) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
