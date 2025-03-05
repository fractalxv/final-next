"use client";

import { useEffect } from "react";
import { importProducts } from "../utils/importProducts";

export default function ClientComponent() {
  useEffect(() => {
    importProducts();
  }, []);

  return null;
}
