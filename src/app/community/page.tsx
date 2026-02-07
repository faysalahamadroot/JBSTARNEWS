import { createClient } from "@/lib/supabase/server";
import { UserCard } from "@/components/community/UserCard";

export const metadata = {
    title: "Community Directory | JB Star News",
    description: "Connect with other members of our community.",
};

export default async function CommunityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch profiles
    const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-serif font-bold mb-6 text-center">Community Directory</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles?.map((profile: any) => (
                    <UserCard key={profile.id} profile={profile} currentUserId={user?.id} />
                ))}
                {(!profiles || profiles.length === 0) && (
                    <p className="col-span-full text-center text-muted-foreground">No members found yet.</p>
                )}
            </div>
        </div>
    );
}
