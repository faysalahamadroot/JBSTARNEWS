import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-foreground text-background py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif font-bold tracking-tighter">JBStarNews</h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Global journalism for the modern era. We provide unbiased, real-time coverage of the events shaping our world.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Facebook className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Twitter className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Instagram className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Youtube className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Sections */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Sections</h3>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/world" className="hover:text-white transition-colors">World</Link></li>
                            <li><Link href="/politics" className="hover:text-white transition-colors">Politics</Link></li>
                            <li><Link href="/business" className="hover:text-white transition-colors">Business</Link></li>
                            <li><Link href="/technology" className="hover:text-white transition-colors">Technology</Link></li>
                            <li><Link href="/science" className="hover:text-white transition-colors">Science</Link></li>
                            <li><Link href="/health" className="hover:text-white transition-colors">Health</Link></li>
                        </ul>
                    </div>

                    {/* Support/Company */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Company</h3>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/corrections" className="hover:text-white transition-colors">Corrections</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Subscribe</h3>
                        <p className="text-sm text-muted mb-4">
                            Get the latest breaking news delivered straight to your inbox.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Input
                                placeholder="Enter your email"
                                className="bg-background/10 border-background/20 text-white placeholder:text-muted/50"
                            />
                            <Button className="w-full">Sign Up</Button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted">
                    <p>© {new Date().getFullYear()} JBStarNews Media Group. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
                        <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
