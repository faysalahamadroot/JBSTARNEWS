import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageCircle, User } from "lucide-react";

interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
}

interface UserCardProps {
    profile: Profile;
    currentUserId?: string;
}

export function UserCard({ profile, currentUserId }: UserCardProps) {
    const isSelf = currentUserId === profile.id;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10" />
            </CardHeader>
            <CardContent className="relative pt-0 pb-4 text-center">
                <div className="-mt-12 mb-3 flex justify-center">
                    <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                        <AvatarFallback className="text-2xl">{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </div>
                <h3 className="font-serif text-lg font-bold truncate px-2">
                    {profile.full_name || "Anonymous User"}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">Member</p>
                <p className="text-sm text-muted-foreground line-clamp-2 px-4 h-10 mb-2">
                    {profile.bio || "No bio available."}
                </p>
            </CardContent>
            <CardFooter className="flex gap-2 justify-center pb-6">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/profile/${profile.id}`}>
                        <User className="mr-2 h-4 w-4" /> View Profile
                    </Link>
                </Button>
                {!isSelf && (
                    <Button size="sm" asChild>
                        <Link href={`/chat?user=${profile.id}`}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Message
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
