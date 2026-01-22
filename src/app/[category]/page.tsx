import { SectionHeader } from "@/components/ui/section-header";
import { ArticleCard } from "@/components/ui/article-card";
import { FeaturedCard } from "@/components/ui/featured-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    },
    politics: {
        title: "Politics",
        featured: {
            title: "Senate Vote on Infrastructure Bill Delayed Again",
            excerpt: "Key disagreements over funding sources have pushed the vote to next month.",
            imageUrl: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2670&auto=format&fit=crop",
            category: "Politics",
            author: "Reporter X",
            publishedAt: "30 mins ago",
            slug: "senate-vote-delayed"
        },
        articles: [
            { title: "Public Approval Ratings Hit New Low", excerpt: "Polls show dissatisfaction with current policies.", imageUrl: "https://images.unsplash.com/photo-1529101091760-61df6be24296?q=80&w=800&auto=format&fit=crop", category: "Politics", author: "Data Corp", publishedAt: "2 hours ago", slug: "approval-ratings" },
            { title: "Mayor Announces New City Planning Initiative", excerpt: "Focus on green spaces and public transport.", imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop", category: "Local", author: "City Desk", publishedAt: "4 hours ago", slug: "city-planning" },
        ]
    }
}

const GENERIC_DATA = {
    articles: [
        { title: "Standard Article Title Placeholder", excerpt: "This is a generic article description because we don't have specific mock data for this category yet.", imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "1 day ago", slug: "generic-article-1" },
        { title: "Another Interesting Headline Goes Here", excerpt: "More details about this fascinating story that captivates readers.", imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "2 days ago", slug: "generic-article-2" },
        { title: "Breaking: Something Important Happened", excerpt: "Urgent news that just broke moments ago.", imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "3 days ago", slug: "generic-article-3" },
    ]
}

const GENERIC_NEWS = [
    { title: "Standard Article Title Placeholder", excerpt: "This is a generic article description because we don't have specific mock data for this category yet.", imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "1 day ago", slug: "generic-article-1" },
    { title: "Another Interesting Headline Goes Here", excerpt: "More details about this fascinating story that captivates readers.", imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "2 days ago", slug: "generic-article-2" },
    { title: "Breaking: Something Important Happened", excerpt: "Urgent news that just broke moments ago.", imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop", category: "General", author: "Staff Writer", publishedAt: "3 days ago", slug: "generic-article-3" },
]

interface CategoryPageProps { // Renamed from PageProps
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    const supabase = createClient(); // Removed await as createClient is not async

    // Try to find the category ID first (optional if we just filter by string, but better to filter by verified ID if we had it, strictly speaking we are just filtering by whatever we put in db)
    // For simplicity MVP, let's assume we filter by category string or just fetch all and filter client side? No, server side filter.
    // Actually, our schema has `category_id`. We need to join or just filter if we stored category name?
    // Schema: category_id bigint references public.categories(id).
    // So we need to look up category first.

    const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category)
        .single();

    let dbArticles: any[] | null = null;

    if (categoryData) {
        const { data } = await supabase
            .from('articles')
            .select('*')
            .eq('category_id', categoryData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false });
        dbArticles = data;
    }

    // Fallback to generic mock if not found in DB
    let finalArticles: any[] = [];

    if (dbArticles && dbArticles.length > 0) {
        finalArticles = dbArticles;
    } else {
        const categoryKey = category.toLowerCase();
        // Use type assertion to handle dynamic key access safely
        const mockData = MOCK_DATA_BY_CATEGORY[categoryKey];
        if (mockData) {
            // Combine featured + articles list for uniform handling
            finalArticles = [mockData.featured, ...mockData.articles];
        } else {
            finalArticles = GENERIC_NEWS;
        }
    }

    const featuredArticle = finalArticles[0];
    const remainingArticles = finalArticles.slice(1);

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <span className="font-semibold text-foreground">{capitalizedCategory}</span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold font-serif">{capitalizedCategory} News</h1>
                <div className="hidden md:flex gap-4">
                    {/* Sub-categories could go here */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-9">
                    {/* Featured Category Story */}
                    {featuredArticle && (
                        <FeaturedCard
                            title={featuredArticle.title}
                            excerpt={featuredArticle.excerpt || featuredArticle.subtitle}
                            imageUrl={featuredArticle.image_url || featuredArticle.imageUrl}
                            category={featuredArticle.category || capitalizedCategory}
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
                                imageUrl={article.image_url || article.imageUrl}
                                category={article.category || capitalizedCategory}
                                author={article.author || "Staff Writer"}
                                publishedAt={article.published_at ? new Date(article.published_at).toLocaleDateString() : article.publishedAt}
                                slug={article.slug}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="font-bold mb-2">Subscribe to {capitalizedCategory}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get the latest updates delivered to your inbox.</p>
                        <input type="email" placeholder="Your email" className="w-full p-2 rounded border mb-2 text-sm" />
                        <button className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-bold">Subscribe</button>
                    </div>
                    <div className="bg-muted text-muted-foreground h-[400px] flex items-center justify-center text-xs uppercase tracking-widest rounded-md border border-dashed">
                        Ad Unit
                    </div>
                </div>
            </div>
        </div>
    );
}
