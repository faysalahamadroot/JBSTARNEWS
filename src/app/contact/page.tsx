import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto py-12 max-w-5xl">
            <h1 className="text-4xl font-bold font-serif mb-12 text-center">Contact Us</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Contact Form */}
                <div>
                    <SectionHeader title="Send us a message" />
                    <p className="text-muted-foreground mb-8">
                        Have a tip? Want to advertise? Or just have a question? Fill out the form below.
                    </p>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                <Input id="first-name" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="jane@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                            <Input id="subject" placeholder="General Inquiry" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                        </div>

                        <Button size="lg" className="w-full">Send Message</Button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                    <SectionHeader title="Get in touch" />

                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email Us</h3>
                                    <p className="text-sm text-muted-foreground">contact@jbstarnews.com</p>
                                    <p className="text-sm text-muted-foreground">tips@jbstarnews.com (Secure)</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Call Us</h3>
                                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                    <p className="text-sm text-muted-foreground">Mon-Fri, 9am - 5pm EST</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Visit Us</h3>
                                    <p className="text-sm text-muted-foreground">123 Media Ave, Suite 400</p>
                                    <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-secondary p-6 rounded-lg">
                        <h3 className="font-bold mb-2">Corrections Policy</h3>
                        <p className="text-sm text-muted-foreground">
                            JBStarNews is committed to accuracy. If you spot an error, please email corrections@jbstarnews.com with the article link and details.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
