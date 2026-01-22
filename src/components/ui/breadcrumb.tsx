import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
    items: { label: string; href: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            {items.map((item, index) => (
                <div key={item.href} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <Link
                        href={item.href}
                        className={`${index === items.length - 1 ? "font-semibold text-foreground pointer-events-none" : "hover:text-primary"}`}
                    >
                        {item.label}
                    </Link>
                </div>
            ))}
        </nav>
    );
}
