"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from "@/components/theme-toggle";

// --- Feature Cards ---
const FeatureCard = ({ title, desc, icon, delay }: { title: string, desc: string, icon: string, delay: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full h-full cursor-pointer rounded-3xl bg-white/40 dark:bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(6,182,212,0.1)] dark:hover:shadow-[0_20px_40px_rgb(6,182,212,0.15)] flex flex-col justify-between"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent dark:from-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 border border-slate-100 dark:border-zinc-700/50">
                        {icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                        {title}
                    </h3>
                </div>
                
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
};

export default function LandingPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleEnterPortal = () => {
        router.push('/login');
    };

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-zinc-950" />;

    return (
        <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 relative overflow-hidden font-sans selection:bg-cyan-500/30">
            
            {/* Background Ambient Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] bg-cyan-400/20 dark:bg-cyan-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-indigo-500/15 dark:bg-indigo-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* Header */}
            <header className="relative z-50 w-full px-6 md:px-12 h-24 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Rent<span className="text-cyan-600 dark:text-cyan-400">Flow</span>
                    </span>
                </div>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4 sm:px-6 pt-10 pb-20">
                
                {/* Hero Text */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                            Manage Every
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                            Unit Flawlessly.
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        The modern property management ecosystem built for seamless tenant experiences, automated billing, and live maintenance tracking.
                    </p>
                    
                    <button 
                        onClick={handleEnterPortal}
                        className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest">
                            Enter Portal
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 px-4 sm:px-0">
                    <FeatureCard 
                        icon="🏢" 
                        title="Smart Allocation" 
                        desc="Drag and drop residents into optimized room layouts instantly and effortlessly." 
                        delay={0.2} 
                    />
                    <FeatureCard 
                        icon="⚡" 
                        title="Automated Billing" 
                        desc="Generate invoices and track overdue balances with zero manual effort." 
                        delay={0.4} 
                    />
                    <FeatureCard 
                        icon="🛠️" 
                        title="Live Maintenance" 
                        desc="Track, assign, and resolve property repair requests in real-time." 
                        delay={0.6} 
                    />
                </div>
            </main>
        </div>
    );
}