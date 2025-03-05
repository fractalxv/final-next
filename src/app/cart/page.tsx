"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
  }

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Try to get from API first
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          // Handle both array response and object with items property
          const cartItems = Array.isArray(data) ? data : 
                          (data.items ? data.items : []);
          setCart(cartItems);
          return;
        }
      } catch (error) {
        console.error('Error fetching from API:', error);
      }

      // Fallback to localStorage
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Ensure we're setting an array
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        setCart([]);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    
    try {
      await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });
      
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/checkout', { cart });
      localStorage.removeItem('cart');
      setCart([]);
      router.push('/checkout/success');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-xl font-bold mb-6">Keranjang</h1>
        
        {!Array.isArray(cart) || cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/" className="text-blue-500 hover:underline">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="w-16 h-16 relative mr-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h2 className="font-medium text-sm">{item.title}</h2>
                    <p className="text-xs text-gray-500">{item.category || 'jewelry'}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-2 py-1 border border-gray-300 rounded-l text-sm"
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        value={item.quantity} 
                        readOnly 
                        className="w-10 text-center border-t border-b border-gray-300 py-1 text-sm"
                      />
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-gray-300 rounded-r text-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right w-20">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold">Ringkasan Belanja</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total: <span className="font-bold text-lg">${calculateTotal()}</span></p>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium transition duration-200"
              >
                {isLoading ? 'Processing...' : 'Bayar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}