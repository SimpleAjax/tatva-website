import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string | number
    name: string
    price: number
    image: string
    quantity: number
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (id: string | number) => void
    updateQuantity: (id: string | number, quantity: number) => void
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
    clearCart: () => void
    totalItems: () => number
    subtotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                const items = get().items
                const existingItem = items.find((item) => item.id === newItem.id)

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + newItem.quantity }
                            : item
                    )
                    set({ items: updatedItems, isOpen: true })
                } else {
                    set({ items: [...items, newItem], isOpen: true })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) })
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                    return
                }
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                })
            },

            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            subtotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'tatva-cart-storage',
        }
    )
)
