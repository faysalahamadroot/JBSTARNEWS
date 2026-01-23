
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    // Try to insert. If RLS fails, we'll know.
    const { data, error } = await supabase.from('categories').upsert([
        { name: 'Science', slug: 'science' },
        { name: 'Health', slug: 'health' },
        { name: 'Climate', slug: 'climate' },
        { name: 'Opinion', slug: 'opinion' },
        { name: 'Sports', slug: 'sports' },
        { name: 'Video', slug: 'video' }
    ], { onConflict: 'slug' }).select();

    return NextResponse.json({ data, error });
}
