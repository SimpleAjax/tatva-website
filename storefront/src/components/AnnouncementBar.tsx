"use client";

import React from "react";

const AnnouncementBar = () => {
    return (
        <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block">
                <span className="mx-4 text-xs font-medium tracking-wide">
                    ✨ JOIN THE TATVA TRIBE & GET 10% OFF ON YOUR FIRST ORDER! USE CODE: TATVA10 ✨
                </span>
                <span className="mx-4 text-xs font-medium tracking-wide">
                    🚚 FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999 🚚
                </span>
                <span className="mx-4 text-xs font-medium tracking-wide">
                    💖 SPECIAL VALENTINE'S OFFERS - EXTRA 25% OFF SITEWIDE 💖
                </span>
                {/* Mirror for continuous scrolling */}
                <span className="mx-4 text-xs font-medium tracking-wide">
                    ✨ JOIN THE TATVA TRIBE & GET 10% OFF ON YOUR FIRST ORDER! USE CODE: TATVA10 ✨
                </span>
                <span className="mx-4 text-xs font-medium tracking-wide">
                    🚚 FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999 🚚
                </span>
                <span className="mx-4 text-xs font-medium tracking-wide">
                    💖 SPECIAL VALENTINE'S OFFERS - EXTRA 25% OFF SITEWIDE 💖
                </span>
            </div>
        </div>
    );
};

export default AnnouncementBar;
