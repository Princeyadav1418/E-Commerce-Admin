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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json({ success: true, product: withMongoLikeId(product) }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    if (error?.code === "P2003") {
      return NextResponse.json({
        success: false,
        error: "This product is attached to existing orders. Archive it instead of deleting it.",
      }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    if (error?.code === "P2003") {
      return NextResponse.json({
        success: false,
        error: "This product is attached to existing orders. Archive it instead of deleting it.",
      }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
