"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "./products";
import Link from "next/link";

interface CartItem extends Product {
  quantity: number;
}

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Storefront</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center">
            <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded-lg mb-4" />
            <h2 className="font-semibold text-lg mb-2">{p.name}</h2>
            <p className="text-green-400 font-bold mb-4">${p.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(p)}
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-full transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="fixed bottom-6 right-6">
        <Link href="/cart">
          <button
            className="bg-white text-black font-bold rounded-full px-6 py-3 shadow-lg hover:bg-gray-300 transition"
          >
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </Link>
      </div>
    </main>
  );
}
