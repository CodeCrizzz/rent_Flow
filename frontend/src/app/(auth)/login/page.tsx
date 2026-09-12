"use client";

import { LoginForm } from "@/components/login-form"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return <div className="dark min-h-screen bg-black" />;

  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-black p-4 md:p-10 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      


      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm md:max-w-4xl"
      >
        <LoginForm />
      </motion.div>
    </div>
  )
}