"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Send, MessageCircle } from "lucide-react";

interface SocialShareProps {
    title: string;
    url?: string; // If not provided, uses window.location
}

export function SocialShare({ title, url }: SocialShareProps) {

    const getUrl = () => {
        if (typeof window !== "undefined") {
            return url || window.location.href;
        }
        return "";
    };

    const handleShare = (platform: string) => {
        const shareUrl = getUrl();
        const shareTitle = encodeURIComponent(title);
        const shareLink = encodeURIComponent(shareUrl);

        let targetUrl = "";

        switch (platform) {
            case "facebook":
                targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`;
                break;
            case "twitter":
                targetUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareLink}`;
                break;
            case "linkedin":
                targetUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${shareLink}&title=${shareTitle}`;
                break;
            case "whatsapp":
                targetUrl = `https://wa.me/?text=${shareTitle}%20${shareLink}`;
                break;
            case "telegram":
                targetUrl = `https://t.me/share/url?url=${shareLink}&text=${shareTitle}`;
                break;
            case "copy":
                navigator.clipboard.writeText(shareUrl);
                // Toast notification would be good here
                alert("Link copied to clipboard!");
                return;
            default:
                return;
        }

        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="flex gap-2">
            <Button size="icon" variant="outline" className="rounded-full hover:text-blue-600 hover:bg-blue-50" onClick={() => handleShare("facebook")}>
                <Facebook size={18} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:text-sky-500 hover:bg-sky-50" onClick={() => handleShare("twitter")}>
                <Twitter size={18} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:text-blue-700 hover:bg-blue-50" onClick={() => handleShare("linkedin")}>
                <Linkedin size={18} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:text-green-500 hover:bg-green-50" onClick={() => handleShare("whatsapp")}>
                <MessageCircle size={18} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full hover:text-sky-600 hover:bg-sky-50" onClick={() => handleShare("telegram")}>
                <Send size={18} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full" onClick={() => handleShare("copy")}>
                <LinkIcon size={18} />
            </Button>
        </div>
    );
}
