"use client"

import * as React from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const { openCart, totalItems } = useCartStore()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="text-left font-serif text-2xl font-bold">Tatva</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-8">
                            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors">New Launch</Link>
                            <Separator />
                            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors">Shop By Category</Link>
                            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors">Collections</Link>
                            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors">Best Sellers</Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="flex lg:w-0 lg:flex-1">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-serif text-2xl font-bold tracking-tight">Tatva</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8">
                    <Link href="/new-launch" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">
                        New Launch
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide outline-none">
                                Shop By Category
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-48">
                            <DropdownMenuItem>Rings</DropdownMenuItem>
                            <DropdownMenuItem>Necklaces</DropdownMenuItem>
                            <DropdownMenuItem>Earrings</DropdownMenuItem>
                            <DropdownMenuItem>Bracelets</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">
                        Collections
                    </Link>
                </nav>

                {/* Icons / Actions */}
                <div className="flex lg:w-0 lg:flex-1 justify-end items-center gap-2">
                    {isSearchOpen ? (
                        <div className="absolute top-0 left-0 w-full h-full bg-background flex items-center px-4 z-50 border-b">
                            <Search className="h-5 w-5 text-muted-foreground mr-2" />
                            <Input
                                autoFocus
                                placeholder="Search for jewellery..."
                                className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                onBlur={() => setIsSearchOpen(false)}
                            />
                            <Button variant="ghost" onClick={() => setIsSearchOpen(false)}>Close</Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                    </Button>

                    <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
                        <ShoppingBag className="h-5 w-5" />
                        {totalItems() > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                {totalItems()}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                </div>

            </div>
        </header>
    )
}
