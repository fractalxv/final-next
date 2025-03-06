"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IProduct } from "../definitions/products";
import Loading from "./loading";

export default function Home() {
  const [products, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

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
            <button
              onClick={() => handleViewDetails(product.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}