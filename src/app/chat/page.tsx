"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<any>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] rounded-lg border shadow-sm m-4 overflow-hidden">
            {/* Adjust height based on your layout header/footer */}
            <ChatSidebar
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />
            <ChatWindow selectedUser={selectedUser} />
        </div>
    );
}
