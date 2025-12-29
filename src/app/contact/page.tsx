import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground py-12 md:py-24">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Get in Touch</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Have a question about your order, shipping, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Form */}
                    <div className="space-y-8">
                        <div className="space-y-4">
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
                                <Input id="email" placeholder="jane@example.com" type="email" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                            </div>
                        </div>
                        <Button className="w-full bg-black text-white hover:bg-gold uppercase tracking-wider">Send Message</Button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 mt-1 text-primary" />
                                    <div>
                                        <p className="font-medium">Office Address</p>
                                        <p className="text-muted-foreground">123, Fashion Street, Koramangala, Bangalore - 560034</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 mt-1 text-primary" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">hello@tatvajewellery.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 mt-1 text-primary" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-muted-foreground">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-serif font-bold">Business Hours</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p className="flex justify-between max-w-xs"><span>Monday - Friday:</span> <span>10:00 AM - 7:00 PM</span></p>
                                <p className="flex justify-between max-w-xs"><span>Saturday:</span> <span>11:00 AM - 5:00 PM</span></p>
                                <p className="flex justify-between max-w-xs"><span>Sunday:</span> <span>Closed</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
