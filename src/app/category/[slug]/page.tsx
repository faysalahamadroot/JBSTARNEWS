import { SectionHeader } from "@/components/ui/section-header";
import { ArticleCard } from "@/components/ui/article-card";
import { FeaturedCard } from "@/components/ui/featured-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";


interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;


    const supabase = await createClient();

    // 1. Find category ID by slug (or name if slug is name)
    const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name')
        .or(`slug.eq.${slug},name.ilike.${slug}`)
        .single();

    // 404 if category not found (Requirement: separate page implies valid entity, though user said "If a category has no posts... load normally". Implies concept validity.)
    if (!categoryData) {
        notFound();
    }

    const { data: dbArticles } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

    // No fallback to mock data
    const finalArticles = dbArticles || [];

    const featuredArticle = finalArticles[0];
    const remainingArticles = finalArticles.slice(1);

    // Helper for image URL
    const getImageUrl = (path: string | null) => {
        if (!path) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
        if (path.startsWith('http')) return path;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://decrgcsuftznxbvgpqgp.supabase.co";
        return `${supabaseUrl}/storage/v1/object/public/images/${path}`;
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <span className="font-semibold text-foreground">{categoryData.name}</span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold font-serif">{categoryData.name} News</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-9">
                    {finalArticles.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed rounded-lg bg-muted/30">
                            <h3 className="text-xl font-medium text-muted-foreground">No stories found in this category yet.</h3>
                            <p className="text-sm text-muted-foreground mt-2">Check back later for updates.</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured Category Story */}
                            {featuredArticle && (
                                <FeaturedCard
                                    title={featuredArticle.title}
                                    excerpt={featuredArticle.excerpt || featuredArticle.subtitle || ""}
                                    imageUrl={getImageUrl(featuredArticle.image_url)}
                                    category={categoryData.name}
                                    author={"Staff Writer"}
                                    publishedAt={new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString()}
                                    slug={featuredArticle.slug}
                                />
                            )}

                            <div className="my-12"></div>

                            {/* Article Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {remainingArticles.map((article: any) => (
                                    <ArticleCard
                                        key={article.id}
                                        title={article.title}
                                        excerpt={article.excerpt || article.subtitle || ""}
                                        imageUrl={getImageUrl(article.image_url)}
                                        category={categoryData.name}
                                        author={"Staff Writer"}
                                        publishedAt={new Date(article.published_at || article.created_at).toLocaleDateString()}
                                        slug={article.slug}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="font-bold mb-2">Subscribe to {categoryData.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get the latest updates delivered to your inbox.</p>
                        <input type="email" placeholder="Your email" className="w-full p-2 rounded border mb-2 text-sm" />
                        <button className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-bold">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
