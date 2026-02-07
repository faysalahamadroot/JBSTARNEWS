"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatWindow({ selectedUser }: { selectedUser: any }) {
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
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background">
            <div className="p-4 border-b flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={selectedUser.avatar_url} />
                    <AvatarFallback>{selectedUser.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-semibold">{selectedUser.full_name}</div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[70%] p-3 rounded-lg ${isMe
                                    ? "bg-primary text-primary-foreground self-end rounded-br-none"
                                    : "bg-muted self-start rounded-bl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    );
}
