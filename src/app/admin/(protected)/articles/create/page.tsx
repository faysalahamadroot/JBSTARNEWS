import CreateArticleForm from "./create-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function CreateArticlePage() {
    // In a real scenario, we would fetch categories here to pass down
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select("*");

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Article</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateArticleForm categories={categories} />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    {/* The form submission is handled by the submit button INSIDE the form if we moved it, 
                        OR we need to use the form ID to submit from here. 
                        The Client component `CreateArticleForm` has the form but NO submit button inside it in my previous file creation?
                        Wait, I removed the footer from the form component but kept the form tag.
                        The button here needs 'form' attribute.
                    */}
                    <Button form="create-article-form" type="submit">Save Article</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
