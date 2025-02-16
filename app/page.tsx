'use client'

import Hero from "@/components/Hero";
import Center from "@/components/center";
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{
    fetch("https://chat-backend-vve1.onrender.com/api/debug-cookie", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(console.log);
      ;
  },[])
  return (
    <main className="min-h-screen overflow-hidden bg-[#111111] relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="fixed w-[1000px] h-[1000px] bg-purple-500/30 rounded-full blur-[120px] -top-[400px] -right-[400px]" />
      <div className="fixed w-[1000px] h-[1000px] bg-blue-500/30 rounded-full blur-[120px] -bottom-[400px] -left-[400px]" />

      <div className="relative">
        <Hero />
        <Center />
      </div>
    </main>
  );
}
