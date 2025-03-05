import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-100 flex justify-center items-center h-screen">
      {children}
    </div>
  )
}