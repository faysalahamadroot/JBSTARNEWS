import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PlusCircle, FileText } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch real articles from DB
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your content and settings.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/articles/create" className="gap-2">
                        <PlusCircle size={16} /> Create Article
                    </Link>
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articles?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">+0 from last month</p>
                    </CardContent>
                </Card>
                {/* Placeholder Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-green-500/20" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articles?.filter(a => a.status === 'published').length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-yellow-500/20" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articles?.filter(a => a.status === 'draft').length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Articles */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                    <CardDescription>A list of your recent news stories.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!articles || articles.length === 0) ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-4">No articles found.</p>
                            <Button variant="outline" asChild>
                                <Link href="/admin/articles/create">Create your first story</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article) => (
                                <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <h4 className="text-sm font-semibold truncate">{article.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span className={`px-2 py-0.5 rounded-full capitalize ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {article.status}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/articles/edit/${article.id}`}>Edit</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
