import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeader } from "@/components/ui/section-header";

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // 1. Fetch total page views
    const { count: totalViews } = await supabase
        .from("analytics")
        .select("*", { count: "exact", head: true });

    // 2. Fetch top pages (manual aggregation since Supabase Client doesn't support complex group by easily without RPC)
    // For simplicity, we fetch last 1000 events and aggregate in JS, or use a view. 
    // Creating a view is better, but here we'll just fetch recent events.

    const { data: recentEvents } = await supabase
        .from("analytics")
        .select("path, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

    // Clientside aggregation (server-side really)
    const pageCounts: Record<string, number> = {};
    recentEvents?.forEach((event) => {
        const path = event.path || "/";
        pageCounts[path] = (pageCounts[path] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-serif text-slate-900">Analytics Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews || 0}</div>
                    </CardContent>
                </Card>
                {/* Placeholder for other stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Requires real-time setup</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Top Visited Pages (Last 500 events)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Path</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topPages.map(([path, count]) => (
                                <TableRow key={path}>
                                    <TableCell>{path}</TableCell>
                                    <TableCell className="text-right">{count}</TableCell>
                                </TableRow>
                            ))}
                            {topPages.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
