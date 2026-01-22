import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleCard } from "@/components/ui/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data for specific articles
const ARTICLES_DB: Record<string, any> = {
    "tech-giant-ai": {
        title: "Tech Giant Unveils Revolutionary AI Assistant",
        subtitle: "The new model promises to transform how we interact with digital devices.",
        content: "<p>A major tech company has just released its most advanced AI model yet...</p>",
        category: "Technology",
        author: "Mike Chen",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
        publishedAt: "4 hours ago",
        authorRole: "Tech Editor"
    },
    // Add more specific mocks here if needed
}

// Default Fallback
const DEFAULT_ARTICLE = {
    title: "Global Summit Reaches Historic Agreement on Renewables",
    subtitle: "In a landmark decision, 195 nations have committed to tripling renewable energy capacity by 2030, marking a significant turning point in the fight against climate change.",
    category: "Climate",
    author: "Sarah Jenkins",
    authorRole: "Senior Climate Correspondent",
    publishedAt: "October 24, 2026 • 2:30 PM EST",
    imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?q=80&w=2560&auto=format&fit=crop",
    content: `
    <p><strong>GENEVA</strong> — In what diplomats are calling a "historic turning point" for the planet, representatives from 195 nations unanimously agreed today to triple global renewable energy capacity by the end of the decade.</p>
    
    <p>The agreement, signed after two weeks of intense negotiations, commits signatories to phasing out unbated fossil fuels in a "just, orderly, and equitable" manner. This marks the first time a global climate summit has explicitly targeted the primary driver of climate change.</p>

    <h2>A "Signal to the World"</h2>

    <p>"This is more than a document; it is a signal to the world that the era of fossil fuels is ending," said UN Climate Chief Simon Stiell. "We are not just making promises for 2050. We are taking action for 2030."</p>

    <p>The deal includes financial mechanisms to support developing nations in their transition, a key sticking point in previous talks. A new "Green Future Fund" will be established with an initial capital of $100 billion, funded largely by the G20 nations.</p>

    <figure>
       <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2670&auto=format&fit=crop" alt="Wind turbines" class="rounded-lg my-8 w-full" />
       <figcaption class="text-sm text-center text-muted-foreground mt-2">Wind farms in the North Sea are expected to double in capacity under the new agreement.</figcaption>
    </figure>

    <h2>Challenges Remain</h2>

    <p>Despite the optimism, experts warn that implementation will be difficult. Grid infrastructure in many parts of the world is ill-equipped to handle variable renewable energy sources like wind and solar.</p>
  `
};

const RELATED_ARTICLES = [
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

    // Look up article or use fallback to ensure page always works for demo
    // Look up article or use fallback to ensure page always works for demo
    const article = ARTICLES_DB[slug] || {
        ...DEFAULT_ARTICLE,
        title: slug ? slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : "Article Not Found"
    };


    return (
        <div className="container mx-auto py-8">
            {/* Breadcrumbs */}
            <Breadcrumb items={[
                { label: article.category, href: `/${article.category.toLowerCase()}` },
                { label: article.title, href: `/article/${slug}` }
            ]} />


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Column */}
                <article className="lg:col-span-8">
                    {/* Header */}
                    <header className="mb-8">
                        <Badge className="bg-primary mb-4 hover:bg-primary">{article.category}</Badge>
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
                                    <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold">{article.author}</p>
                                    <p className="text-xs text-muted-foreground">{article.authorRole}</p>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                <p>Published</p>
                                <p>{article.publishedAt}</p>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-10 bg-muted">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

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
                            {RELATED_ARTICLES.map((related, i) => (
                                <ArticleCard key={i} {...related} className="h-auto" />
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
