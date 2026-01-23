import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleCard } from "@/components/ui/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

// Default Fallback for static parts or related (optional)
const RELATED_ARTICLES_MOCK = [
    { title: "Solar Power Costs Drop 20% in One Year", excerpt: "New manufacturing techniques are driving prices down.", imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop", category: "Energy", author: "Tech Desk", publishedAt: "1 day ago", slug: "solar-costs" },
    { title: "EV Sales Surpass Traditional Autos in Nordic Region", excerpt: "A milestone for the automotive industry.", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop", category: "Business", author: "Auto Weekly", publishedAt: "2 days ago", slug: "ev-sales" },
];

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // 1. Fetch Article
    const { data: article, error } = await supabase
        .from('articles')
        .select(`
            *,
            categories (
                name
            )
        `)
        .eq('slug', slug)
        .single();

    if (error || !article) {
        console.error("Article not found or error:", error);
        notFound();
    }

    // Transform DB data to UI format
    const categoryName = article.categories?.name || "News";
    // Mock author until profiles table is confirmed
    const authorName = "JBStar Editor";
    const authorRole = "Staff Writer";
    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString() + " • " + new Date(article.published_at).toLocaleTimeString()
        : "Draft";

    return (
        <div className="container mx-auto py-8">
            {/* Breadcrumbs */}
            <Breadcrumb items={[
                { label: categoryName, href: `/${categoryName.toLowerCase()}` },
                { label: article.title, href: `/article/${slug}` }
            ]} />


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Column */}
                <article className="lg:col-span-8">
                    {/* Header */}
                    <header className="mb-8">
                        <Badge className="bg-primary mb-4 hover:bg-primary">{categoryName}</Badge>
                        <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-4 text-balance">
                            {article.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                            {article.subtitle}
                        </p>

                        <div className="flex items-center justify-between border-y py-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold">{authorName}</p>
                                    <p className="text-xs text-muted-foreground">{authorRole}</p>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                <p>Published</p>
                                <p>{publishedDate}</p>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {article.image_url && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-10 bg-muted">
                            <Image
                                src={article.image_url}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none font-serif md:prose-xl prose-headings:font-sans prose-headings:font-bold prose-a:text-primary"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Footer / Share */}
                    <div className="my-10 pt-6 border-t">
                        <h4 className="text-sm font-bold uppercase text-muted-foreground mb-4">Share this story</h4>
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full"><Facebook size={18} /></Button>
                            <Button size="icon" variant="outline" className="rounded-full"><Twitter size={18} /></Button>
                            <Button size="icon" variant="outline" className="rounded-full"><Linkedin size={18} /></Button>
                            <Button size="icon" variant="outline" className="rounded-full"><LinkIcon size={18} /></Button>
                            <div className="flex-1"></div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 gap-2">
                                <Flag size={14} /> Report Error
                            </Button>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-10">
                    {/* Ad Unit */}
                    <div className="bg-muted text-muted-foreground h-[300px] flex items-center justify-center text-xs uppercase tracking-widest rounded-md border border-dashed text-center p-4">
                        ADVERTISEMENT
                    </div>

                    {/* Read Next / Related */}
                    <div>
                        <SectionHeader title="Read Next" />
                        <div className="flex flex-col gap-6">
                            {RELATED_ARTICLES_MOCK.map((related, i) => (
                                <ArticleCard key={i} {...related} className="h-auto" />
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
