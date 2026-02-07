import { createClient } from "@/lib/supabase/server";
import { UserCard } from "@/components/community/UserCard";
import { SearchInput } from "@/components/community/SearchInput";

export const metadata = {
    title: "Community Directory | JB Star News",
    description: "Connect with other members of our community.",
};

export default async function CommunityPage({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const params = await searchParams;
    const query = params?.q || "";

    // Fetch profiles with search
    let dbQuery = supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });

    if (query) {
        dbQuery = dbQuery.ilike("full_name", `%${query}%`);
    }

    const { data: profiles } = await dbQuery;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-serif font-bold mb-6 text-center">Community Directory</h1>

            <SearchInput />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles?.map((profile: any) => (
                    <UserCard key={profile.id} profile={profile} currentUserId={user?.id} />
                ))}
                {(!profiles || profiles.length === 0) && (
                    <p className="col-span-full text-center text-muted-foreground">
                        {query ? `No members found matching "${query}"` : "No members found yet."}
                    </p>
                )}
            </div>
        </div>
    );
}
