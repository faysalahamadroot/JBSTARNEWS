import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage(props: { searchParams: Promise<{ error: string }> }) {

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login-form">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    {/* {error && <p className="text-sm text-red-500 font-medium">{error}</p>} */}
                    <Button className="w-full" form="login-form" formAction={login}>Sign In</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
