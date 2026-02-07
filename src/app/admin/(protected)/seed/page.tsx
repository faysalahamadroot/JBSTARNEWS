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
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setStatus("error");
            setMsg("You must be logged in to seed data.");
            return;
        }

        const categories = [
            { name: 'Justin Bieber', slug: 'justin-bieber' },
            { name: 'Business', slug: 'business' },
            { name: 'Politics', slug: 'politics' },
            { name: 'Technology', slug: 'tech' },
            { name: 'Science', slug: 'science' },
        ];

        try {
            // 1. Create Categories
            const { data: createdCategories, error: catError } = await supabase
                .from('categories')
                .upsert(categories, { onConflict: 'slug' })
                .select();

            if (catError) throw catError;

            // 2. Create Posts
            const posts = [];

            for (const category of createdCategories) {
                for (let i = 1; i <= 10; i++) {
                    const title = `${category.name} Update #${i}: The Latest News`;
                    const slug = `${category.slug}-update-${i}-${Date.now()}`;

                    posts.push({
                        title: title,
                        slug: slug,
                        content: `This is the content for post #${i} in the ${category.name} category. It contains interesting information about ${category.name}. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
                        published: true,
                        published_at: new Date().toISOString(),
                        category_id: category.id,
                        author_id: user.id,
                        image_url: null
                    });
                }
            }

            const { error: postError } = await supabase
                .from('posts')
                .upsert(posts, { onConflict: 'slug' });

            if (postError) throw postError;

            setStatus("success");
            setMsg(`Successfully created ${createdCategories.length} categories and ${posts.length} posts!`);
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            setMsg(e.message || "Failed to create data");
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 space-y-6">
            <h1 className="text-2xl font-bold">Seed Content</h1>
            <p className="text-muted-foreground">
                Click the button below to generate 50 posts across 5 categories:
                Justin Bieber, Business, Politics, Tech, and Science.
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
                {status === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...</> : "Generate 50 Posts"}
            </Button>
        </div>
    );
}
