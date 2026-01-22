"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const BREAKING_NEWS = [
    { id: 1, title: "Global Markets Rally as Inflation Data Beats Expectations", href: "/business/markets-rally" },
    { id: 2, title: "UN Summit Reaches Historic Agreement on Climate Action", href: "/climate/un-agreement" },
    { id: 3, title: "New Tech Giant Merger Announced: What It Means for Consumers", href: "/technology/merger-news" },
    { id: 4, title: "Championship Finals: Underdog Team Takes the Lead", href: "/sports/finals-update" },
];

export function BreakingTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-primary text-primary-foreground text-sm font-medium py-2 overflow-hidden border-b relative">
            <div className="container mx-auto flex items-center gap-4">
                <Badge variant="secondary" className="bg-white text-primary shrink-0 uppercase tracking-wider animate-pulse">
                    Breaking News
                </Badge>

                <div className="flex-1 relative h-6 overflow-hidden">
                    {BREAKING_NEWS.map((news, index) => (
                        <div
                            key={news.id}
                            className={`absolute inset-0 transition-transform duration-500 ease-in-out flex items-center`}
                            style={{ transform: `translateY(${(index - currentIndex) * 100}%)` }}
                        >
                            <Link href={news.href} className="hover:underline truncate w-full block">
                                {news.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
