import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMongoLikeId } from "@/lib/serializers";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const product = await prisma.product.update({
      where: { id },
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
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
