"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    // Avatar upload would be handled separately or via client-side storage upload then passing URL
    // For now, we assume avatar_url is already set or optional, or we can use a generated one

    // Validate username uniqueness
    const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

    if (existingUser) {
        return { error: "Username is already taken." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            username: username,
            bio: bio,
            is_verified: true, // Mark as verified upon completion
        })
        .eq("id", user.id);

    if (error) {
        return { error: "Failed to update profile. Please try again." };
    }

    revalidatePath("/", "layout");
    redirect("/community");
}
