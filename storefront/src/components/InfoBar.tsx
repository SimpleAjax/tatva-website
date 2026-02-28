"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";

const InfoBar = () => {
    const features = [
        { icon: <Truck className="w-5 h-5" />, text: "Free Shipping Above ₹999" },
        { icon: <RotateCcw className="w-5 h-5" />, text: "15-Day Hassle Free Returns" },
        { icon: <ShieldCheck className="w-5 h-5" />, text: "100% Secure Checkout" },
        { icon: <CreditCard className="w-5 h-5" />, text: "Cash on Delivery Available" },
    ];

    return (
        <div className="w-full bg-primary text-primary-foreground py-3">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3 text-center md:text-left">
                            <div className="opacity-80">{f.icon}</div>
                            <span className="text-[10px] lg:text-[11px] font-bold tracking-widest uppercase">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoBar;
