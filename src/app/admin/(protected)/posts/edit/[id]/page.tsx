import EditPostForm from "../edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EditPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch post data
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !post) {
        notFound();
    }

    const { data: categories } = await supabase.from("categories").select("*");

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditPostForm post={post} categories={categories || []} />
                </CardContent>
            </Card>
        </div>
    );
}
