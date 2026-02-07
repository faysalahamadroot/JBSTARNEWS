"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const fullName = formData.get("fullName") as string;
    const bio = formData.get("bio") as string;

    // Basic validation
    if (!fullName || fullName.length < 2) {
        // In a real app we'd return errors to the form, but for now we'll just redirect
        return;
    }

    const updates = {
        id: user.id,
        full_name: fullName,
        bio: bio,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from("profiles")
        .upsert(updates);

    if (error) {
        console.error("Error updating profile:", error);
        redirect(`/profile/edit?error=Update failed`);
    }

    revalidatePath(`/profile/${user.id}`);
    revalidatePath("/community");
    redirect(`/profile/${user.id}`);
}
