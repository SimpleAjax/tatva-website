"use client";

import { CreditCard, Banknote, Smartphone, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodCardProps {
  method: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  selected: boolean;
  onSelect: () => void;
  testCredentials?: {
    testCardNumber?: string;
    testUpiId?: string;
  };
}

const iconMap = {
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
};

export function PaymentMethodCard({ 
  method, 
  selected, 
  onSelect,
  testCredentials 
}: PaymentMethodCardProps) {
  const Icon = iconMap[method.icon as keyof typeof iconMap] || CreditCard;
  
  return (
    <label
      className={cn(
        "flex flex-col gap-2 p-4 border cursor-pointer transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="payment"
          value={method.id}
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 accent-primary"
        />
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-medium">{method.name}</p>
          <p className="text-sm text-muted-foreground">{method.description}</p>
        </div>
      </div>
      
      {/* Test Credentials in Sandbox Mode */}
      {testCredentials && (
        <div className="ml-8 mt-2 p-3 bg-amber-50 border border-amber-200 text-xs">
          <p className="font-medium text-amber-800 mb-1">Test Credentials:</p>
          {testCredentials.testCardNumber && (
            <p className="text-amber-700">Card: {testCredentials.testCardNumber}</p>
          )}
          {testCredentials.testUpiId && (
            <p className="text-amber-700">UPI ID: {testCredentials.testUpiId}</p>
          )}
        </div>
      )}
    </label>
  );
}
