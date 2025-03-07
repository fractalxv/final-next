"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IProduct } from "../../../app/definitions/products";
import Loading from "../../../app/(main)/loading";
import RootLayout from "../../../app/(main)/layout";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch product");
          }
          const product: IProduct = await res.json();
          setProduct(product);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      // Show notification
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
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
    return product ? (product.price * quantity).toFixed(2) : "0.00";
  };

  if (!product) {
    return <Loading />;
  }

  const stockStatus =
    product.rating.count > 0
      ? product.rating.count < 20
        ? "Stock tidak mencukupi"
        : `Stock: ${product.rating.count}`
      : "Out of stock";

  return (
    <RootLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-3 py-2 text-green-500 rounded text-lg"
        >
          ← Back to Home
        </button>
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="w-full md:w-1/2 p-1 flex justify-center items-center bg-slate-50">
            <img src={product.image} alt={product.title} className="max-h-150 object-contain " />
          </div>

          <div className="w-full md:w-1/2 p-6">
            <h1 className="text-5xl font-bold mb-2">{product.title}</h1>

            <div className="mb-2">
              <p className="text-gray-600">Stock: {product.rating.count}</p>
              <p className="text-red-600 text-2xl font-bold">$ {product.price}</p>
            </div>

            <div className="mb-2">
              <p className="text-gray-700 mb-4 text-sm">{product.description}</p>
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
              className="w-full py-3 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
              disabled={product.rating.count === 0}
            >
              + Keranjang
            </button>
          </div>
        </div>

        {/* Pop-up Notification */}
        {showPopup && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded shadow-md">
            ✅ Product added to cart!
          </div>
        )}
      </div>
    </RootLayout>
  );
}
