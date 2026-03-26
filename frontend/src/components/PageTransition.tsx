"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // We use the pathname as a unique key so AnimatePresence knows when a new page enters
  const pathname = usePathname();

  return (
    // AnimatePresence is required to allow exit animations to finish before unmounting
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        
        // 1. Initial State: Slightly scaled down, moved down, and blurred
        initial={{ 
            opacity: 0, 
            y: 20, 
            scale: 0.98,
            filter: "blur(12px)" 
        }}
        
        // 2. Animate State: Settle into normal position, scale, and clear focus
        animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: "blur(0px)" 
        }}
        
        // 3. Exit State: Fade out fast, move slightly up, and blur again
        exit={{ 
            opacity: 0, 
            y: -15, 
            scale: 0.99,
            filter: "blur(8px)",
            transition: { 
                duration: 0.2, // Make exit faster than entry
                ease: "easeInOut" 
            }
        }}
        
        // 4. The Magic: A highly tuned spring transition for entry
        transition={{ 
            type: "spring",
            stiffness: 260, // How "tight" the spring is
            damping: 25,    // How quickly it settles (prevents bouncing)
            mass: 0.8       // How "heavy" the element feels
        }}
        
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}