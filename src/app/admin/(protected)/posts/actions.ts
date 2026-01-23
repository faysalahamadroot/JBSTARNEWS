"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = {
    success: boolean;
    message?: string;
    errors?: {
        [key: string]: string[];
    };
};

export async function createPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
        return { success: false, message: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    if (!title) {
        return { success: false, message: "Title is required" };
    }

    // Slug generation with uniqueness check
    let slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Check for uniqueness
    let isUnique = false;
    let counter = 0;
    let finalSlug = slug;

    while (!isUnique) {
        const checkSlug = counter === 0 ? slug : `${slug}-${counter}`;

        const { data: existing } = await supabase
            .from("posts") // Changed from articles
            .select("id")
            .eq("slug", checkSlug)
            .single();

        if (!existing) {
            finalSlug = checkSlug;
            isUnique = true;
        } else {
            counter++;
        }
    }

    const post = {
        title,
        slug: finalSlug,
        subtitle: formData.get("subtitle") as string,
        content: formData.get("content") as string,
        category_id: Number(formData.get("category_id")),
        image_url: formData.get("image_url") as string || null,
        video_url: formData.get("video_url") as string || null,
        author_id: userId,
        status: formData.get("status") as string,
        is_breaking: formData.get("is_breaking") === "on",
        // If published_at is provided, use it. Else if status is published, use now. Else null.
        published_at: formData.get("published_at") ? new Date(formData.get("published_at") as string).toISOString() : (formData.get("status") === "published" ? new Date().toISOString() : null),
    };

    try {
        const { error } = await supabase.from("posts").insert(post);

        if (error) {
            console.error("Error creating post:", error);
            return {
                success: false,
                message: error.message || "Failed to create post"
            };
        }
    } catch (e) {
        return { success: false, message: "An unexpected error occurred" };
    }

    revalidatePath("/admin/posts");
    revalidatePath("/");
    redirect("/admin/posts");
}

export async function updatePost(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    if (!id) return { success: false, message: "Missing Post ID" };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string; // Allow slug update? Or keep existing? Usually allow.

    // Ideally check uniqueness if slug changed, but simpler for now to assume user knows or simple collision error from DB unique constraint.

    const updates = {
        title,
        subtitle: formData.get("subtitle") as string,
        content: formData.get("content") as string,
        category_id: Number(formData.get("category_id")),
        image_url: formData.get("image_url") as string || null,
        video_url: formData.get("video_url") as string || null,
        status: formData.get("status") as string,
        is_breaking: formData.get("is_breaking") === "on",
        published_at: formData.get("published_at") ? new Date(formData.get("published_at") as string).toISOString() : (formData.get("status") === 'published' && !formData.get("original_published_at") ? new Date().toISOString() : undefined),
    };

    // Add published_at logic if needed more strictly.

    try {
        const { error } = await supabase.from("posts").update(updates).eq("id", id);
        if (error) throw error;
    } catch (error) {
        console.error("Error updating post:", error);
        return { success: false, message: "Failed to update post" };
    }

    revalidatePath("/admin/posts");
    revalidatePath(`/posts/${slug}`);
    revalidatePath("/");
    redirect("/admin/posts");
}

export async function deletePost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
        console.error("Error deleting post:", error);
        throw error; // Or return state if used in form
    }
    revalidatePath("/admin/posts");
    revalidatePath("/");
}
