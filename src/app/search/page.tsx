import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ui/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";
    const supabase = await createClient();
    let articles = [];

    if (query) {
        // Option 1: Using textSearch if column is indexed but not using RPC
        // const { data, error } = await supabase
        //     .from("articles")
        //     .select("*, categories(*)")
        //     .textSearch("search_vector", query);

        // Option 2: Using the RPC function we created (Better for complex logic)
        // const { data, error } = await supabase.rpc('search_articles', { keyword: query });

        // Option 3: Standard textSearch on title/content if no special setup (Slower but works immediately without migration if small DB)
        // For this implementation, we assume the user ran the migration script `search_schema.sql`.
        // We will try to filter by search_vector first.

        const { data, error } = await supabase
            .from("articles")
            .select("*, categories(*)")
            .textSearch("search_vector", query);

        if (data) {
            articles = data;
        } else {
            console.error("Search error:", error);
        }
    }

    async function handleSearch(formData: FormData) {
        "use server";
        const searchQuery = formData.get("q") as string;
        if (searchQuery) {
            redirect(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <SectionHeader title={`Search Results for: "${query}"`} />

            <form action={handleSearch} className="flex gap-2 mb-8 max-w-lg">
                <Input name="q" placeholder="Search again..." defaultValue={query} required />
                <Button type="submit">
                    <Search size={18} className="mr-2" />
                    Search
                </Button>
            </form>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article: any) => (
                        <ArticleCard key={article.id} {...article} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    {query ? "No results found." : "Enter a keyword to search."}
                </div>
            )}
        </div>
    );
}
