"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Hello! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "That's interesting! Tell me more.",
                "I can help you find articles about that.",
                "Please contact support for specific account issues.",
                "You can search for that using our search bar above.",
                "I'm just a demo bot right now, but I'm learning!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const botMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: randomResponse };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
            {isOpen && (
                <div className="bg-background border shadow-2xl rounded-lg w-[300px] md:w-[350px] h-[450px] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
                    <div className="p-3 border-b bg-primary text-primary-foreground flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <span className="font-semibold">AI Support</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary/80" onClick={toggleOpen}>
                            <X size={16} />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className={msg.role === 'user' ? 'bg-slate-200' : 'bg-primary text-primary-foreground'}>
                                            {msg.role === 'user' ? 'U' : <Bot size={14} />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`rounded-lg p-2 text-sm max-w-[80%] ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={14} /></AvatarFallback></Avatar>
                                    <div className="bg-muted rounded-lg p-2 text-sm text-muted-foreground animate-pulse">
                                        Typing...
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send size={16} />
                        </Button>
                    </form>
                </div>
            )}

            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-xl bg-violet-600 hover:bg-violet-700 transition-transform hover:scale-105"
                onClick={toggleOpen}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </Button>
        </div>
    );
}
