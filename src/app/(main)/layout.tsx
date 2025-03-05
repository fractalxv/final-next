'use client';
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("Guest");
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
        setUserName(user.email); // Display the user's email
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);


  return (
    <>
      <header className="bg-green-500 text-white p-4 flex gap-4 items-center">
        <Link href="/">
        <h1 className="text-4xl text-bold">Tokopaedi</h1>
        </Link>

        <form onSubmit={handleSubmit} className="flex w-full md:w-1/3 mb-2 md:mb-0">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              className="p-2 rounded-3xl w-full text-black bg-slate-50"
              placeholder="Search for product..."
            />
          </form>

        <div className="ml-auto flex items-center gap-4">
          <span>Welcome, {userName}</span>

          <button className="flex items-center gap-2 p-2 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out">
              {/* <img src="/cart.svg" alt="Cart" className="bg-white w-10 h-10 rounded-full shadow-lg" /> */}
            </button>
        
        {/* <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/users">Users</Link> */}
        </div>
        <LogoutButton />
      </header>
      {children}
    </>
  );
}