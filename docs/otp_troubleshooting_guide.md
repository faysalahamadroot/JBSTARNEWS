# Master Guide: Fixing Supabase OTP (Email & Phone) Issues

This guide explains why your users are not receiving verification codes and how to fix it for **Email** and **Phone** authentication in a Next.js + Supabase application.

## 1. Why are OTPs not being delivered?

### Reason A: No SMS Provider (Phone)
**The Problem:** Supabase does NOT send real SMS messages for free globally. It uses a default "Twilio Verify" service with extremely strict limits (rate limits, cost limits).
**The Reality:** If you have not paid for an SMS provider (Twilio, MessageBird, Vonage) and connected it to Supabase, **real SMS messages will almost never arrive.**
**The Fix:** You must use **Test Phone Numbers** for development, or pay for Twilio for production.

### Reason B: Wrong Email Template (Email)
**The Problem:** By default, Supabase sends a "Magic Link" (a clickable button), **not** a 6-digit code.
**The Reality:** If your app asks the user to "Enter Code", but the email only has a "Confirm Email" button, the user is stuck.
**The Fix:** You must manually update the Email Template in Supabase to include the `{{ .Token }}` variable.

---

## 2. How to Fix Email Verification (SMTP & Templates)

### Step 1: Configure the Email Template (CRITICAL)
1.  Go to **Supabase Dashboard** -> **Authentication** -> **Email Templates**.
2.  Select **"Confirm Signup"**.
3.  Replace the **Message Body** with this (HTML):
    ```html
    <h2>Confirm your signup</h2>
    <p>Your verification code is:</p>
    <p style="font-size: 24px; font-weight: bold; background: #eee; padding: 10px;">{{ .Token }}</p>
    <p>Or click here: <a href="{{ .ConfirmationURL }}">Confirm Link</a></p>
    ```
4.  **Save**.
5.  Now, when a user signs up, the email will actually contain the code.

### Step 2: Custom SMTP (Recommended for Production)
The default Supabase email service allows ~3 emails per hour. For a real app, you need a proper email provider.
1.  Sign up for **Resend** (recommended for Next.js), SendGrid, or AWS SES.
2.  Get your **SMTP Credentials** (Host, Port, User, Password).
3.  Go to **Supabase Dashboard** -> **Settings (Gear)** -> **SMTP Settings**.
4.  Toggle **Enable Custom SMTP**.
5.  Enter your credentials.

---

## 3. How to Fix Phone Verification (SMS)

### option A: Development / Testing (Free & Reliable)
Do not try to send real SMS while developing. It's flaky and costs money.
1.  Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Phone**.
2.  Scroll to **"Phone numbers for testing"**.
3.  Add a number: `+15551234567`.
4.  Add a code: `123456`.
5.  **Save**.
6.  **Test:** Login with `+15551234567`. The code is ALWAYS `123456`. It works instantly.

### Option B: Production (Paid)
1.  Create a **Twilio** account.
2.  Buy a phone number ($1/month) and add funds for SMS ($0.0079/msg).
3.  Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Phone**.
4.  Select **Twilio** as the provider.
5.  Enter your **Account SID**, **Auth Token**, and **Message Service SID** (or "From" number).
6.  **Save**.

---

## 4. Vercel Environment Variables & Security

### The "Redirect" Trap
If your `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing in Vercel, the app won't connect to Supabase.
1.  Go to **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2.  Ensure you have added:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### URL Configuration (Supabase)
If Supabase doesn't know your Vercel URL, it might block redirects or send broken links.
1.  Go to **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2.  **Site URL:** `https://your-project.vercel.app` (or your custom domain).
3.  **Redirect URLs:**
    *   `https://your-project.vercel.app/**`
    *   `http://localhost:3000/**`

---

## 5. Step-by-Step Debugging Checklist

If OTP is still not working:

1.  **Check Logs:** Look at Supabase Dashboard -> **Authentication** -> **Logs**.
    *   Does it say "Email sent"? If yes, check Spam folder.
    *   Does it say "Error sending"? Check SMTP settings.
2.  **Check Limits:** Supabase allows only 3 emails/hour on the free default plan. Use a custom SMTP (Resend/SendGrid) to fix this.
3.  **Check OTP Type:**
    *   Are you calling `supabase.auth.verifyOtp({ type: 'signup', ... })` or `type: 'email'`?
    *   For new users, it's usually `email` (if using magical link flow) or `signup` (if strictly verifying signup). Our code handles this, but ensure the frontend is sending the right type.

---

## 6. Summary: The "Golden Path" for Success

### Recommended: Start with "Magic Link" (Option A)
As you noted, Facebook and Twitter started simple. This is the **most robust** way to launch without paying for external providers.
1.  **Email:** Use the default Supabase Email Confirmation (Link).
2.  **Config:** Ensure "Enable email confirmations" is ON in Supabase.
3.  **Template:** Update the Email Template to include the link (`{{ .ConfirmationURL }}`).
4.  **Code:** Redirect users to a "Check your email" page after signup (We have implemented this at `/signup/confirmation`).

### If you MUST use OTP (Option B)
1.  **Phone:** Use **Test Numbers** (`+1555...`) for development. Do not expect real SMS without Twilio.
2.  **Email:** Update the **Email Template** to include `{{ .Token }}`.
3.  **Config:** Set **Site URL** in Supabase to your Vercel domain.
4.  **Provider:** Enable **Google** provider if you want social login.

Follow the "Magic Link" path for a smooth launch, and add Phone OTP later when you have budget for Twilio.
