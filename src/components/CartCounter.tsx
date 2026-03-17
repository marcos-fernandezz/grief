"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

// 👇 FIJATE ACÁ: Los paréntesis de CartCounter() tienen que estar VACÍOS.
export default function CartCounter() { 
  const [isMounted, setIsMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const badgeClasses = "absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center";

  if (!isMounted) {
    return <span className={badgeClasses}>0</span>;
  }

  return (
    <span className={badgeClasses}>
      {totalItems}
    </span>
  );
}