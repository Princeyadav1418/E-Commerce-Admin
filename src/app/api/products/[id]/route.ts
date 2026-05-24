import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";
import { getCurrentAdmin, logAuditAction } from "@/lib/auth";

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().min(0),
  image: z.string().url(),
  category: z.string().min(2),
  stock: z.coerce.number().min(0),
  status: z.enum(["active", "draft", "archived"]),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await req.json();
    
    const result = productSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin || admin.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized: Superadmin access required" }, { status: 403 });
    }

    const { id } = await params;
    
    // Fetch product before delete for audit logging
    const product = await prisma.product.findUnique({ where: { id } });
    
    await prisma.product.delete({
      where: { id },
    });

    if (product) {
      await logAuditAction(admin.id, "DELETE", "Product", id, `Deleted product: ${product.title}`);
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
