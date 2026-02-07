"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatSidebar({
    selectedUser,
    onSelectUser,
}: {
    selectedUser: any;
    onSelectUser: (user: any) => void;
}) {
    const [users, setUsers] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function fetchUsers() {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data } = await supabase
                .from("profiles")
                .select("*")
                .neq("id", currentUser.id);

            if (data) setUsers(data);
        }
        fetchUsers();
    }, []);

    return (
        <div className="w-1/4 border-r h-full flex flex-col bg-background">
            <div className="p-4 border-b font-semibold">Chats</div>
            <div className="flex-1 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted ${selectedUser?.id === user.id ? "bg-muted" : ""
                            }`}
                    >
                        <Avatar>
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="font-medium truncate">{user.full_name || user.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
