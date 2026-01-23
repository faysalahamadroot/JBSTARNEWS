"use client";

import React, { useActionState, useState, ChangeEvent } from "react";
import { updatePost, ActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: ActionState = {
    success: false,
    message: "",
};

interface EditPostFormProps {
    post: any;
    categories: any[] | null;
}

export default function EditPostForm({ post, categories }: EditPostFormProps) {
    const [state, formAction, isPending] = useActionState(updatePost, initialState);
    const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [imageUrl, setImageUrl] = useState(post.image_url || "");
    const [videoUrl, setVideoUrl] = useState(post.video_url || "");

    // Handle File Upload (Reuse logic)
    async function handleFileUpload(file: File, bucket: "images" | "videos") {
        if (!file) return null;
        setStatus("uploading");

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return publicUrl;
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console."); // Simplified
            return null;
        } finally {
            setStatus("idle");
        }
    }

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <input type="hidden" name="original_published_at" value={post.published_at || ""} />

            {state?.message && !state.success && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Input id="title" name="title" defaultValue={post.title} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle / Deck</Label>
                <Textarea id="subtitle" name="subtitle" defaultValue={post.subtitle || ""} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category_id" defaultValue={String(post.category_id)} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((c: any) => (
                                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                            ))}
                            {!categories?.length && (
                                <>
                                    <SelectItem value="1">World</SelectItem>
                                    <SelectItem value="2">Politics</SelectItem>
                                    <SelectItem value="3">Business</SelectItem>
                                    <SelectItem value="4">Tech</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={post.status || "draft"}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="published_at">Publish Date (Optional)</Label>
                    <Input
                        type="datetime-local"
                        id="published_at"
                        name="published_at"
                        defaultValue={post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ""}
                    />
                </div>
            </div>

            {/* Image Upload/Link Tab */}
            <div className="space-y-2 border p-4 rounded-md">
                <Label>Cover Image</Label>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="url">External URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="space-y-2">
                        <Input
                            name="image_url_text"
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-2">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = await handleFileUpload(file, 'images');
                                    if (url) setImageUrl(url);
                                }
                            }}
                        />
                        {status === 'uploading' && <div className="text-xs">Uploading...</div>}
                    </TabsContent>
                </Tabs>
                <input type="hidden" name="image_url" value={imageUrl} />
                {imageUrl && <div className="mt-1 text-xs text-green-600 truncate">Current: {imageUrl}</div>}
            </div>

            {/* Video Upload/Link Tab */}
            <div className="space-y-2 border p-4 rounded-md">
                <Label>Video Content</Label>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="url">External URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="space-y-2">
                        <Input
                            placeholder="URL..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-2">
                        <Input
                            type="file"
                            accept="video/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = await handleFileUpload(file, 'videos');
                                    if (url) setVideoUrl(url);
                                }
                            }}
                        />
                        {status === 'uploading' && <div className="text-xs">Uploading...</div>}
                    </TabsContent>
                </Tabs>
                <input type="hidden" name="video_url" value={videoUrl} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Article Body</Label>
                <Textarea id="content" name="content" className="min-h-[300px] font-mono" defaultValue={post.content} required />
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="is_breaking" name="is_breaking" defaultChecked={post.is_breaking} />
                <Label htmlFor="is_breaking">Is Breaking News?</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || status === 'uploading'}>
                {isPending ? "Saving..." : "Update Post"}
            </Button>
        </form>
    );
}
