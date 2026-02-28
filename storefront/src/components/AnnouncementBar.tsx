"use client";

import React from "react";
import Link from "next/link";
import { 
  defaultAnnouncement, 
  isAnnouncementActive 
} from "@/lib/content-config";

const AnnouncementBar = () => {
  const config = defaultAnnouncement;
  
  // Check if announcement should be shown
  if (!isAnnouncementActive(config)) {
    return null;
  }

  const content = (
    <div className={`w-full ${config.backgroundColor} ${config.textColor} py-2.5 overflow-hidden whitespace-nowrap`}>
      <div className="animate-marquee inline-block">
        {/* Primary Message */}
        <span className="mx-4 text-xs font-medium tracking-wider">
          {config.text}
        </span>
        
        {/* Default Messages (if no custom text) */}
        {config.text === defaultAnnouncement.text && (
          <>
            <span className="mx-4 text-xs font-medium tracking-wider">
              🚚 FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999 🚚
            </span>
            <span className="mx-4 text-xs font-medium tracking-wider">
              💖 SPECIAL VALENTINE&apos;S OFFERS - EXTRA 25% OFF SITEWIDE 💖
            </span>
          </>
        )}
        
        {/* Mirror for continuous scrolling */}
        <span className="mx-4 text-xs font-medium tracking-wider">
          {config.text}
        </span>
        {config.text === defaultAnnouncement.text && (
          <>
            <span className="mx-4 text-xs font-medium tracking-wider">
              🚚 FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999 🚚
            </span>
            <span className="mx-4 text-xs font-medium tracking-wider">
              💖 SPECIAL VALENTINE&apos;S OFFERS - EXTRA 25% OFF SITEWIDE 💖
            </span>
          </>
        )}
      </div>
    </div>
  );

  if (config.link) {
    return (
      <Link href={config.link} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export default AnnouncementBar;
