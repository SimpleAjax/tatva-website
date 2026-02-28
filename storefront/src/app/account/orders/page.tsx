"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCustomerOrders, Order, formatPrice } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ChevronLeft, 
  Loader2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { orders } = await getCustomerOrders();
      setOrders(orders);
    } catch (err: any) {
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        router.push("/account/login");
        return;
      }
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "canceled":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      canceled: "destructive",
      processing: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Simple Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">TATVA</Link>
          <Link href="/account" className="text-sm text-muted-foreground hover:text-primary">
            My Account
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/account" className="hover:text-primary">My Account</Link>
          <span className="mx-2">/</span>
          <span>Orders</span>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-serif italic text-primary">My Orders</h1>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4 text-red-600 text-sm">{error}</CardContent>
            </Card>
          )}

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-medium mb-2">No orders yet</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="p-6 border-b bg-muted/30">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Order #{order.display_id}</p>
                          <p className="text-sm">Placed on {formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.fulfillment_status)}
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(order.total, order.currency_code)}
                            </p>
                            {getStatusBadge(order.fulfillment_status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                              {item.thumbnail ? (
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {formatPrice(item.total, order.currency_code)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(order.subtotal, order.currency_code)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
                          </div>
                          {order.tax_total > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax</span>
                              <span>{formatPrice(order.tax_total, order.currency_code)}</span>
                            </div>
                          )}
                          {order.discount_total > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-{formatPrice(order.discount_total, order.currency_code)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total</span>
                            <span>{formatPrice(order.total, order.currency_code)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div className="mt-6 pt-4 border-t">
                          <div className="flex items-start gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium mb-1">Shipping Address</p>
                              <p className="text-muted-foreground">
                                {order.shipping_address.first_name} {order.shipping_address.last_name}
                              </p>
                              <p className="text-muted-foreground">
                                {order.shipping_address.address_1}
                                {order.shipping_address.address_2 && `, ${order.shipping_address.address_2}`}
                              </p>
                              <p className="text-muted-foreground">
                                {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
