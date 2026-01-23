"use client";

import React, { useActionState, useState, useEffect, ChangeEvent } from "react";
import { createPost, ActionState } from "../actions";
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

export default function CreatePostForm({ categories }: { categories: any[] | null }) {
    const [state, formAction, isPending] = useActionState(createPost, initialState);
    const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    async function handleFileUpload(file: File, bucket: "images" | "videos") {
        if (!file) return null;
        setStatus("uploading");

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`; // Removed subfolders for simplicity as verification needs public access directly usually

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return publicUrl; // Use full public URL to store in DB for easier access
        } catch (error) {
            console.error("Upload failed", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Upload failed: ${errorMessage}.`);
            return null;
        } finally {
            setStatus("idle");
        }
    }

    return (
        <form id="create-post-form" action={formAction} className="space-y-6">
            {state?.message && !state.success && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Headline</Label>
                <Input id="title" name="title" placeholder="Global Summit Reaches Historic Agreement" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle / Deck</Label>
                <Textarea id="subtitle" name="subtitle" placeholder="A brief summary causing maximum impact..." rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category_id" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="draft">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Publish Immediately</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="published_at">Publish Date (Optional)</Label>
                    <Input
                        type="datetime-local"
                        id="published_at"
                        name="published_at"
                    />
                </div>
            </div>

            {/* Image Upload/Link Tab */}
            <div className="space-y-2 border p-4 rounded-md">
                <Label>Cover Image</Label>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" /> Upload File</TabsTrigger>
                        <TabsTrigger value="url"><LinkIcon className="w-4 h-4 mr-2" /> External URL</TabsTrigger>
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
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = await handleFileUpload(file, 'images');
                                    if (url) setImageUrl(url);
                                }
                            }}
                        />
                        {status === 'uploading' && <div className="text-xs flex items-center gap-2"><Loader2 className="animate-spin w-3 h-3" /> Uploading...</div>}
                    </TabsContent>
                </Tabs>
                {/* Master input for submission */}
                <input type="hidden" name="image_url" value={imageUrl} />
                {imageUrl && (
                    <div className="mt-2 text-xs text-green-600 truncate">Selected Image: {imageUrl}</div>
                )}
            </div>


            {/* Video Upload/Link Tab */}
            <div className="space-y-2 border p-4 rounded-md">
                <Label>Video Content</Label>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" /> Upload File</TabsTrigger>
                        <TabsTrigger value="url"><LinkIcon className="w-4 h-4 mr-2" /> External/Embed URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="space-y-2">
                        <Input
                            placeholder="https://www.youtube.com/embed/..."
                            value={videoUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-2">
                        <Input
                            type="file"
                            accept="video/*"
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = await handleFileUpload(file, 'videos');
                                    if (url) setVideoUrl(url);
                                }
                            }}
                        />
                        {status === 'uploading' && <div className="text-xs flex items-center gap-2"><Loader2 className="animate-spin w-3 h-3" /> Uploading...</div>}
                    </TabsContent>
                </Tabs>
                <input type="hidden" name="video_url" value={videoUrl} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Article Body (HTML supported)</Label>
                <Textarea id="content" name="content" className="min-h-[300px] font-mono" placeholder="<p>Write your story here...</p>" required />
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="is_breaking" name="is_breaking" />
                <Label htmlFor="is_breaking">Is Breaking News?</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || status === 'uploading'}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Create Post"}
            </Button>
        </form>
    );
}
