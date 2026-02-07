"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const data = {
        email,
        password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/admin/login?error=Invalid credentials");
    }

    revalidatePath("/", "layout");
    redirect("/admin");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
}

export async function loginWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // Redirect to admin after callback? 
            // The callback handler at /auth/callback typically redirects to /.
            // We might need to handle redirection logic in the callback based on some state,
            // OR we just let them go to / and they click Admin.
            // BETTER: Set redirectTo to http://faysalwithtach.com/auth/callback?next=/admin
            redirectTo: `https://faysalwithtach.com/auth/callback?next=/admin`,
        },
    });

    if (data.url) {
        redirect(data.url);
    }

    if (error) {
        redirect("/admin/login?error=" + encodeURIComponent(error.message));
    }
}

