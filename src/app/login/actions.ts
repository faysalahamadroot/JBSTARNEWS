"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect("/login?error=Invalid credentials");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `https://faysalwithtach.com/auth/callback`,
        },
    });

    if (error) {
        redirect("/signup?error=" + encodeURIComponent(error.message));
    }

    revalidatePath("/", "layout");
    // Redirect to verify page instead of login
    redirect(`/verify?type=email&target=${encodeURIComponent(email)}`);
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function loginWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `https://faysalwithtach.com/auth/callback?next=/`,
        },
    });

    if (data.url) {
        redirect(data.url);
    }

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }
}

export async function loginWithPhone(prevState: any, formData: FormData) {
    const phone = formData.get("phone") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        phone,
    });

    if (error) {
        return { error: error.message };
    }

    // We don't redirect here because we need to show the OTP input on the same page
    return { success: true, message: "Code sent!" };
}

export async function verifyOtp(prevState: any, formData: FormData) {
    const type = formData.get("type") as "sms" | "email" || "sms";
    const token = formData.get("token") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    const supabase = await createClient();

    let params: any = {
        token,
        type,
    };

    if (type === 'email') {
        params.email = email;
    } else {
        params.phone = phone;
    }

    const { error } = await supabase.auth.verifyOtp(params);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/community");
}

