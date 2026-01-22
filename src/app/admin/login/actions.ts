"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check for Demo Credentials regardless of DB connection status
    if (email === "admin@example.com" && password === "admin123") {
        const cookieStore = await cookies();
        cookieStore.set("mock_admin_session", "true", { path: "/", httpOnly: true, maxAge: 86400 });
        revalidatePath("/", "layout");
        redirect("/admin");
    }

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
