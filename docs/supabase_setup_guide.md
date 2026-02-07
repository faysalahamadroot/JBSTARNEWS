# Supabase Authentication & Provider Setup Guide

I cannot access your Supabase Dashboard directly, but this guide will walk you through exactly what you need to do to fix the "Unsupported provider" error.

## 1. Google Login Setup (Fixes "Access Denied" / "Unsupported provider")

### Step A: Google Cloud Console
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  If you don't have a project, click **"Select a project"** (top left) -> **"New Project"**. Name it "JB Star News" and Create.
3.  In the search bar at the top, type **"Credentials"** and select **"Credentials (APIs & Services)"**.
4.  Click **"+ CREATE CREDENTIALS"** (top) -> **"OAuth client ID"**.
    *   *If asked to configure "OAuth consent screen" first:*
        *   Choose **External**.
        *   Fill in mandatory fields (App name: "JB Star News", Support email: yours).
        *   Save and Continue through steps (no scopes needed for basic login).
        *   Go back to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
5.  **Application Type**: Select **"Web application"**.
6.  **Name**: "Supabase Login".
7.  **Authorized JavaScript origins**:
    *   Add: `https://faysalwithtach.com`
    *   Add: `http://localhost:3000` (for local testing)
8.  **Authorized redirect URIs**:
    *   **You need your Supabase Project URL for this.**
    *   Go to **Supabase Dashboard** -> **Settings (gear icon)** -> **API**.
    *   Copy the **URL** (e.g., `https://abcdefgh.supabase.co`).
    *   Add `/auth/v1/callback` to the end.
    *   **Paste this into Google Cloud**: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`.
9.  Click **Create**.
10. Copy your **Client ID** and **Client Secret**.

### Step B: Supabase Dashboard
1.  Go to your **Supabase Dashboard**.
2.  Click **Authentication** (sidebar) -> **Providers**.
3.  Click **Google**.
4.  **Toggle "Enable Sign in with Google" to ON.**
5.  Paste the **Client ID** and **Client Secret** from the previous step.
6.  Click **Save**.

---

## 2. Phone Login Setup (Fixes Phone Verification)

Phone login usually requires a paid SMS provider like Twilio, but for implementation/testing, you can use the built-in Supabase verification (limited) or **Test Phone Numbers**.

### Step A: Enable Phone Provider
1.  Go to **Authentication** -> **Providers**.
2.  Click **Phone**.
3.  **Toggle "Enable Phone" to ON.**
4.  If you have Twilio credentials, enter them. If not, you can leave the "SMS Provider" as default (Twilio Verify) but usually, you need your own account for production.

### Step B: Add Test Phone Number (Free Testing)
To test without spending money or setting up Twilio:
1.  Stay in the **Phone** provider settings.
2.  Scroll down to **"Phone numbers for testing"** (or similar section).
3.  Click **"Add new number"**.
4.  **Phone Number**: `+11111111112` (or any dummy number).
5.  **OTP Code**: `123456`.
6.  Click **Save**.

Now you can log in with `+11111111112` and enter code `123456` in your app.

---

## 3. Site URL Configuration (Fixes Localhost Redirects)

1.  Go to **Authentication** -> **URL Configuration**.
2.  **Site URL**: Set to `https://faysalwithtach.com`.
3.  **Redirect URLs**:
    *   Add `https://faysalwithtach.com/**`.
    *   Add `http://localhost:3000/**`.
4.  Click **Save**.
