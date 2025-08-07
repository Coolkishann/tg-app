export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // URL or local
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-151...1", // replace with any image
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 149.99,
    image: "https://images.unsplash.com/photo-151...2",
  },
];
