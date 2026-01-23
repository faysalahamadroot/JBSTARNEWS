import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { deletePost } from "./actions";

export default async function AdminPostsPage() {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <Link href="/admin/posts/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    {!posts || posts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No posts found. Create your first one!
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id} className="bg-background border-b hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={post.title}>{post.title}</td>
                                            <td className="px-6 py-4">{post.categories?.name || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link href={`/admin/posts/edit/${post.id}`}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form action={async () => {
                                                    "use server";
                                                    await deletePost(String(post.id));
                                                }}>
                                                    <Button variant="destructive" size="icon" className="h-8 w-8" type="submit">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
