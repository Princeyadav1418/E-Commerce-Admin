import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "./env";

const isAuthPage = (pathname: string) => pathname.startsWith("/login") || pathname.startsWith("/signup");
const isPublicPage = (pathname: string) => pathname === "/";
type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const apiRoute = pathname.startsWith("/api");
  const authApiRoute = pathname.startsWith("/api/auth");
  const authPage = isAuthPage(pathname);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (authPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user) {
    if (apiRoute && !authApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!apiRoute && !authPage && !isPublicPage(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (user && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
};
