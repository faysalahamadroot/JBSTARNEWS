import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch post by slug with category
    const { data: post, error } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        console.error("Error fetching post:", error);
        // If not found, try strictly matching encoded slug just in case, but usually unnecessary
        notFound();
    }

    // Helper for image URL
    const getImageUrl = (path: string | null) => {
        if (!path) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop";
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
    };

    return (
        <article className="min-h-screen pb-16">
            {/* Hero Header */}
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto py-12 md:py-16">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {post.categories?.name || "News"}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {/* Calculate read time roughly: 200 words per minute */}
                                {Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200))} min read
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight text-foreground">
                            {post.title}
                        </h1>

                        {post.subtitle && (
                            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                                {post.subtitle}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium text-foreground">JBStar Staff</span>
                                    <span className="text-muted-foreground">Editor</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Bookmark className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Main Image */}
                    {post.image_url && (
                        <div className="relative aspect-[21/9] w-full mb-8 rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={getImageUrl(post.image_url)}
                                fill
                                alt={post.title}
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Video Content */}
                    {post.video_url && (
                        <div className="mb-12 rounded-xl overflow-hidden shadow-lg aspect-video">
                            {post.video_url.includes('youtube.com') || post.video_url.includes('youtu.be') ? (
                                <iframe
                                    src={post.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video controls className="w-full h-full bg-black">
                                    <source src={post.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {/* Simple whitespace handling for now. Ideally use a markdown parser. */}
                        {post.content?.split('\n').map((paragraph: string, i: number) => (
                            paragraph.trim() && <p key={i}>{paragraph}</p>
                        ))}
                    </div>

                    <Separator className="my-12" />
                </div>
            </div>
        </article>
    );
}
