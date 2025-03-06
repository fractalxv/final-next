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
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/?search=${encodeURIComponent(inputValue.trim())}`);
    } else {
      // If search is empty, go to homepage without search params
      router.push('/');
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
        setIsLoggedIn(user.email !== 'Guest');
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoggedIn(false);
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
      <header className="bg-slate-100 border-b-green-600 p-4 flex justify-between gap-4 items-center">
        <Link href="/">
          <h1 className="text-4xl text-extrabold text-green-600">🐸 Tokopaedi</h1>
        </Link>

        <form onSubmit={handleSubmit} className="flex w-full md:w-1/3 mb-2 md:mb-0 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            className="p-2 rounded-3xl w-full text-black bg-slate-50"
            placeholder="  Cari Barang apa..."
          />
          <button 
            type="submit" 
            className="ml-2 text-white p-2 rounded-full"
            aria-label="Search"
          >
            🔍
          </button>
        </form>

        <div className="flex gap-4 items-center text-green-600">
          <span>Welcome, {userName}</span>

          <Link href="/cart" className="relative flex items-center">
            <ShoppingCart className="w-5 h-5 text-green-600 text-bold" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-green-400 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
        
      </header>
      {children}
    </>
  );
}