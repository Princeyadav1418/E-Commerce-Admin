import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  image: z.string().min(1).default("/file.svg"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  status: z.enum(["active", "draft", "archived"]),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "10"), 1), 50);
    const sortBy = searchParams.get("sortBy") === "price" ? "price" : "createdAt";
    const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortDir },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
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
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        issues: result.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const data = result.data;
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image || "/file.svg",
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
