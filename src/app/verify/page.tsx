"use client";

import { useActionState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { verifyOtp } from "@/app/login/actions";
import { useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "email"; // 'email' or 'phone'
    const target = searchParams.get("target") || ""; // email or phone number

    const [state, action, isPending] = useActionState(verifyOtp, null);

    return (
        <Card className="w-[400px] shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Account</CardTitle>
                <CardDescription>
                    Enter the code sent to {target}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <input type="hidden" name="type" value={type} />
                    <input type="hidden" name="phone" value={type === 'phone' ? target : ''} />
                    <input type="hidden" name="email" value={type === 'email' ? target : ''} />

                    <div className="space-y-2">
                        <Label htmlFor="token">Verification Code</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="token"
                                name="token"
                                type="text"
                                placeholder="123456"
                                className="pl-9"
                                required
                                maxLength={6}
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <p className="text-sm text-destructive text-center">{state.error}</p>
                    )}

                    <Button className="w-full" disabled={isPending}>
                        {isPending ? "Verifying..." : "Verify Code"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant="link" className="text-xs text-muted-foreground" asChild>
                    <a href="/login">Back to Login</a>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
