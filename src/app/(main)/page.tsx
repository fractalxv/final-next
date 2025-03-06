"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader, ShoppingCart } from "lucide-react";
import { IProduct } from "../definitions/products";
import Loading from "./loading";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  // const { updateCartCount } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${searchQuery}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const products: IProduct[] = await res.json();
        setProduct(products);
        console.log('Product fetched:', products);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [searchQuery]);

  const handleViewDetails = (id: number) => {
    router.push(`/products/${id}`);
  };

  const addToCart = async (productId: string) => {
    setIsAddingToCart(productId);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      await updateCartCount(); // Update cart count after adding item
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
      router.push("/login");
    } finally {
      setIsAddingToCart(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="shadow-xl rounded-lg p-4">
            <div className="flex justify-center mb-4">
              <img 
                src={product.image} 
                alt={product.title} 
                className="h-48 object-contain" 
              />
            </div>
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-green-600 font-bold">${product.price}</p>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-sm text-gray-500">
              ⭐{product.rating.rate} | {product.rating.count} terjual🩷
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => addToCart(product.id)}
                disabled={isAddingToCart === product.id}
                className="flex items-center justify-center bg-green-500 text-white py-3 px-5 rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {isAddingToCart === product.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => handleViewDetails(product.id)}
                className="bg-green-200 text-green-600 font-semibold px-4 py-2 rounded-lg flex-grow hover:bg-green-100 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}