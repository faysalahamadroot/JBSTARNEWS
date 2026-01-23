import CreatePostForm from "./create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function CreatePostPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select("*");

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreatePostForm categories={categories || []} />
                </CardContent>
            </Card>
        </div>
    );
}
