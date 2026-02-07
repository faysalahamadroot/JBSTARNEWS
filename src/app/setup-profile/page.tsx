"use client";

import { useActionState } from "react";
import { completeProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const initialState = {
    error: "",
};

export default function SetupProfilePage() {
    const [state, formAction, isPending] = useActionState(completeProfile, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif text-center">Complete Your Profile</CardTitle>
                    <CardDescription className="text-center">
                        Choose a unique username and tell us about yourself to verify your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username (Unique)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="username"
                                    className="pl-8"
                                    required
                                    minLength={3}
                                    pattern="^[a-zA-Z0-9_]+$"
                                    title="Username can only contain letters, numbers, and underscores."
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This will be your permanent identity on the platform.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Short bio..."
                                className="resize-none"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-destructive">{state.error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Verifying..." : "Complete Setup & Verify"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
