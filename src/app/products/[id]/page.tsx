"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IProduct } from "../../../app/definitions/products";
import Loading from "../../../app/(main)/loading";
import RootLayout from "../../../app/(main)/layout";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch product');
          }
          const product: IProduct = await res.json();
          setProduct(product);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      async function checkCart() {
        try {
          const res = await fetch(`/api/cart/${id}`);
          if (!res.ok) {
            throw new Error('Failed to check cart');
          }
          const result = await res.json();
          setIsInCart(result.isInCart);
        } catch (error) {
          console.error('Error checking cart:', error);
        }
      }
      checkCart();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }
      setIsInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.rating.count) {
      setQuantity(quantity + 1);
    }
  };

  const calculateSubtotal = () => {
    if (product) {
      return (product.price * quantity).toFixed(2);
    }
    return "0.00";
  };

  if (!product) {
    return <Loading />;
  }

  const stockStatus = product.rating.count > 0 
    ? product.rating.count < 20 
      ? "Stock tidak mencukupi" 
      : `Stock: ${product.rating.count}`
    : "Out of stock";

  return (
    <RootLayout>
      <div className="container mx-auto p-4 max-w-6xl">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
        
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-full md:w-1/2 p-6 flex justify-center items-center bg-gray-50">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-96 object-contain"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
            
            <div className="mb-4">
              <p className="text-gray-600">Stock: {product.rating.count}</p>
              <p className="text-red-600 text-xl font-bold">$ {product.price}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
            
            <div className="border-t border-b py-4 my-4">
              <p className="font-semibold mb-2">Atur jumlah dan catatan:</p>
              <p className="text-red-500 text-sm mb-3">{stockStatus}</p>
              
              <div className="flex items-center mb-4">
                <button 
                  onClick={decreaseQuantity} 
                  className="px-3 py-1 border border-gray-300 rounded-l text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button 
                  onClick={increaseQuantity} 
                  className="px-3 py-1 border border-gray-300 rounded-r text-lg"
                  disabled={quantity >= product.rating.count}
                >
                  +
                </button>
              </div>
              
              <div className="mb-4">
                <p className="font-semibold">Subtotal: ${calculateSubtotal()}</p>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-md text-white font-semibold ${
                isInCart || product.rating.count === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isInCart || product.rating.count === 0}
            >
              {isInCart ? 'Already in Cart' : '+ Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}