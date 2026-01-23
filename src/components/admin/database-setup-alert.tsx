"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy, Terminal } from "lucide-react";
import { useState } from "react";

const SETUP_SQL = `-- 1. Add ALL missing columns
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS category_id BIGINT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_breaking BOOLEAN DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- 2. Ensure Categories Exist
INSERT INTO public.categories (id, name, slug)
VALUES (1, 'World', 'world'), (2, 'Politics', 'politics'), (3, 'Business', 'business'), (4, 'Tech', 'tech')
ON CONFLICT (id) DO NOTHING;

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload config';`;

export function DatabaseSetupAlert() {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(SETUP_SQL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
            <Terminal className="h-4 w-4 stroke-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold flex items-center gap-2">
                ⚠️ Database Setup Required
            </AlertTitle>
            <AlertDescription className="mt-2 text-amber-700 dark:text-amber-300">
                <p className="mb-2">
                    I cannot access your Supabase dashboard directly. You <strong>must</strong> run this SQL code to fix the "Missing Column" errors.
                </p>
                <div className="relative mt-2">
                    <pre className="p-4 rounded bg-amber-950 text-amber-50 text-xs overflow-x-auto font-mono border border-amber-800">
                        {SETUP_SQL}
                    </pre>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 h-7 text-xs gap-1"
                        onClick={copyCode}
                    >
                        <Copy size={12} />
                        {copied ? "Copied!" : "Copy SQL"}
                    </Button>
                </div>
                <p className="mt-2 text-xs">
                    Go to <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste this, and click <strong>Run</strong>.
                </p>
            </AlertDescription>
        </Alert>
    );
}
