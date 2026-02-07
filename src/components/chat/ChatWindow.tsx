"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, SendHorizontal, ArrowLeft } from "lucide-react";

export default function ChatWindow({ selectedUser, onBack }: { selectedUser: any, onBack: () => void }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const supabase = createClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    }, []);

    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("*")
                .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
                .order("created_at", { ascending: true });

            if (data) setMessages(data);
        };

        fetchMessages();

        const channel = supabase
            .channel("chat")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `receiver_id=eq.${currentUser.id}`,
                },
                (payload) => {
                    if (payload.new.sender_id === selectedUser.id) {
                        setMessages((prev) => [...prev, payload.new]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedUser, currentUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const msg = {
            content: newMessage,
            sender_id: currentUser.id,
            receiver_id: selectedUser.id,
        };

        // Optimistic UI
        const tempMsg = { ...msg, id: Date.now(), created_at: new Date().toISOString() };
        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage("");

        const { error } = await supabase.from("messages").insert(msg);
        if (error) console.error("Error sending message:", error);
    };

    if (!selectedUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-muted/20">
                <div className="bg-background p-6 rounded-full shadow-sm mb-4">
                    <MessageCircle size={48} className="text-primary/40" />
                </div>
                <h3 className="font-semibold text-lg">Your Messages</h3>
                <p>Select a conversation to start chatting.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background absolute inset-0 md:static z-20">
            <div className="p-3 border-b flex items-center gap-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft size={20} />
                </Button>
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={selectedUser.avatar_url} />
                    <AvatarFallback>{selectedUser.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold text-sm">{selectedUser.full_name}</div>
                    <div className="text-xs text-muted-foreground">Active now</div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 bg-muted/10">
                <div className="flex flex-col gap-2 min-h-full justify-end">
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe
                                    ? "bg-primary text-primary-foreground self-end rounded-br-sm"
                                    : "bg-muted self-start rounded-bl-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-3 border-t bg-background flex gap-2 items-center">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                />
                <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={!newMessage.trim()}>
                    <SendHorizontal size={18} />
                </Button>
            </form>
        </div>
    );
}
