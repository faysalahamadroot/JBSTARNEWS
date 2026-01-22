import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    href?: string;
    className?: string;
}

export function SectionHeader({ title, href, className }: SectionHeaderProps) {
    return (
        <div className={`flex items-center justify-between border-b-2 border-primary pb-2 mb-6 ${className}`}>
            <h2 className="text-2xl font-bold font-serif uppercase tracking-tight text-foreground">
                {title}
            </h2>
            {href && (
                <Link
                    href={href}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-wider"
                >
                    See All <ChevronRight className="h-3 w-3" />
                </Link>
            )}
        </div>
    );
}
