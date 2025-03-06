'use client';
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/?search=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        const user = await res.json();
        setUserName(user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await res.json();
        setCartCount(Array.isArray(data) ? data.length : (data.items ? data.items.length : 0));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    fetchCartCount();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('/api/cart/updates');
    eventSource.onmessage = (event) => {
      const updatedCart = JSON.parse(event.data);
      setCartCount(updatedCart.length);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <header className="bg-green-600 text-white p-4 flex backdrop-blur-xl gap-4 items-center">
        <Link href="/">
          <h1 className="text-4xl text-bold">🐸 Tokopaedi</h1>
        </Link>

        <form onSubmit={handleSubmit} className="flex w-full md:w-1/3 mb-2 md:mb-0">
          <input
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            className="p-2 rounded-3xl w-full text-black bg-slate-50"
            placeholder="  Cari Barang apa..."
          />
        </form>

        <div className="ml-auto flex items-center gap-4">
          <span>Welcome, {userName}</span>

          <Link href="/cart" className="relative flex items-center">
            <ShoppingCart className="w-5 h-5 text-white text-bold" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <LogoutButton />
      </header>
      {children}
    </>
  );
}
