"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

// Order item image with error handling
function OrderItemImage({ thumbnail, title }: { thumbnail: string | null; title: string }) {
  const [error, setError] = useState(false);
  
  if (!thumbnail || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
        No Image
      </div>
    );
  }
  
  return (
    <Image
      src={thumbnail}
      alt={title}
      fill
      className="object-cover"
      sizes="80px"
      onError={() => setError(true)}
    />
  );
}
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Printer,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getOrder, type Order, formatPrice } from "@/lib/medusa";

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const mode = searchParams.get("mode");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { order } = await getOrder(orderId);
        setOrder(order);
      } catch (err) {
        setError("Failed to load order details. Please check your order ID.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?.display_id || orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModeBadge = () => {
    switch (mode) {
      case "demo":
        return {
          text: "Demo Order",
          className: "bg-blue-100 text-blue-800 border-blue-300",
          description: "This was a demo order. No actual payment was processed.",
        };
      case "sandbox":
        return {
          text: "Test Order",
          className: "bg-amber-100 text-amber-800 border-amber-300",
          description: "This was a test order using sandbox credentials.",
        };
      case "skipped":
        return {
          text: "Payment Skipped",
          className: "bg-purple-100 text-purple-800 border-purple-300",
          description: "Payment was skipped for testing purposes.",
        };
      default:
        return null;
    };
  };

  const modeBadge = getModeBadge();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-medium mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <Link href="/">
            <Button className="rounded-none">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-serif tracking-wider">
            TATVA
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif mb-2">Thank You for Your Order!</h1>
            <p className="text-muted-foreground">
              We&apos;ve received your order and will send you a confirmation email shortly.
            </p>
          </div>

          {/* Mode Badge (if applicable) */}
          {modeBadge && (
            <div className={cn(
              "mb-8 p-4 border rounded-none text-center",
              modeBadge.className
            )}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{modeBadge.text}</span>
              </div>
              <p className="text-sm opacity-80">{modeBadge.description}</p>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-muted p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-medium">#{order.display_id || order.id.slice(-8)}</span>
                  <button
                    onClick={copyOrderId}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Copy order ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <p className="font-medium capitalize">{order.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fulfillment</p>
                  <p className="font-medium capitalize">{order.fulfillment_status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium capitalize">{order.payment_status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-border p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                    <OrderItemImage thumbnail={item.thumbnail} title={item.title} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    {item.variant?.title && item.variant.title !== "Default variant" && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant.title}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Order Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_total > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_total)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping_total)}</span>
              </div>
              {order.tax_total > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_total)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-base">
                <span className="font-medium">Total</span>
                <span className="text-xl font-semibold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="border border-border p-6 mb-8">
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.province}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p className="uppercase">{order.shipping_address.country_code}</p>
                {order.shipping_address.phone && (
                  <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full rounded-none flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-none flex items-center gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>

          {/* Need Help */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Need help with your order?</p>
            <Link href="/contact" className="text-primary hover:underline text-sm">
              Contact Customer Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
