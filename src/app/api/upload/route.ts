import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PRODUCTS_BUCKET = "product-images";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Only image files are allowed." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File exceeds max size of 5MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage.from(PRODUCTS_BUCKET).upload(filePath, fileBytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
      cacheControl: "3600",
    });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(PRODUCTS_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      result: {
        secure_url: data.publicUrl,
        public_id: filePath,
        url: data.publicUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Upload failed." }, { status: 500 });
  }
}
