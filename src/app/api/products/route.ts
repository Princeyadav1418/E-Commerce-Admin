import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().min(0),
  image: z.string().url(),
  category: z.string().min(2),
  stock: z.coerce.number().min(0),
  status: z.enum(["active", "draft", "archived"]),
});

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
    const json = await req.json();
    const result = productSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }
    const data = result.data;

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category,
        stock: data.stock,
        status: data.status as ProductStatus,
      },
    });

    return NextResponse.json({ success: true, product: withMongoLikeId(product) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
