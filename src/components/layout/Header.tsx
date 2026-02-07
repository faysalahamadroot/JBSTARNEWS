"use client";

import Link from "next/link";
import { Search, Menu, X, Facebook, Twitter, Instagram, Youtube, User, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Ensure you have a client-side supabase creator
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CATEGORIES = [
    { name: "World", href: "/category/world" },
    { name: "Politics", href: "/category/politics" },
    { name: "Business", href: "/category/business" },
    { name: "Tech", href: "/category/tech" },
    { name: "Science", href: "/category/science" },
    { name: "Health", href: "/category/health" },
    { name: "Climate", href: "/category/climate" },
    { name: "Opinion", href: "/category/opinion" },
    { name: "Sports", href: "/category/sports" },
    { name: "Video", href: "/category/video" },
];

export function Header() {
    const [date, setDate] = useState("");
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        setDate(new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }));

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

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

                    <Link href="/community" className="hover:text-foreground flex items-center gap-1">
                        <Users size={14} /> Community
                    </Link>

                    {user ? (
                        <>
                            <Link href="/chat" className="hover:text-foreground flex items-center gap-1">
                                <MessageCircle size={14} /> Chat
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <span className="hover:text-foreground cursor-pointer flex items-center gap-1 font-semibold">
                                        <User size={14} /> Account
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`/profile/${user.id}`}>Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile/edit">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-foreground">Log In</Link>
                            <Link href="/signup" className="hover:text-foreground font-semibold">Sign Up</Link>
                        </>
                    )}

                    <Link href="/donate" className="hover:text-foreground font-semibold">Donate</Link>
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
                            <Link href="/community" className="text-lg font-medium hover:text-primary flex items-center gap-2">
                                <Users size={20} /> Community
                            </Link>
                            {!user && (
                                <>
                                    <Link href="/login" className="text-lg font-medium hover:text-primary flex items-center gap-2">
                                        Log In
                                    </Link>
                                    <Link href="/signup" className="text-lg font-medium hover:text-primary flex items-center gap-2">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                            {user && (
                                <>
                                    <Link href="/chat" className="text-lg font-medium hover:text-primary flex items-center gap-2">
                                        <MessageCircle size={20} /> Chat
                                    </Link>
                                    <Link href={`/profile/${user.id}`} className="text-lg font-medium hover:text-primary flex items-center gap-2">
                                        <User size={20} /> Profile
                                    </Link>
                                </>
                            )}
                            <div className="h-[1px] bg-border my-2"></div>
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
                    <h1 className="text-5xl md:text-7xl font-normal tracking-tight font-news pb-2">JB Star News</h1>
                </Link>

                {/* Search */}
                <div className="hidden md:flex items-center gap-2">
                    <form action="/search" className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="q"
                            type="search"
                            placeholder="Search news..."
                            className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-secondary"
                        />
                    </form>
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
