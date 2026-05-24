"use client";

import { useState, useEffect } from "react";
import { Copy, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>("admin");
  const [fetchingRole, setFetchingRole] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.admin) {
          setRole(data.admin.role);
        }
      })
      .finally(() => setFetchingRole(false));
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Settings updated successfully.");
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store settings and configuration.
        </p>
      </div>

      <Separator />

      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Store Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your store information.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="StoreSync" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input id="storeEmail" type="email" defaultValue="admin@example.com" />
            </div>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          <div className="space-y-1">
            <h3 className="text-lg font-medium flex items-center gap-2">
              API Keys
              {role !== "superadmin" && !fetchingRole && (
                <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold">Superadmin Only</span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage API keys for external integrations.
            </p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="publishableKey">Publishable Key</Label>
              <div className="flex items-center gap-2">
                <Input id="publishableKey" readOnly value={role === "superadmin" ? "pk_test_1234567890abcdef" : "************************"} disabled={role !== "superadmin"} />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("pk_test_1234567890abcdef")} disabled={role !== "superadmin"}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="flex items-center gap-2">
                <Input id="secretKey" type="password" readOnly placeholder="************************" value="" disabled={role !== "superadmin"} />
                <Button variant="outline" onClick={() => toast.info("Reveal secret key functionality is disabled for security.")} disabled={role !== "superadmin"}>
                  Reveal
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {role === "superadmin" ? "Never share your secret key with anyone." : "You do not have permission to view API keys."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
