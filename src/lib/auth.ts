import { createClient } from "./supabase/server";
import { prisma } from "./prisma";

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: user.id }
  });

  return admin;
}

export async function checkSuperAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "superadmin") {
    return false;
  }
  return true;
}

export async function requireSuperAdmin() {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    throw new Error("Unauthorized: Superadmin access required");
  }
}

export async function logAuditAction(adminId: string, action: string, entity: string, entityId: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        details
      }
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
  }
}
