"use client";

import { useState, useEffect } from "react";
import { Product, PRODUCTS } from "../products";
import Link from "next/link";

interface CartItem extends Product {
  quantity: number;
}

// Example for demo: Simulate cart persistence
function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  const item = localStorage.getItem("cart");
  return item ? JSON.parse(item) : [];
}

function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="mb-8">Your cart is empty.</p>
        <Link href="/">
          <button className="bg-green-500 text-black px-4 py-2 rounded-full">Go Shopping</button>
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="flex items-center mb-6">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded mr-4" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p>${item.price.toFixed(2)} x {item.quantity}</p>
            </div>
            <div className="ml-2 font-bold text-green-400">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-700 pt-4 mt-6 flex justify-between items-center">
        <span className="font-bold text-xl">Total:</span>
        <span className="text-2xl text-green-400 font-bold">${total.toFixed(2)}</span>
      </div>
      <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold mt-8 px-6 py-4 rounded-full transition">
        Checkout
      </button>
      <div className="mt-6 text-center">
        <Link href="/" className="text-gray-400 hover:text-gray-200 underline">Back to Home</Link>
      </div>
    </main>
  );
}
