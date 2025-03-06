
"use client";
import { login } from "@/src/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function Login() {
  const [state, formAction, pending] = useActionState(login, { message: "" });

  return (
    
    <form action={formAction} className="p-8 bg-white w-[320px] rounded-2xl shadow-md flex flex-col gap-8">
      <h1 className="text-3xl text-center font-semibold text-slate-500">Welcome to Tokopaedi🐸</h1>
      {state.message && (
        <div className="text-red-500 tex-sm mt-2 bg-red-50 p-2 rounded">{state.message}</div>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <button
          disabled={pending}
          className="w-full bg-green-500 text-white rounded-md p-2 mt-4"
        >
          Login
        </button>
      </div>

      <div className="text-center">
        Do not have account?{" "}
        <Link href="/register" className="text-green-500">
          Register
        </Link>
      </div>
    </form>
  );
}
