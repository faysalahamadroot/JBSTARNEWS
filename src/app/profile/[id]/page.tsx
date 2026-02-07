import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Edit } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { id } = await params;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (!profile) {
        notFound();
    }

    const isSelf = user?.id === profile.id;

    return (
        <div className="container mx-auto py-8 max-w-2xl px-4">
            <div className="bg-card border rounded-lg shadow-sm p-8 text-center">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                        <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                        <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </div>

                <h1 className="text-3xl font-serif font-bold mb-2">{profile.full_name}</h1>
                <p className="text-muted-foreground mb-4">Member since {new Date(profile.created_at).getFullYear()}</p>

                <div className="mb-6 max-w-md mx-auto bg-muted/30 p-4 rounded-md">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{profile.bio || "No bio yet."}</p>
                </div>

                <div className="flex justify-center gap-4">
                    {isSelf ? (
                        <Button asChild>
                            <Link href="/profile/edit">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Link>
                        </Button>
                    ) : (
                        user ? (
                            <Button asChild>
                                <Link href={`/chat?user=${profile.id}`}>
                                    <MessageCircle className="mr-2 h-4 w-4" /> Message
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="secondary">
                                <Link href="/login">
                                    Log in to Message
                                </Link>
                            </Button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
