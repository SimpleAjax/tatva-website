"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  Cart,
  createCart,
  getCart,
  addToCart,
  updateLineItem,
  removeLineItem,
  updateCart,
  addShippingMethod,
  getShippingOptions,
  ShippingOptionWithPrice,
} from "@/lib/medusa";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  isCartOpen: boolean;
  shippingOptions: ShippingOptionWithPrice[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  setShippingAddress: (address: Partial<Cart["shipping_address"]>) => Promise<void>;
  setBillingAddress: (address: Partial<Cart["billing_address"]>) => Promise<void>;
  setShippingMethod: (optionId: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshShippingOptions: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = "medusa_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOptionWithPrice[]>([]);

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem(CART_ID_KEY);
      
      if (storedCartId) {
        try {
          const { cart: existingCart } = await getCart(storedCartId);
          if (existingCart.completed_at) {
            // Cart is completed, create a new one
            const { cart: newCart } = await createCart();
            localStorage.setItem(CART_ID_KEY, newCart.id);
            setCart(newCart);
          } else {
            setCart(existingCart);
          }
        } catch (error) {
          // Cart not found or error, create new cart
          const { cart: newCart } = await createCart();
          localStorage.setItem(CART_ID_KEY, newCart.id);
          setCart(newCart);
        }
      } else {
        // No cart ID, create new cart
        const { cart: newCart } = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      }
    };

    initCart();
  }, []);

  // Fetch shipping options when cart changes
  useEffect(() => {
    if (cart?.id && cart.shipping_address?.country_code) {
      refreshShippingOptions();
    }
  }, [cart?.id, cart?.shipping_address?.country_code]);

  const refreshShippingOptions = useCallback(async () => {
    if (!cart?.id) return;
    try {
      const { shipping_options } = await getShippingOptions(cart.id);
      setShippingOptions(shipping_options);
    } catch (error) {
      console.error("Failed to fetch shipping options:", error);
    }
  }, [cart?.id]);

  const refreshCart = useCallback(async () => {
    if (!cart?.id) return;
    try {
      const { cart: updatedCart } = await getCart(cart.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  }, [cart?.id]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const addItem = useCallback(async (variantId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await addToCart(cart.id, variantId, quantity);
      setCart(updatedCart);
      openCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id, openCart]);

  const updateItem = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await updateLineItem(cart.id, lineItemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update item:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await removeLineItem(cart.id, lineItemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const setShippingAddress = useCallback(async (address: Partial<Cart["shipping_address"]>) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await updateCart(cart.id, { shipping_address: address });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to set shipping address:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const setBillingAddress = useCallback(async (address: Partial<Cart["billing_address"]>) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await updateCart(cart.id, { billing_address: address });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to set billing address:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const setShippingMethod = useCallback(async (optionId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await addShippingMethod(cart.id, optionId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to set shipping method:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const setEmail = useCallback(async (email: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await updateCart(cart.id, { email });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to set email:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart?.id]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        isCartOpen,
        shippingOptions,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateItem,
        removeItem,
        setShippingAddress,
        setBillingAddress,
        setShippingMethod,
        setEmail,
        refreshCart,
        refreshShippingOptions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
