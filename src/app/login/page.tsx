"use client";

import { useActionState, useState } from "react"; // React 19 hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { login, loginWithGoogle, loginWithPhone, verifyOtp } from "./actions";
import { Phone, Mail, Lock, KeyRound } from "lucide-react";

export default function LoginPage() {
    const [emailState, emailAction, emailPending] = useActionState(login, null);
    const [phoneState, phoneAction, phonePending] = useActionState(loginWithPhone, null);
    const [verifyState, verifyAction, verifyPending] = useActionState(verifyOtp, null);

    // Manage phone number locally to pass to verify step
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Card className="w-[400px] shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="email">
                                <Mail className="mr-2 h-4 w-4" /> Email
                            </TabsTrigger>
                            <TabsTrigger value="phone">
                                <Phone className="mr-2 h-4 w-4" /> Phone
                            </TabsTrigger>
                        </TabsList>

                        {/* EMAIL LOGIN TAB */}
                        <TabsContent value="email">
                            <form action={emailAction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                    </div>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <Button className="w-full" disabled={emailPending}>
                                    {emailPending ? "Signing In..." : "Sign In with Email"}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* PHONE LOGIN TAB */}
                        <TabsContent value="phone">
                            {!phoneState?.success ? (
                                <form action={phoneAction} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+1234567890"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Include country code (e.g. +1 for USA)</p>
                                    </div>
                                    {phoneState?.error && <p className="text-sm text-destructive">{phoneState.error}</p>}
                                    <Button className="w-full" disabled={phonePending}>
                                        {phonePending ? "Sending Code..." : "Send SMS Code"}
                                    </Button>
                                </form>
                            ) : (
                                <form action={verifyAction} className="space-y-4">
                                    <input type="hidden" name="phone" value={phoneNumber} />
                                    <div className="space-y-2">
                                        <Label htmlFor="token">Verification Code</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="token" name="token" type="text" placeholder="123456" className="pl-9" required />
                                        </div>
                                        <p className="text-xs text-green-600 font-medium">Code sent to {phoneNumber}</p>
                                    </div>
                                    {verifyState?.error && <p className="text-sm text-destructive">{verifyState.error}</p>}
                                    <Button className="w-full" disabled={verifyPending}>
                                        {verifyPending ? "Verifying..." : "Verify & Login"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full h-8 text-xs"
                                        type="button"
                                        onClick={() => window.location.reload()} // Reset state simple way
                                    >
                                        Change Phone Number
                                    </Button>
                                </form>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => loginWithGoogle()}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
