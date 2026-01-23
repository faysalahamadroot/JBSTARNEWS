import Image from "next/image";

import { BreakingTicker } from "@/components/ui/breaking-ticker";
import { FeaturedCard } from "@/components/ui/featured-card";
import { ArticleCard } from "@/components/ui/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock Data
const FEATURED_STORY = {
  title: "Global Summit Reaches Historic Agreement on Renewables",
  excerpt: "In a landmark decision, 195 nations have committed to tripling renewable energy capacity by 2030, marking a significant turning point in the fight against climate change.",
  imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?q=80&w=2560&auto=format&fit=crop",
  category: "Climate",
  author: "Sarah Jenkins",
  publishedAt: "2 hours ago",
  slug: "global-summit-agreement"
};

const LATEST_NEWS = [
  {
    title: "Tech Giant Unveils Revolutionary AI Assistant",
    excerpt: "The new model promises to transform how we interact with digital devices.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    category: "Technology",
    author: "Mike Chen",
    publishedAt: "4 hours ago",
    slug: "ai-assistant-launch"
  },
  {
    title: "Markets Rally as Inflation Eases",
    excerpt: "Stock markets worldwide see significant gains following positive economic indicators.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    category: "Business",
    author: "Alex Turner",
    publishedAt: "6 hours ago",
    slug: "markets-rally"
  },
  {
    title: "New Study Reveals Benefits of Mediterranean Diet",
    excerpt: "Research shows significant health improvements in participants following the diet.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    category: "Health",
    author: "Dr. Emma Wilson",
    publishedAt: "8 hours ago",
    slug: "mediterranean-diet-study"
  },
  {
    title: "Opinion: Why Remote Work is Here to Stay",
    excerpt: "The pandemic changed how we work, and there's no going back.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    category: "Opinion",
    author: "James Rodriguez",
    publishedAt: "10 hours ago",
    slug: "remote-work-opinion"
  },
  {
    title: "Space Agency Announces Mars Mission Timeline",
    excerpt: "Crewed missions to the Red Planet could begin as early as 2028.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    category: "Science",
    author: "Dr. Lisa Park",
    publishedAt: "12 hours ago",
    slug: "mars-mission-timeline"
  },
  {
    title: "Breakthrough in Renewable Energy Storage",
    excerpt: "New battery technology could solve one of clean energy's biggest challenges.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
    category: "Technology",
    author: "Robert Kim",
    publishedAt: "14 hours ago",
    slug: "energy-storage-breakthrough"
  }
];

const TRENDING_STORIES = [
  { rank: 1, title: "Breaking: Major Policy Shift Announced by Government" },
  { rank: 2, title: "Celebrity Couple Announces Surprise Engagement" },
  { rank: 3, title: "Tech Startup Raises Record $500M in Funding" },
  { rank: 4, title: "Scientists Discover New Species in Amazon Rainforest" },
  { rank: 5, title: "Championship Game Ends in Dramatic Overtime Victory" }
];

import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch Featured Story (Breaking or just latest featured)
  const { data: featuredData } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('is_breaking', true)
    .limit(1);

  // Fetch Latest News
  const { data: latestData } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  // Use real data or fallback to mocks
  const featuredStory = (featuredData && featuredData.length > 0 ? featuredData[0] : null) || FEATURED_STORY;
  const latestNews = latestData && latestData.length > 0 ? latestData : LATEST_NEWS;


  return (
    <div className="flex flex-col min-h-screen">
      <BreakingTicker />

      {/* Hero Section */}
      <section className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Story */}
          <div className="lg:col-span-8">
            {/* Map DB fields to Component Props */}
            <FeaturedCard
              title={featuredStory.title || "Untitled Article"}
              excerpt={featuredStory.excerpt || featuredStory.subtitle || "No description available."}
              imageUrl={featuredStory.image_url || featuredStory.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2560&auto=format&fit=crop"}
              category={featuredStory.category || "Featured"}
              author={featuredStory.author?.email || "JBStar Editor"}
              publishedAt={new Date(featuredStory.published_at || Date.now()).toLocaleDateString()}
              slug={featuredStory.slug || "#"}
            />
          </div>

          {/* Trending / Top Stories Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-secondary/30">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 uppercase tracking-wide text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" /> Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-4">
                  {TRENDING_STORIES.map((story) => (
                    <li key={story.rank} className="flex gap-4 group cursor-pointer">
                      <span className="text-3xl font-bold text-muted-foreground/30 font-serif group-hover:text-primary transition-colors">
                        {story.rank}
                      </span>
                      <h4 className="font-semibold text-sm leading-snug group-hover:underline decoration-primary decoration-2 underline-offset-2">
                        {story.title}
                      </h4>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Ad Placeholder */}
            <div className="bg-muted text-muted-foreground h-[200px] flex items-center justify-center text-xs uppercase tracking-widest rounded-md border border-dashed">
              Advertisement
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto py-8 border-t">
        <SectionHeader title="Latest Headlines" href="/latest" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* @ts-ignore - Supabase types vs Mock types mismatch handling */}
          {latestNews.map((article: any) => (
            <ArticleCard
              key={article.slug || Math.random().toString()}
              title={article.title || "Untitled"}
              excerpt={article.excerpt || article.subtitle || ""}
              imageUrl={article.image_url || article.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop"}
              category={article.category || "News"}
              author="JBStar Staff"
              publishedAt={article.published_at ? new Date(article.published_at).toLocaleDateString() : (article.publishedAt || "Recently")}
              slug={article.slug || "#"}
            />
          ))}
        </div>
      </section>

      {/* Business & Tech Strip */}
      <section className="bg-secondary/30 py-12 border-y">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Business Column */}
            <div>
              <SectionHeader title="Business & Markets" href="/business" />
              <div className="space-y-6">
                <ArticleCard
                  title="Crypto Markets Face New Regulaton Challenges in EU"
                  excerpt="European lawmakers are proposing strict new guidelines for digital asset exchanges."
                  imageUrl="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop"
                  category="Business"
                  author="Sarah Lee"
                  publishedAt="1 day ago"
                  slug="crypto-regulation"
                  className="flex-row h-auto mb-4"
                />
                <ArticleCard
                  title="Startup Unicorns: Who to Watch in 2026"
                  excerpt="A deep dive into the most promising startups disrupting fintech and healthcare."
                  imageUrl="https://images.unsplash.com/photo-1559136555-930d72f1d30c?q=80&w=800&auto=format&fit=crop"
                  category="Startups"
                  author="Mark Cuban"
                  publishedAt="2 days ago"
                  slug="startup-watch"
                  className="flex-row h-auto"
                />
              </div>
            </div>

            {/* Tech Column */}
            <div>
              <SectionHeader title="Technology & Innovation" href="/technology" />
              <div className="space-y-6">
                <div className="relative h-[200px] w-full rounded-lg overflow-hidden mb-4 group cursor-pointer">
                  <Image src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 50vw" alt="Tech" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <Badge className="mb-2 bg-blue-600">Review</Badge>
                    <h3 className="text-white font-bold text-lg leading-tight">The Best Laptops for Developers in 2026</h3>
                  </div>
                </div>
                <ul className="space-y-4 divide-y">
                  <li className="pt-2 hover:text-primary cursor-pointer transition-colors">
                    <h4 className="font-semibold">AI Safety: New Protocols Established by Global Board</h4>
                  </li>
                  <li className="pt-4 hover:text-primary cursor-pointer transition-colors">
                    <h4 className="font-semibold">Quantum Computing: One Step Closer to Reality</h4>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="container mx-auto py-12">
        <SectionHeader title="Must Watch" href="/video" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-2">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <PlayCircle className="text-white w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
                </div>
                <Image
                  src={`https://images.unsplash.com/photo-1492619882641-e974e2d0913e?q=80&w=800&auto=format&fit=crop&sig=${i}`}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h4 className="font-bold text-sm leading-tight group-hover:text-primary">
                Documentary: The Future of Urban Living in Megacities
              </h4>
              <span className="text-xs text-muted-foreground">10:42 • 5k views</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
