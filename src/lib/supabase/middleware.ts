import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key",
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes for unauthenticated users
    if (
        !user &&
        (request.nextUrl.pathname.startsWith("/chat") ||
            request.nextUrl.pathname.startsWith("/profile/edit"))
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Strict Identity Verification Gate
    if (user) {
        // Allow API routes to pass through for server actions
        if (request.nextUrl.pathname.startsWith("/api") || request.nextUrl.pathname.startsWith("/_next")) {
            return response;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("is_verified, username")
            .eq("id", user.id)
            .single();

        const isVerified = profile?.is_verified && profile?.username;
        const isOnSetup = request.nextUrl.pathname === "/setup-profile";

        // If NOT verified and NOT on setup page -> Redirect to Setup
        if (!isVerified && !isOnSetup) {
            const url = request.nextUrl.clone();
            url.pathname = "/setup-profile";
            return NextResponse.redirect(url);
        }

        // If ALREADY verified and TRYING to access setup -> Redirect to Community
        if (isVerified && isOnSetup) {
            const url = request.nextUrl.clone();
            url.pathname = "/community";
            return NextResponse.redirect(url);
        }
    }

    return response;
}
