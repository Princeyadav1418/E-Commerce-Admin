"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  status: z.enum(["active", "draft", "archived"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({ initialData, onSuccess }: { initialData?: any; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      status: "draft",
      price: 0,
      stock: 0,
      title: "",
      description: "",
      category: "",
    },
  });

  useEffect(() => {
    reset(initialData || {
      status: "draft",
      price: 0,
      stock: 0,
      title: "",
      description: "",
      category: "",
    });
    setImage(initialData?.image || null);
  }, [initialData, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.result.secure_url);
        toast.success("Image uploaded!");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...data, image };
      const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");
      
      toast.success(initialData ? "Product updated!" : "Product created!");
      onSuccess();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors border-muted-foreground/25">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {image ? (
                <img src={image} alt="Preview" className="h-32 object-contain" />
              ) : uploadingImage ? (
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </>
              )}
            </div>
            <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} className={errors.title ? "border-destructive" : ""} />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} className={errors.description ? "border-destructive" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} className={errors.price ? "border-destructive" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} className={errors.stock ? "border-destructive" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} className={errors.category ? "border-destructive" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select 
            id="status" 
            {...register("status")} 
            className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.status ? "border-destructive" : ""}`}
          >
            <option value="draft" className="bg-background text-foreground">Draft</option>
            <option value="active" className="bg-background text-foreground">Active</option>
            <option value="archived" className="bg-background text-foreground">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button disabled={loading} type="submit" className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
