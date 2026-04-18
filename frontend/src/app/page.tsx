"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- feature cards ---
const FeatureCard = ({ title, desc, icon, delay }: { title: string, desc: string, icon: string, delay: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full mx-auto group cursor-pointer"
        >
            {/* Animated Laser Edge (Top) */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"></div>
            
            {/* Main Card Body */}
            <div className="relative h-full p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-slate-50 dark:group-hover:bg-[#121c33] group-hover:border-slate-300 dark:group-hover:border-slate-700 group-hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.15)] shadow-sm">
                
                {/* Radial Hover Gradient inside the card */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 md:gap-4 mb-3">
                        {/* Floating Orbital Icon Container */}
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            {/* Outer Rotating Ring */}
                            <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-white/10 border-t-cyan-500/50 group-hover:rotate-180 transition-all duration-700 ease-out"></div>
                            
                            {/* Inner Pulse Glow */}
                            <div className="absolute inset-1.5 rounded-full bg-cyan-500/10 blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* The Icon */}
                            <span className="text-xl sm:text-2xl drop-shadow-sm dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 relative z-10">
                                {icon}
                            </span>
                        </div>
                        
                        {/* Typography */}
                        <h3 className="text-slate-800 dark:text-white font-bold text-base sm:text-lg tracking-tight group-hover:text-cyan-700 dark:group-hover:text-cyan-50 transition-colors duration-300">
                            {title}
                        </h3>
                    </div>
                    
                    <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors duration-300">
                        {desc}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Hover Button Component ---
const PrimaryButton = ({ onClick, isEntering }: { onClick: () => void, isEntering: boolean }) => {
    return (
        <button 
            onClick={onClick}
            className={`relative group inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-cyan-600 dark:bg-white text-white dark:text-slate-900 font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-cyan-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                Enter Login Portal
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1.5 shadow-[0_0_8px_rgba(6,182,212,0.2)] dark:shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </span>
        </button>
    );
};

// --- Main Landing Page Component ---
export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [isMounted, setIsMounted] = useState(false);
    const [isEntering, setIsEntering] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [isMouseInside, setIsMouseInside] = useState(false);

    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseCurrent = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    const statuses = ["Loading...", "Connecting...", "Entering portal..."];

    // --- BULLETPROOF SCROLL LOCK ---
    useEffect(() => {
        if (!isMounted || isEntering) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMounted, isEntering]);

    useEffect(() => {
        const mountTimer = setTimeout(() => setIsMounted(true), 100);

        mouseTarget.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        mouseCurrent.current = { ...mouseTarget.current };

        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
        const animate = () => {
            mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.08);
            mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.08);

            if (containerRef.current) {
                containerRef.current.style.setProperty("--mouse-x", `${mouseCurrent.current.x}px`);
                containerRef.current.style.setProperty("--mouse-y", `${mouseCurrent.current.y}px`);
            }
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);
        return () => { 
            clearTimeout(mountTimer);
            if (rafId.current) cancelAnimationFrame(rafId.current); 
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        mouseTarget.current.x = e.clientX;
        mouseTarget.current.y = e.clientY;
    };

    const handleEnterPortal = () => {
        setIsEntering(true);
        const step1 = setTimeout(() => setLoadingStep(1), 1200);
        const step2 = setTimeout(() => setLoadingStep(2), 3200);
        setTimeout(() => {
            clearTimeout(step1); clearTimeout(step2);
            router.push('/login');
        }, 5000);
    };

    return (
        <div 
            ref={containerRef} 
            onMouseMove={handleMouseMove} 
            onMouseEnter={() => setIsMouseInside(true)} 
            onMouseLeave={() => setIsMouseInside(false)} 
            className={`w-full bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-white selection:bg-cyan-500/30 relative font-sans flex flex-col group/container transition-colors duration-500 overflow-x-hidden ${(!isMounted || isEntering) ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}
        >            
            {/* Custom Keyframe Animations */}
            <style>{`
                @keyframes progress-smooth { 
                    0% { width: 0%; opacity: 0; } 
                    10% { opacity: 1; } 
                    100% { width: 100%; opacity: 1; } 
                }
                @keyframes breathe { 
                    0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 30px rgba(6,182,212,0.15); } 
                    50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 80px rgba(6,182,212,0.5); } 
                }
                @keyframes slideUpFade {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes shimmer-text {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes float-icon {
                    0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 2px rgba(34,211,238,0.2)); }
                    50% { transform: translateY(-4px); filter: drop-shadow(0 0 12px rgba(34,211,238,0.8)); }
                }

                .animate-progress-smooth { animation: progress-smooth 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
                .animate-breathe { animation: breathe 5s ease-in-out infinite; }
                .animate-float-icon { animation: float-icon 2.5s ease-in-out infinite; }
            `}</style>

            {/* --- INITIAL BOOT OVERLAY --- */}
            <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-[#020617] pointer-events-none transition-opacity duration-1500 ease-out ${isMounted ? 'opacity-0' : 'opacity-100'}`} />

            {/* --- 3D KINETIC PARALLAX TOPOGRAPHY --- */}
            <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>                
                
                {/* Light Mode Effect */}
                <div className="absolute inset-0 block dark:hidden">
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-60 blur-[80px]" style={{ 
                        background: `radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.5) 0%, transparent 40%), radial-gradient(circle at 60% 60%, rgba(59, 130, 246, 0.4) 0%, transparent 40%)`,
                        transform: `translate(calc(var(--mouse-x) * -0.05), calc(var(--mouse-y) * -0.05))`
                    }} />

                    <div className="absolute inset-0 opacity-25" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, rgba(15, 23, 42, 1) 0, transparent 1px, transparent 200px)`,
                        backgroundPosition: `calc(var(--mouse-x) * 0.08) calc(var(--mouse-y) * 0.08)`
                    }} />

                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            radial-gradient(circle, rgba(15, 23, 42, 0.5) 1.5px, transparent 1.5px),
                            radial-gradient(circle, rgba(15, 23, 42, 0.8) 2.5px, transparent 2.5px)
                        `,
                        backgroundSize: '100px 100px, 180px 180px',
                        backgroundPosition: `
                            calc(var(--mouse-x) * -0.15) calc(var(--mouse-y) * -0.15),
                            calc(var(--mouse-x) * -0.25) calc(var(--mouse-y) * -0.25)
                        `
                    }} />
                </div>

                {/* Dark Mode Effect */}
                <div className="absolute inset-0 hidden dark:block">
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-30 blur-[100px] mix-blend-screen" style={{ 
                        background: `radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 40%)`,
                        transform: `translate(calc(var(--mouse-x) * -0.06), calc(var(--mouse-y) * -0.06))`
                    }} />

                    <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, rgba(34, 211, 238, 0.6) 0, transparent 2px, transparent 250px)`,
                        backgroundPosition: `calc(var(--mouse-x) * 0.1) calc(var(--mouse-y) * 0.1)`
                    }} />

                    <div className="absolute inset-0 mix-blend-screen" style={{
                        backgroundImage: `
                            radial-gradient(circle, rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px),
                            radial-gradient(circle, rgba(34, 211, 238, 0.7) 2.5px, transparent 2.5px),
                            radial-gradient(circle, rgba(99, 102, 241, 0.5) 4px, transparent 4px)
                        `,
                        backgroundSize: '120px 120px, 200px 200px, 350px 350px',
                        backgroundPosition: `
                            calc(var(--mouse-x) * -0.15) calc(var(--mouse-y) * -0.15),
                            calc(var(--mouse-x) * -0.28) calc(var(--mouse-y) * -0.28),
                            calc(var(--mouse-x) * -0.45) calc(var(--mouse-y) * -0.45)
                        `
                    }} />
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className={`relative z-50 w-full px-6 md:px-10 h-20 md:h-24 flex items-center justify-start shrink-0 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isMounted || isEntering ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out border border-transparent dark:border-cyan-300/30">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Rent<span className="text-cyan-600 dark:text-cyan-400">Flow</span></span>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0 text-center transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${!isMounted || isEntering ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>

                {/* Staggered Glyph Reveal Heading */}
                <h1 className="flex flex-col items-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-4 md:mb-8 leading-[1.1] md:leading-none">
                    <span className="block overflow-hidden relative z-10">
                        <span 
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-slate-700 to-indigo-600 dark:from-cyan-300 dark:via-white dark:to-indigo-400 bg-[length:200%_auto] pb-1 md:pb-2"
                            style={{ 
                                opacity: 0, 
                                animation: isMounted ? 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards, shimmer-text 6s linear infinite' : 'none' 
                            }}
                        >
                            Manage
                        </span>
                    </span>
                    <span className="block overflow-hidden -mt-2 sm:-mt-4 lg:-mt-8">
                        <span 
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-slate-700 to-indigo-600 dark:from-cyan-300 dark:via-white dark:to-indigo-400 bg-[length:200%_auto] pb-1 md:pb-2"
                            style={{ 
                                opacity: 0, 
                                animation: isMounted ? 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards, shimmer-text 6s linear infinite' : 'none' 
                            }}
                        >
                            Every Unit.
                        </span>
                    </span>
                </h1>

                <p className={`text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-xl mb-8 md:mb-10 leading-relaxed font-bold transition-all duration-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    "Everything your boarding house needs, in one smart system."                
                </p>

                {/* Primary Button */}
                <div className={`mb-12 md:mb-16 transition-all duration-1000 delay-800 ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <PrimaryButton onClick={handleEnterPortal} isEntering={isEntering} />
                </div>

                {/* --- 2D Smooth Hover Feature Cards --- */}
                <div className={`w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-1000 delay-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <FeatureCard icon="🏢" title="Smart Allocation" desc="Drag and drop residents into optimized room layouts instantly." delay={0} />
                    <FeatureCard icon="⚡" title="Automated Billing" desc="Generate invoices and track overdue balances with zero manual effort." delay={0} />
                    <FeatureCard icon="🛠️" title="Live Maintenance" desc="Track, assign, and resolve property repair requests in real-time." delay={0} />
                </div>
            </main>

            {/* --- LOADING OVERLAY: CLEAN DESIGN --- */}
            {isEntering && (
                <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] animate-in fade-in duration-700 ease-out transition-colors overflow-hidden px-4">
                    
                    {/* Animated Boarding House Icon */}
                    <div className="relative mb-12 flex flex-col items-center justify-center">
                        <svg className="w-24 h-24 md:w-32 md:h-32 relative z-10" fill="none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <defs>
                                <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            
                            <motion.circle cx="32" cy="32" r="16" fill="url(#cyan-glow)" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 0.15, 0], scale: [0.5, 1.5, 2] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }} />
                            <motion.path stroke="url(#cyan-glow)" filter="url(#glow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} d="M8 56h48" />
                            <motion.path stroke="url(#cyan-glow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }} d="M16 56V32L32 16l16 16v24" />
                            <motion.path stroke="currentColor" className="text-cyan-600 dark:text-cyan-500" opacity="0.6" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }} d="M40 24V12h6v18" />
                            <motion.path stroke="currentColor" className="text-cyan-600 dark:text-cyan-400" opacity="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 }} d="M28 56V46a4 4 0 0 1 8 0v10" />

                            <motion.rect x="20" y="28" width="8" height="8" rx="1" stroke="currentColor" className="text-cyan-700 dark:text-cyan-500" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
                            <motion.rect x="36" y="28" width="8" height="8" rx="1" stroke="currentColor" className="text-cyan-700 dark:text-cyan-500" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
                            <motion.rect x="16" y="44" width="8" height="8" rx="1" stroke="currentColor" className="text-cyan-700 dark:text-cyan-500" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
                            <motion.rect x="40" y="44" width="8" height="8" rx="1" stroke="currentColor" className="text-cyan-700 dark:text-cyan-500" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />

                            <motion.rect x="20" y="28" width="8" height="8" rx="1" fill="#06b6d4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.4 }} />
                            <motion.rect x="40" y="44" width="8" height="8" rx="1" fill="#3b82f6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.6 }} />
                            <motion.rect x="16" y="44" width="8" height="8" rx="1" fill="#3b82f6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.8 }} />
                            <motion.rect x="36" y="28" width="8" height="8" rx="1" fill="#06b6d4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 2.0 }} />

                            <motion.circle cx="43" cy="8" r="2" fill="#06b6d4" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.6, 0], y: -10 }} transition={{ duration: 2, delay: 1.5, repeat: Infinity }} />
                            <motion.circle cx="45" cy="4" r="3" fill="#3b82f6" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.4, 0], y: -12 }} transition={{ duration: 2.5, delay: 2, repeat: Infinity }} />
                        </svg>
                    </div>

                    {/* Simple Clean Progress Interface */}
                    <div className="relative flex flex-col items-center w-full max-w-[200px] md:max-w-[260px] mt-4">
                        
                        <div className="relative w-full h-1.5 md:h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 border border-slate-300/50 dark:border-slate-700/50">
                            <div className="absolute top-0 left-0 h-full bg-cyan-500 dark:bg-cyan-400 animate-progress-smooth rounded-full flex justify-end items-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                <div className="absolute right-0 translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-white dark:bg-[#020617] border-2 border-cyan-500 dark:border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] z-20">
                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Text */}
                        <div className="h-6 relative flex items-center justify-center w-full mt-2">
                            {statuses.map((status, index) => (
                                <p key={status} className={`absolute text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ease-out text-center px-4 ${loadingStep === index ? 'opacity-100 translate-y-0 text-slate-800 dark:text-slate-200' : loadingStep > index ? 'opacity-0 -translate-y-2 text-slate-400 dark:text-slate-600' : 'opacity-0 translate-y-2 text-slate-400 dark:text-slate-600'}`}>
                                    {status}
                                </p>
                            ))}
                        </div>
                        
                    </div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <footer className={`relative z-10 w-full shrink-0 h-16 md:h-24 flex flex-col items-center justify-center gap-1.5 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] delay-1200 ${!isMounted || isEntering ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[8px] md:text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-[0.3em] md:tracking-[0.5em] uppercase text-center px-4">Property Management Evolved</p>
                <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-300 font-bold tracking-widest text-center">&copy; {new Date().getFullYear()} RentFlow Systems.</p>
            </footer>
        </div>
    );
}