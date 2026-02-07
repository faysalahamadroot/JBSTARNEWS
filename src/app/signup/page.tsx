import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { signup } from "@/app/login/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;
    const error = params.error;

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Card className="w-[400px] shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Join the community today</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                            />
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                Must contain: Uppercase, Lowercase, Number, and Special Character (e.g. !@#$%)
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-xs text-destructive text-center font-medium">
                                    {decodeURIComponent(error)}
                                </p>
                            </div>
                        )}

                        <Button className="w-full" formAction={signup}>Sign Up</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
