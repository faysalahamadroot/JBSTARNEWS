"use client";

import Link from "next/link";
import { Search, Menu, X, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const CATEGORIES = [
    { name: "World", href: "/world" },
    { name: "Politics", href: "/politics" },
    { name: "Business", href: "/business" },
    { name: "Tech", href: "/technology" },
    { name: "Science", href: "/science" },
    { name: "Health", href: "/health" },
    { name: "Climate", href: "/climate" },
    { name: "Opinion", href: "/opinion" },
    { name: "Sports", href: "/sports" },
    { name: "Video", href: "/video" },
];

export function Header() {
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }));
    }, []);

    return (
        <header className="border-b bg-background w-full">
            {/* Top Bar */}
            <div className="hidden md:flex justify-between items-center container mx-auto py-2 text-xs text-muted-foreground border-b border-border/50">
                <div className="flex gap-4">
                    <span>{date}</span>
                    <span>Stocks: AAPL +0.5%</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                        <Facebook size={14} className="hover:text-foreground cursor-pointer" />
                        <Twitter size={14} className="hover:text-foreground cursor-pointer" />
                        <Instagram size={14} className="hover:text-foreground cursor-pointer" />
                        <Youtube size={14} className="hover:text-foreground cursor-pointer" />
                    </div>
                    <div className="h-4 w-[1px] bg-border"></div>
                    <Link href="/login" className="hover:text-foreground">Log In</Link>
                    <Link href="/subscribe" className="hover:text-foreground font-semibold">Subscribe</Link>
                </div>
            </div>

            {/* Main Header area */}
            <div className="container mx-auto py-4 flex items-center justify-between">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <div className="flex flex-col gap-4 mt-8">
                            {CATEGORIES.map((cat) => (
                                <Link key={cat.name} href={cat.href} className="text-lg font-medium hover:text-primary">
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase font-serif">JBStarNews</h1>
                </Link>

                {/* Search */}
                <div className="hidden md:flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search news..."
                            className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-secondary"
                        />
                    </div>
                    <Button>Subscribe</Button>
                </div>

                {/* Mobile Search Icon */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Search size={24} />
                </Button>
            </div>

            {/* Navigation Bar (Desktop) */}
            <nav className="hidden md:block border-t border-border">
                <div className="container mx-auto">
                    <ul className="flex justify-center flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <li key={cat.name}>
                                <Link href={cat.href} className="block py-3 px-4 text-sm font-bold uppercase hover:bg-secondary hover:text-primary transition-colors">
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
