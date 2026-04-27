"use client";
import { motion } from "framer-motion";

export default function TenantTemplate({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 md:left-[280px] z-[9999] bg-slate-50 dark:bg-[#050505] pointer-events-none"
            />
            {children}
        </>
    );
}
