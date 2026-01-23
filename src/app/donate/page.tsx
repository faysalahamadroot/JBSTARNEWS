import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coffee } from "lucide-react";

export default function DonatePage() {
    return (
        <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 mb-10 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">Support Our Journalism</h1>
                <p className="text-xl text-muted-foreground">
                    Independent reporting takes time, resources, and dedication. Help us keep the lights on and the stories coming.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Coffee className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">One-Time Support</CardTitle>
                        <CardDescription>Support a specific story or just buy us a coffee.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-4">
                        <Button size="lg" className="w-full text-lg font-semibold">
                            Donate Once
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">Secure payment via Stripe (Coming Soon)</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary hover:bg-primary/5 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">RECOMMENDED</div>
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg">
                            <Heart className="w-8 h-8 fill-current animate-pulse" />
                        </div>
                        <CardTitle className="text-2xl">Monthly Member</CardTitle>
                        <CardDescription>Join our community and sustain our work long-term.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-4">
                        <Button size="lg" className="w-full text-lg font-semibold">
                            Become a Member
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">Cancel anytime.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
