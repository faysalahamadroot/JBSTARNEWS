import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut, Globe } from "lucide-react";
import { logout } from "../login/actions";
import { cookies } from "next/headers";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold font-serif mb-1">JBStarNews</h1>
                    <span className="text-xs text-slate-400">Admin Panel</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-slate-800 rounded-md text-white">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/admin/articles/create" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <FileText size={18} /> New Article
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <Settings size={18} /> Settings
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                            <Globe size={18} /> View Site
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                    </div>
                    <form action={logout}>
                        <Button variant="destructive" className="w-full gap-2" size="sm">
                            <LogOut size={14} /> Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-50 p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
