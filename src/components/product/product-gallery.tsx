"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = React.useState(0)

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-auto md:overflow-visible">
                {images.map((img, i) => (
                    <button
                        key={i}
                        className={cn(
                            "relative w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden transition-colors",
                            selectedImage === i ? "border-primary" : "border-transparent hover:border-primary/50"
                        )}
                        onClick={() => setSelectedImage(i)}
                    >
                        <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square bg-secondary rounded-sm overflow-hidden group">
                <Image
                    src={images[selectedImage]}
                    alt="Product Main View"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                />
            </div>
        </div>
    )
}
