
'use client'
import { register } from "@/src/app/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";

const initialState = {
  errors: {
    email: [],
    password: [],
  }
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <>
      <form
        action={formAction}
        className="p-8 bg-white w-[320px] rounded-md shadow-md flex flex-col gap-8"
      >
        <h1 className="text-3xl text-center font-semibold text-slate-500">Create New Account 😀</h1>

        <div>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {<div className="text-red-500 tex-sm mt-2">{state.errors.email?.join(", ")}</div>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {<div className="text-red-500 tex-sm mt-2">{state.errors.password?.join(", ")}</div>}
        </div>

        <div>
          <button disabled={pending} className="w-full bg-green-500 text-white rounded-md p-2 mt-4">
            {pending ? "Saving data..." : "Register"}
          </button>
        </div>

        <div className="text-center">
          Have account already? <Link href="/login" className="text-green-500">Login</Link>
        </div>
      </form>
    </>
  );
}
