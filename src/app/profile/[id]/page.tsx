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
        <div className="container mx-auto py-8 max-w-4xl px-4">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                {/* Cover Photo Placeholder */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-muted">{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>

                        <div className="mb-2">
                            {isSelf ? (
                                <Button asChild size="lg" className="rounded-full shadow-sm">
                                    <Link href="/profile/edit">
                                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                    </Link>
                                </Button>
                            ) : (
                                user ? (
                                    <Button asChild size="lg" className="rounded-full shadow-sm">
                                        <Link href={`/chat?user=${profile.id}`}>
                                            <MessageCircle className="mr-2 h-4 w-4" /> Message
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild variant="secondary" className="rounded-full">
                                        <Link href="/login">
                                            Log in to Message
                                        </Link>
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                            </p>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">About</h3>
                            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                                {profile.bio || <span className="text-muted-foreground italic">No bio added yet.</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
