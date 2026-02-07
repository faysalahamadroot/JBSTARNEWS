"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

    return (
        <div className="flex h-[calc(100vh-64px)] rounded-lg border shadow-sm m-4 overflow-hidden">
            <ChatSidebar
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />
            <ChatWindow selectedUser={selectedUser} />
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
