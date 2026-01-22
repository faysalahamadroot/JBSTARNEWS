"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/admin/login");
    }

    const title = formData.get("title") as string;
    // Simple slug generation
    const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const article = {
        title,
        slug, // in production check for uniqueness
        subtitle: formData.get("subtitle") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        category_id: Number(formData.get("category_id")),
        image_url: formData.get("image_url") as string,
        video_url: formData.get("video_url") as string || null, // Add video support
        author_id: userId,
        status: formData.get("status") as string,
        is_breaking: formData.get("is_breaking") === "on",
        published_at: formData.get("status") === "published" ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("articles").insert(article);

    if (error) {
        console.error("Error creating article:", error);
        // In a real app, return error to form
        throw new Error(error.message);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    redirect("/admin");
}
