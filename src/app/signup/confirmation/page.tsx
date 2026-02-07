import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function SignupConfirmationPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Card className="w-[400px] shadow-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription>
                        We sent a confirmation link to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the link in the email to activate your account and start chatting.
                    </p>
                    <div className="p-3 bg-muted rounded-md text-xs text-left">
                        <p className="font-semibold mb-1">Tip:</p>
                        <p>If you don't see the email, check Spam or Promotions.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="ghost">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
