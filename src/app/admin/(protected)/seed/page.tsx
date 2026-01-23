"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [msg, setMsg] = useState("");

    const handleSeed = async () => {
        setStatus("loading");
        const supabase = createClient();

        const categories = [
            { name: 'Science', slug: 'science' },
            { name: 'Health', slug: 'health' },
            { name: 'Climate', slug: 'climate' },
            { name: 'Opinion', slug: 'opinion' },
            { name: 'Sports', slug: 'sports' },
            { name: 'Video', slug: 'video' }
        ];

        try {
            const { data, error } = await supabase
                .from('categories')
                .upsert(categories, { onConflict: 'slug' })
                .select();

            if (error) throw error;

            setStatus("success");
            setMsg("Categories created successfully! You can now visit /category/science etc.");
        } catch (e: any) {
            setStatus("error");
            setMsg(e.message || "Failed to create categories");
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 space-y-6">
            <h1 className="text-2xl font-bold">Fix Missing Category Pages</h1>
            <p className="text-muted-foreground">
                Click the button below to create the missing "Science", "Health", "Opinion", etc. categories in your database.
                This will fix the 404 errors.
            </p>

            {status === "success" && (
                <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{msg}</AlertDescription>
                </Alert>
            )}

            {status === "error" && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{msg}</AlertDescription>
                </Alert>
            )}

            <Button size="lg" onClick={handleSeed} disabled={status === "loading" || status === "success"}>
                {status === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Missing Categories"}
            </Button>
        </div>
    );
}
