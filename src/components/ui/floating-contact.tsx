"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Mail, Phone } from "lucide-react";

export function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="bg-background border shadow-lg rounded-lg p-4 flex flex-col gap-3 min-w-[200px] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Contact Us via</div>

                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                        <MessageCircle className="text-green-500" size={20} />
                        <span className="text-sm font-medium">WhatsApp</span>
                    </a>

                    <a href="https://m.me/jbstarnews" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                        <Send className="text-blue-500" size={20} /> {/* Using Send icon for Messenger/Telegram generic */}
                        <span className="text-sm font-medium">Messenger</span>
                    </a>

                    <a href="mailto:contact@jbstarnews.com" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                        <Mail className="text-orange-500" size={20} />
                        <span className="text-sm font-medium">Email</span>
                    </a>
                </div>
            )}

            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                onClick={toggleOpen}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </Button>
        </div>
    );
}
