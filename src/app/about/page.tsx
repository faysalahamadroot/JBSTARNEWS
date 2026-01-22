import { SectionHeader } from "@/components/ui/section-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEAM = [
    { name: "Eleanor Rigby", role: "Editor-in-Chief", bio: "Former war correspondent with 20 years of experience.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop" },
    { name: "John Doe", role: "Managing Editor", bio: "Pulitzer prize winning investigative journalist.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop" },
    { name: "Sarah Jenkins", role: "Senior Climate Correspondent", bio: "Expert in environmental science and policy.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" },
    { name: "Michael Chen", role: "Tech Editor", bio: "Software engineer turned journalist covering AI.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
];

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">About JBStarNews</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    We are dedicated to delivering accurate, unbiased, and timely news from every corner of the globe. In an era of misinformation, we stand for truth.
                </p>
            </div>

            {/* Mission */}
            <section className="mb-16">
                <SectionHeader title="Our Mission" />
                <div className="prose dark:prose-invert max-w-none text-lg">
                    <p>
                        Founded in 2026, JBStarNews was built on a simple premise: that the world deserves a news source that prioritizes facts over engagement, and depth over brevity.
                    </p>
                    <p>
                        Our reporters are stationed in 40 countries, working around the clock to bring you stories that matter. We believe in the power of journalism to hold power to account and to give a voice to the voiceless.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="mb-16">
                <SectionHeader title="Our Values" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integrity</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            We verify every fact. We declare every conflict of interest. Trust is our currency.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Independence</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            We are fully reader-supported. No corporate entity dictates our editorial policy.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Perspective</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            We don't just cover the West. We cover the world, with local experts in every region.
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Masthead */}
            <section>
                <SectionHeader title="Leadership Team" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {TEAM.map((member) => (
                        <div key={member.name} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={member.image} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                                <p className="text-sm text-muted-foreground">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
