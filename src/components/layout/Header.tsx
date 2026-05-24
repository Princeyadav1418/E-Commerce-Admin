"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string;
};

type Notification = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login";
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications ?? []);
        }
      } catch {
        setNotifications([]);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.success ? data.results ?? [] : []);
      } catch {
        setResults([]);
      }
    }, 180);

    return () => clearTimeout(timeout);
  }, [query]);

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/75 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center flex-1 gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="size-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <form
          className="relative hidden w-full max-w-md md:block"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) {
              router.push(results[0].href);
              setQuery("");
              setResults([]);
            }
          }}
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search everything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1 focus-visible:ring-primary shadow-none"
          />
          {results.length > 0 && (
            <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="block rounded-xl px-3 py-2 hover:bg-muted"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{result.title}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{result.type}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{result.description}</p>
                </Link>
              ))}
            </div>
          )}
        </form>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Signals</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">No active alerts</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} onClick={() => router.push(notification.href)} className="flex-col items-start gap-1 py-2">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.description}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="h-6 w-[1px] bg-border mx-1" />
        
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
