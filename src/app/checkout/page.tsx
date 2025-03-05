"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') || [];
    setCart(cartItems);
    calculateTotal(cartItems);
  }, []);

  const calculateTotal = (cartItems: { price: number; quantity: number }[]) => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(total);
  };

  const handleCheckout = async () => {
    try {
      await axios.post('/api/checkout', { cart });
      localStorage.removeItem('cart');
      setCart([]);
      router.push('/success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Checkout Page</h1>
      <div>
        {cart.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
      <h2>Total: ${total}</h2>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}