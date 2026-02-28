"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentCustomer, logoutCustomer, Customer, updateCustomer } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail,
  Loader2,
  ChevronRight,
  Edit2,
  Check
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    try {
      const { customer } = await getCurrentCustomer();
      setCustomer(customer);
      setFormData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone || "",
      });
    } catch (err: any) {
      // If not logged in, redirect to login
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        router.push("/account/login");
        return;
      }
      setError(err.message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    
    try {
      const { customer: updated } = await updateCustomer({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });
      setCustomer(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Simple Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">TATVA</Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary">Cart</Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>My Account</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif italic text-primary mb-8">My Account</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Link 
                      href="/account" 
                      className="flex items-center px-4 py-3 bg-primary/5 text-primary rounded-md text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors"
                    >
                      <Package className="w-4 h-4 mr-3" />
                      Orders
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="flex items-center px-4 py-3 text-muted-foreground hover:bg-muted rounded-md text-sm font-medium transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Wishlist
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                  </nav>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardContent className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium">Profile Information</CardTitle>
                  {!editing && (
                    <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} disabled={saving} className="bg-primary">
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                          <p className="text-sm text-muted-foreground">Customer</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.phone || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/account/orders">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <Package className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-medium mb-1">My Orders</h3>
                      <p className="text-sm text-muted-foreground">Track and view your orders</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/wishlist">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <Heart className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-medium mb-1">My Wishlist</h3>
                      <p className="text-sm text-muted-foreground">Saved items you love</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Address Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Default Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.billing_address ? (
                    <div className="text-sm">
                      <p className="font-medium">{customer.billing_address.first_name} {customer.billing_address.last_name}</p>
                      <p className="text-muted-foreground">{customer.billing_address.address_1}</p>
                      {customer.billing_address.address_2 && (
                        <p className="text-muted-foreground">{customer.billing_address.address_2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {customer.billing_address.city}, {customer.billing_address.province} {customer.billing_address.postal_code}
                      </p>
                      <p className="text-muted-foreground">{customer.billing_address.country_code?.toUpperCase()}</p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-4">No default address saved</p>
                      <Link href="/checkout">
                        <Button variant="outline" size="sm">Add Address at Checkout</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
