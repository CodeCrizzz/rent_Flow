"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Ultra-Premium Glass Card ---
const FeatureCard = ({ title, desc, icon, delay }: { title: string, desc: string, icon: string, delay: number }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[300px] sm:max-w-xs md:max-w-full mx-auto group cursor-pointer"
        >
            {/* Soft Hover Glow */}
            <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-20 blur-[10px] transition-opacity duration-500"></div>
            
            {/* Main Card Body */}
            <div className="relative h-full p-8 rounded-[2.5rem] bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl dark:group-hover:shadow-none group-hover:border-cyan-200 dark:group-hover:border-white/20">
                
                {/* Diagonal Glass Shimmer */}
                <div className="absolute top-0 -left-[100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent rotate-45 group-hover:animate-[shimmer_1.5s_forwards] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-14 h-14 mb-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        {icon}
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-black text-xl mb-3 tracking-tight">{title}</h3>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Clean Action Button ---
const PrimaryButton = ({ onClick, isEntering }: { onClick: () => void, isEntering: boolean }) => {
    return (
        <button 
            onClick={onClick}
            className={`relative group inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-4 px-8 py-4 sm:px-10 sm:py-5 bg-slate-900 dark:bg-white rounded-full transition-all duration-300">
                <span className="font-bold text-xs sm:text-sm uppercase tracking-widest text-white dark:text-slate-900">
                    Access Platform
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 text-white dark:text-slate-900">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-7-7l7 7-7 7"></path></svg>
                </div>
            </span>
        </button>
    );
};

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    
    const [isMounted, setIsMounted] = useState(false);
    const [isEntering, setIsEntering] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const statuses = ["Establishing secure link...", "Syncing property data...", "Entering RentFlow OS..."];

    // --- BULLETPROOF SCROLL LOCK ---
    useEffect(() => {
        if (!isMounted || isEntering) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMounted, isEntering]);

    useEffect(() => {
        const mountTimer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(mountTimer);
    }, []);

    const handleEnterPortal = () => {
        setIsEntering(true);
        const step1 = setTimeout(() => setLoadingStep(1), 1500);
        const step2 = setTimeout(() => setLoadingStep(2), 3500);
        setTimeout(() => {
            clearTimeout(step1); clearTimeout(step2);
            router.push('/login');
        }, 5000);
    };

    return (
        <div ref={containerRef} className={`w-full bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-white selection:bg-cyan-500/30 relative font-sans flex flex-col transition-colors duration-500 md:h-[100dvh] md:overflow-hidden ${(!isMounted || isEntering) ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh] overflow-x-hidden'}`}>
            
            <style>{`
                @keyframes progress-smooth { 0% { width: 0%; opacity: 0; } 10% { opacity: 1; } 100% { width: 100%; opacity: 1; } }
                @keyframes breathe { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-5px) scale(1.02); } }
                @keyframes shimmer { 100% { left: 150%; } }
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
                
                .animate-progress-smooth { animation: progress-smooth 3.5s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
                .animate-breathe { animation: breathe 6s ease-in-out infinite; }
                .animate-scanline { animation: scanline 2s linear infinite; }
            `}</style>

            {/* --- INITIAL BOOT OVERLAY --- */}
            <div className={`fixed inset-0 z-[200] bg-[#f8fafc] dark:bg-[#020617] pointer-events-none transition-opacity duration-1000 ease-out ${isMounted ? 'opacity-0' : 'opacity-100'}`} />

            {/* --- ARCHITECTURAL BACKGROUND --- */}
            <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-1500 ease-in-out ${isMounted && !isEntering ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Soft Structural Glows */}
                <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] animate-breathe opacity-80"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-[100px] animate-breathe opacity-60" style={{ animationDelay: '2s' }}></div>
                
                {/* Clean Blueprint/Floorplan Grid */}
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]" 
                     style={{ 
                         backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`, 
                         backgroundSize: '40px 40px',
                         maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
                         WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
                     }}>
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className={`relative z-50 w-full px-6 md:px-12 h-24 flex items-center justify-between shrink-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isMounted || isEntering ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-sm">
                        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight">RentFlow</span>
                </div>
                
                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-widest">System Active</span>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-0 text-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${!isMounted || isEntering ? 'opacity-0 scale-[0.95] blur-xl' : 'opacity-100 scale-100 blur-0'}`}>

                {/* Clean Headline */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={isMounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.05] relative z-10"
                >
                    <span className="text-slate-900 dark:text-white">Property Management,</span><br/>
                    <span className="text-blue-600 dark:text-cyan-400">
                        Simplified.
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={isMounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-slate-600 dark:text-zinc-400 text-sm md:text-lg max-w-2xl mb-14 font-medium leading-relaxed px-4"
                >
                    The definitive operating system for modern boarding houses. Fully automate your billing, unify tenant communications, and command your property in real-time.
                </motion.p>

                {/* Action Button */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isMounted ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.5, type: "spring" }} className="mb-16 md:mb-24 z-20 relative">
                    <PrimaryButton onClick={handleEnterPortal} isEntering={isEntering} />
                </motion.div>

                {/* --- Clean Feature Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full relative z-10">
                    <FeatureCard delay={0.6} icon="🎯" title="Intelligent Layouts" desc="Visually assign residents to rooms and monitor capacity with a unified dashboard." />
                    <FeatureCard delay={0.7} icon="💸" title="Financial Autopilot" desc="Invoices are generated and tracked automatically. Never miss a due date again." />
                    <FeatureCard delay={0.8} icon="🔧" title="Live Maintenance" desc="Tenants report issues instantly. You dispatch and track repairs in real-time." />
                </div>
            </main>

            {/* --- CINEMATIC HOLOGRAPHIC BOOT OVERLAY --- */}
            <AnimatePresence>
                {isEntering && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#020617]"
                    >
                        {/* Background Spotlight */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_60%)]"></div>
                        
                        <div className="relative mb-12 flex flex-col items-center justify-center z-10 animate-breathe">
                            
                            {/* Hologram Emitter Base Glow */}
                            <div className="absolute -bottom-6 w-40 h-8 bg-cyan-500/20 blur-[20px] rounded-full"></div>

                            {/* The Projection Cube */}
                            <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-[0_20px_50px_-10px_rgba(6,182,212,0.15)] flex items-center justify-center overflow-hidden">
                                
                                {/* Laser Scanline Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scanline z-20 opacity-40"></div>
                                
                                {/* SVG Hologram */}
                                <svg className="w-24 h-24 md:w-28 md:h-28 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" fill="none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0ea5e9" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Holographic Wireframe Construction */}
                                    <motion.path stroke="url(#holo-grad)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} d="M8 56h48" />
                                    <motion.path stroke="url(#holo-grad)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }} d="M16 56V32L32 16l16 16v24" />
                                    
                                    {/* Tech Grid Floor / Perspective lines */}
                                    <motion.path stroke="#22d3ee" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} d="M16 56l-6 6M48 56l6 6M32 56v8" />

                                    <motion.path stroke="currentColor" className="text-cyan-500" opacity="0.7" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} d="M40 24V12h6v18" />
                                    <motion.path stroke="url(#holo-grad)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} d="M28 56V46a4 4 0 0 1 8 0v10" />

                                    {/* Smart Nodes (Rooms Booting Up) */}
                                    <motion.rect x="20" y="28" width="8" height="8" rx="2" fill="none" stroke="url(#holo-grad)" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
                                    <motion.rect x="36" y="28" width="8" height="8" rx="2" fill="none" stroke="url(#holo-grad)" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
                                    <motion.rect x="16" y="44" width="8" height="8" rx="2" fill="none" stroke="url(#holo-grad)" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
                                    <motion.rect x="40" y="44" width="8" height="8" rx="2" fill="none" stroke="url(#holo-grad)" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />

                                    {/* Solid fill coming online */}
                                    <motion.rect x="20" y="28" width="8" height="8" rx="2" fill="url(#holo-grad)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.2, type: "spring" }} />
                                    <motion.rect x="40" y="44" width="8" height="8" rx="2" fill="url(#holo-grad)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.4, type: "spring" }} />
                                    <motion.rect x="16" y="44" width="8" height="8" rx="2" fill="url(#holo-grad)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.6, type: "spring" }} />
                                    <motion.rect x="36" y="28" width="8" height="8" rx="2" fill="url(#holo-grad)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.8, type: "spring" }} />
                                </svg>
                            </div>
                        </div>

                        {/* Loading Typography Base */}
                        <div className="mb-10 flex items-center justify-center z-10 animate-breathe">
                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                                RentFlow
                            </span>
                        </div>

                        {/* Minimal Progress Tracker */}
                        <div className="relative w-[75vw] max-w-[280px] h-[3px] bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-8 z-10">
                            <div className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-cyan-400 rounded-full animate-progress-smooth"></div>
                        </div>
                        
                        {/* Terminal Text Output */}
                        <div className="h-6 relative flex items-center justify-center w-full z-10">
                            {statuses.map((status, index) => (
                                <p key={status} className={`absolute text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 text-center px-4 ${loadingStep === index ? 'opacity-100 scale-100 text-blue-600 dark:text-cyan-400' : loadingStep > index ? 'opacity-0 scale-105 blur-sm text-slate-400' : 'opacity-0 scale-95 blur-sm text-slate-400'}`}>
                                    {status}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- FOOTER --- */}
            <footer className={`relative z-10 w-full shrink-0 h-24 flex flex-col items-center justify-center transition-all duration-1000 delay-500 ${!isMounted || isEntering ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase">RentFlow System © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}