"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import RootLayout from "../../app/(main)/layout";

interface CartItem {
  id: number;
  title: string;
  price?: number; 
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]") || [];
    setCart(cartItems);
    calculateTotal(cartItems);
  }, []);

  const calculateTotal = (cartItems: CartItem[]) => {
    const total = cartItems.reduce((acc, item) => acc + ((item.price ?? 0) * item.quantity), 0);
    setTotal(total);
  };

  const handleCheckout = async () => {
    try {
      await axios.post("/api/checkout", { cart });
      localStorage.removeItem("cart");
      setCart([]);
      router.push("/success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
     <RootLayout>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">🛒 Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center p-4 border rounded-lg bg-gray-50 shadow">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg mr-4" />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-600">
                    Price: <span className="font-bold">${(item.price ?? 0).toFixed(2)}</span>
                  </p>
                  <p className="text-gray-600">
                    Quantity: <span className="font-bold">{item.quantity}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-green-600">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition"
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
    </RootLayout>
  );
}
