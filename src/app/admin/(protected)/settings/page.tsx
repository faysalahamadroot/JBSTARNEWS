import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold font-serif">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>General Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input defaultValue="JBStarNews" />
                    </div>
                    <div className="space-y-2">
                        <Label>Support Email</Label>
                        <Input defaultValue="support@jbstarnews.com" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">More settings coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}
