'use client'

import Hero from "@/components/Hero";
import Center from "@/components/center";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("https://chat-backend-vve1.onrender.com/api/debug-cookie", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(console.log);
    ;
  }, [])
  return (
    <main className="">
      <Hero />
   
    </main>
  );
}
