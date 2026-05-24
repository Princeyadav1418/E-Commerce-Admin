"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type AdminProfile = {
  name: string;
  email: string;
  role: "admin" | "superadmin";
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState<AdminProfile>({
    name: "",
    email: "",
    role: "admin",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || !data.success || !data.admin) {
          throw new Error(data.error || "Failed to load profile");
        }

        setProfile({
          name: data.admin.name ?? "",
          email: data.admin.email ?? "",
          role: data.admin.role ?? "admin",
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save settings");
      }
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const copyRole = async () => {
    await navigator.clipboard.writeText(profile.role);
    toast.success("Role copied");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your admin profile and environment details.
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Admin Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your name and login email.
          </p>
        </div>
        <div className="col-span-2 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              disabled={fetching || loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              disabled={fetching || loading}
            />
          </div>
          <Button onClick={handleSave} disabled={fetching || loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Environment</h3>
          <p className="text-sm text-muted-foreground">
            Runtime information and access level.
          </p>
        </div>
        <div className="col-span-2 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex items-center gap-2">
              <Input id="role" value={profile.role} readOnly />
              <Button variant="outline" onClick={copyRole}>
                Copy
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            API keys are managed in deployment environment variables, not exposed in this dashboard UI.
          </p>
        </div>
      </div>
    </div>
  );
}
