"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

function ChatContent() {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get("user");
    const supabase = createClient();

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();

                if (data) {
                    setSelectedUser(data);
                }
            };
            fetchUser();
        }
    }, [userId]);

    const router = useRouter();

    const handleBack = () => {
        setSelectedUser(null);
        router.push("/chat");
    };

    return (
        <div className="flex h-[calc(100vh-64px)] rounded-lg border shadow-sm m-4 overflow-hidden bg-background">
            <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-1/4 border-r`}>
                <ChatSidebar
                    selectedUser={selectedUser}
                    onSelectUser={(user) => {
                        setSelectedUser(user);
                        // Optional: update URL
                    }}
                />
            </div>
            <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1`}>
                <ChatWindow selectedUser={selectedUser} onBack={handleBack} />
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <ChatContent />
        </Suspense>
    );
}
