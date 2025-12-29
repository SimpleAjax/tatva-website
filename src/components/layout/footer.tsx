import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand & Newsletter */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="font-serif text-2xl font-bold">Tatva</Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Exquisite jewellery for the modern soul. Timeless elegance crafted with passion.
                        </p>
                        <div className="pt-4">
                            <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
                            <div className="flex gap-2">
                                <Input placeholder="Enter your email" className="max-w-[200px]" />
                                <Button size="sm">Subscribe</Button>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-lg">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-primary">Bestsellers</Link></li>
                            <li><Link href="#" className="hover:text-primary">Rings</Link></li>
                            <li><Link href="#" className="hover:text-primary">Necklaces</Link></li>
                            <li><Link href="#" className="hover:text-primary">Earrings</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-lg">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Shipping & Returns</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-lg">Follow Us</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground pt-4">
                            © {new Date().getFullYear()} Tatva. All rights reserved.
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    )
}
