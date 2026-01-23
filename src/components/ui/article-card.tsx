import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ArticleCardProps {
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    author: string;
    publishedAt: string;
    slug: string;
    className?: string;
}

export function ArticleCard({
    title,
    excerpt,
    imageUrl,
    category,
    author,
    publishedAt,
    slug,
    className
}: ArticleCardProps) {
    return (
        <Card className={`overflow-hidden flex flex-col h-full border-none shadow-none group ${className}`}>
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground uppercase text-[10px] tracking-widest hover:bg-primary">
                    {category}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-2 space-y-2">
                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {publishedAt}
                    </span>
                </div>
                <Link href={`/posts/${slug}`}>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors font-serif line-clamp-2">
                        {title}
                    </h3>
                </Link>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {excerpt}
                </p>
            </CardContent>
        </Card>
    );
}
