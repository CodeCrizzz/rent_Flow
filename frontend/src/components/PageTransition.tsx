"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        
        // 1. Initial: Deep down, tilted back, dark, and blurry
        initial={{ 
            opacity: 0, 
            y: 50, 
            scale: 0.92, 
            rotateX: 15, // 3D tilt back
            transformOrigin: "bottom center",
            filter: "blur(20px) brightness(0.7)" 
        }}
        
        // 2. Animate: Snaps into perfectly flat focus
        animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            rotateX: 0,
            filter: "blur(0px) brightness(1)" 
        }}
        
        // 3. Exit: Flies up, towards the camera, and blows out the brightness
        exit={{ 
            opacity: 0, 
            y: -40, 
            scale: 1.05, 
            rotateX: -10, // 3D tilt forward
            transformOrigin: "top center",
            filter: "blur(15px) brightness(1.2)",
            transition: { 
                duration: 0.3, 
                ease: [0.22, 1, 0.36, 1] // Apple-style custom cubic easing
            }
        }}
        
        // 4. Custom Spring: Highly dynamic but smooth settling
        transition={{ 
            type: "spring",
            stiffness: 180, 
            damping: 18, 
            mass: 0.9,
            bounce: 0.2
        }}
        
        // The perspective wrapper is REQUIRED for the 3D rotateX effect to work
        className="w-full h-full"
        style={{ perspective: "1200px" }} 
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}