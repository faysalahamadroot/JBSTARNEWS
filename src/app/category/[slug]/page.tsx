import { SectionHeader } from "@/components/ui/section-header";
import { ArticleCard } from "@/components/ui/article-card";
import { FeaturedCard } from "@/components/ui/featured-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Mock Data map
const MOCK_DATA_BY_CATEGORY: Record<string, any> = {
    world: {
        title: "World",
        featured: {
            title: "Peace Talks Stall as Tensions Rise in Eastern Europe",
            excerpt: "Diplomats are scrambling to find a resolution before the deadline expires next week.",
            imageUrl: "https://images.unsplash.com/photo-1526304640151-b57d6486e815?q=80&w=2540&auto=format&fit=crop",
            category: "World",
            author: "James Bond",
            publishedAt: "1 hour ago",
            slug: "peace-talks-stall"
        },
        articles: [
            { title: "Election Results Shock Analysts in South America", excerpt: "A surprising turnout has flipped the polls.", imageUrl: "https://images.unsplash.com/photo-1540910419868-474947ce5cae?q=80&w=800&auto=format&fit=crop", category: "World", author: "Maria S.", publishedAt: "3 hours ago", slug: "election-shock" },
            { title: "New Trade Deal Signed Across Pacific", excerpt: "Economic ties strengthen between Asia and Americas.", imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop", category: "Economy", author: "Lee K.", publishedAt: "5 hours ago", slug: "trade-deal" },
            { title: "Humanitarian Aid Reaches Remote Villages", excerpt: "UN convoys finally break through bio-hazards.", imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop", category: "Human Rights", author: "Sarah P.", publishedAt: "1 day ago", slug: "aid-reaches" },
        ]
    }
}

const GENERIC_NEWS = [
    { title: "Standard Article Title Placeholder", excerpt: "This is a generic article description because we don't have specific mock data for this category yet.", imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "1 day ago", slug: "generic-article-1" },
    { title: "Another Interesting Headline Goes Here", excerpt: "More details about this fascinating story that captivates readers.", imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "2 days ago", slug: "generic-article-2" },
    { title: "Breaking: Something Important Happened", excerpt: "Urgent news that just broke moments ago.", imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "3 days ago", slug: "generic-article-3" },
]

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    // Convert to title case for display if name missing
    const capitalizedCategory = slug.charAt(0).toUpperCase() + slug.slice(1);

    const supabase = await createClient();

    // 1. Find category ID by slug (or name if slug is name)
    const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name')
        .or(`slug.eq.${slug},name.ilike.${slug}`)
        .single();

    let dbArticles: any[] | null = null;

    if (categoryData) {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('category_id', categoryData.id)
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });
        dbArticles = data;
    }

    // Fallback to generic mock if not found in DB
    let finalArticles: any[] = [];

    if (dbArticles && dbArticles.length > 0) {
        finalArticles = dbArticles;
    } else {
        const categoryKey = slug.toLowerCase();
        const mockData = MOCK_DATA_BY_CATEGORY[categoryKey];
        if (mockData) {
            finalArticles = [mockData.featured, ...mockData.articles];
        } else {
            finalArticles = GENERIC_NEWS;
        }
    }

    const featuredArticle = finalArticles[0];
    const remainingArticles = finalArticles.slice(1);

    // Helper for image URL
    const getImageUrl = (path: string | null) => {
        if (!path) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <span className="font-semibold text-foreground">{categoryData?.name || capitalizedCategory}</span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold font-serif">{categoryData?.name || capitalizedCategory} News</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-9">
                    {/* Featured Category Story */}
                    {featuredArticle && (
                        <FeaturedCard
                            title={featuredArticle.title}
                            excerpt={featuredArticle.excerpt || featuredArticle.subtitle}
                            imageUrl={getImageUrl(featuredArticle.image_url || featuredArticle.imageUrl)}
                            category={categoryData?.name || featuredArticle.category || capitalizedCategory}
                            author={featuredArticle.author || "Staff Writer"}
                            publishedAt={featuredArticle.published_at ? new Date(featuredArticle.published_at).toLocaleDateString() : featuredArticle.publishedAt}
                            slug={featuredArticle.slug}
                        />
                    )}

                    <div className="my-12"></div>

                    {/* Article Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {remainingArticles.map((article: any, i: number) => (
                            <ArticleCard
                                key={i}
                                title={article.title}
                                excerpt={article.excerpt || article.subtitle}
                                imageUrl={getImageUrl(article.image_url || article.imageUrl)}
                                category={categoryData?.name || article.category || capitalizedCategory}
                                author={article.author || "Staff Writer"}
                                publishedAt={article.published_at ? new Date(article.published_at).toLocaleDateString() : article.publishedAt}
                                slug={article.slug}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="font-bold mb-2">Subscribe to {categoryData?.name || capitalizedCategory}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get the latest updates delivered to your inbox.</p>
                        <input type="email" placeholder="Your email" className="w-full p-2 rounded border mb-2 text-sm" />
                        <button className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-bold">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
