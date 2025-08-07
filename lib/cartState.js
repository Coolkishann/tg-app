import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id)
      
      let newItems
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }]
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        items: newItems,
        totalItems,
        totalPrice
      }
    })
  },
  
  removeItem: (productId) => {
    set(state => ({
      items: state.items.filter(item => item.id !== productId)
    }))
    
    // Update totals
    const newItems = get().items
    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    set({ totalItems, totalPrice })
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    set((state) => {
      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        items: newItems,
        totalItems,
        totalPrice
      }
    })
  },
  
  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 })
}))
