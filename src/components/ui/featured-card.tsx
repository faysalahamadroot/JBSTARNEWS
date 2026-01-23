import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface FeaturedCardProps {
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    author: string;
    publishedAt: string;
    slug: string;
}

export function FeaturedCard({
    title,
    excerpt,
    imageUrl,
    category,
    author,
    publishedAt,
    slug,
}: FeaturedCardProps) {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden group">
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-3xl text-white space-y-4">
                <Badge className="bg-primary text-white hover:bg-primary/90 rounded-sm uppercase tracking-widest">
                    {category}
                </Badge>
                <Link href={`/posts/${slug}`} className="block">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight hover:underline decoration-primary decoration-4 underline-offset-4">
                        {title}
                    </h2>
                </Link>
                <p className="text-lg text-gray-200 line-clamp-2 hidden md:block">
                    {excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-300 pt-2">
                    <span>By <span className="text-white">{author}</span></span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>{publishedAt}</span>
                </div>
            </div>
        </div>
    );
}
