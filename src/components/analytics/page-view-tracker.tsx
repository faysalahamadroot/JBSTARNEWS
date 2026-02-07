"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PageViewTracker() {
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        async function trackView() {
            // Simple debounce or check to avoid double counting in strict mode if needed
            // But for simple use case, just insert.

            const { data: { user } } = await supabase.auth.getUser();

            await supabase.from("analytics").insert({
                event_type: "page_view",
                path: pathname,
                user_id: user?.id || null, // Optional chaining for guest
                metadata: {
                    referrer: document.referrer,
                    screen_width: window.screen.width
                }
            });
        }

        trackView();
    }, [pathname]);

    return null; // Component renders nothing
}
