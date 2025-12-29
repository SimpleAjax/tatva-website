import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"

export function FilterSidebar() {
    return (
        <div className="hidden lg:block w-64 space-y-8 pr-6 border-r">
            {/* Price Filter */}
            <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg">Price</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="p1" />
                        <label htmlFor="p1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Under ₹1,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="p2" />
                        <label htmlFor="p2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">₹1,000 - ₹5,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="p3" />
                        <label htmlFor="p3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Above ₹5,000</label>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Material Filter */}
            <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg">Material</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="m1" />
                        <label htmlFor="m1" className="text-sm font-medium leading-none">Gold Plated</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="m2" />
                        <label htmlFor="m2" className="text-sm font-medium leading-none">Sterling Silver</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="m3" />
                        <label htmlFor="m3" className="text-sm font-medium leading-none">Brass</label>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Collections */}
            <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg">Collections</h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Wedding</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Daily Wear</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Office</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Party</Badge>
                </div>
            </div>
        </div>
    )
}

export function MobileFilterSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search</SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-6">
                    {/* Copy of filters for mobile */}
                    <div className="space-y-4">
                        <h3 className="font-bold">Price</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="mp1" />
                                <label htmlFor="mp1">Under ₹1,000</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="mp2" />
                                <label htmlFor="mp2">₹1,000 - ₹5,000</label>
                            </div>
                        </div>
                    </div>
                    {/* Add more filters as needed */}
                </div>
            </SheetContent>
        </Sheet>
    )
}
