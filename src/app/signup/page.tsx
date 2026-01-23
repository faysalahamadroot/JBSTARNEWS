import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { signup } from "../login/actions";

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
                    <CardDescription>Join our community today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button className="w-full" formAction={signup}>Sign Up</Button>
                    </form>

                    <div className="text-center text-xs text-muted-foreground mt-4">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </div>
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
