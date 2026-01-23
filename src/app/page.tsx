import Image from "next/image";

import { BreakingTicker } from "@/components/ui/breaking-ticker";
import { FeaturedCard } from "@/components/ui/featured-card";
import { ArticleCard } from "@/components/ui/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch Featured Story (latest post for now, maybe add is_featured later if column exists, for now just latest)
  const { data: featuredData } = await supabase
    .from('posts')
    .select('id, title, subtitle, content, slug, category_id, published_at') // image_url not in requirement, assuming separate bucket logic or need to join? Wait, user requirement STEP E says "image upload". Where is the URL stored? Assuming we will add an image_url column or use storage path. 
    // Wait, user Step E says "supabase.storage.from("images").upload() then insert into posts". It implies we store the path or URL in 'posts'.
    // User B1 Check columns: id, title, subtitle, content, slug, category_id, published_at, created_at. NO image_url column listed in B1.
    // BUT E3 says "Image upload... insert into posts". Implicitly we need an image column? OR maybe content has it?
    // User F1 says "select * from posts".
    // I should probably ADD image_url and video_url columns if they are missing, or else how do we display them?
    // Actually, looking at the previous mocked data, it had imageUrl.
    // I will assume for now I should add `image_url` and `video_url` to the table if I can, OR just assume they might be added or I should add them.
    // User B1 list was explicit. 
    // Let's check if I can assume `image_url` exists or if I should mock it for now / use a placeholder if nulll.
    // Re-reading Step E3: "Image upload... insert into posts". It strongly suggests the URL is saved.
    // I will proceed assuming I will add `image_url` to the table as well, or update B1 task to add it.
    // For now in this file, I will try to select `image_url` and fallback.
    .order('published_at', { ascending: false })
    .limit(1);

  // Fetch Latest News
  const { data: latestData } = await supabase
    .from('posts')
    .select('*') // This will get whatever columns are there
    .order('published_at', { ascending: false })
    .range(1, 6); // Skip the first one since it is featured

    // Fetch Categories for mapping names if needed, or just display raw ID? Ideally we need names.
    // Join is better: select('*, categories(name, slug)')
    // Let's try simple join.
    const { data: featuredWithCategory } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .order('published_at', { ascending: false })
    .limit(1);
    
    const { data: latestWithCategory } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .order('published_at', { ascending: false })
    .range(1, 6);


  const featuredStory = featuredWithCategory && featuredWithCategory.length > 0 ? featuredWithCategory[0] : null;
  // Fallback if no DB data
  const defaultFeatured = {
      title: "Welcome to JB Star News",
      subtitle: "Setup is complete. Add your first post in the Admin panel.",
      image_url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?q=80&w=2560&auto=format",
      category: { name: "System" },
      published_at: new Date().toISOString(),
      slug: "#"
  };

  const displayFeatured = featuredStory || defaultFeatured;
  
  // Helper to get image URL (assuming it might be a partial path in storage)
  const getImageUrl = (path: string | null) => {
      if (!path) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
      if (path.startsWith('http')) return path;
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BreakingTicker />

      {/* Hero Section */}
      <section className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Story */}
          <div className="lg:col-span-8">
            <FeaturedCard
              title={displayFeatured.title}
              excerpt={displayFeatured.subtitle || ""}
              imageUrl={getImageUrl(displayFeatured.image_url)}
              category={displayFeatured.categories?.name || "News"}
              author="JBStar Editor"
              publishedAt={new Date(displayFeatured.published_at).toLocaleDateString()}
              slug={displayFeatured.slug}
            />
          </div>

          {/* Trending / Top Stories Sidebar (Static for now as per requirements focus) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-secondary/30">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 uppercase tracking-wide text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" /> Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex gap-4 group cursor-pointer">
                      <span className="text-3xl font-bold text-muted-foreground/30 font-serif group-hover:text-primary transition-colors">
                        {i}
                      </span>
                      <h4 className="font-semibold text-sm leading-snug group-hover:underline decoration-primary decoration-2 underline-offset-2">
                         Trending Story Placeholder #{i}
                      </h4>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto py-8 border-t">
        <SectionHeader title="Latest Headlines" href="/latest" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestWithCategory?.map((article: any) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              excerpt={article.subtitle || ""}
              imageUrl={getImageUrl(article.image_url)}
              category={article.categories?.name || "News"}
              author="Staff"
              publishedAt={new Date(article.published_at).toLocaleDateString()}
              slug={article.slug}
            />
          ))}
          {!latestWithCategory?.length && (
              <p className="text-muted-foreground col-span-3 text-center py-10">No latest news available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
