"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

// --- Smooth 2D Hover Feature Card Component ---
const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => {
    return (
        <div className="relative w-full max-w-[300px] sm:max-w-xs md:max-w-full mx-auto group cursor-pointer">
            {/* Outer Ambient Glow (Fades in on hover) */}
            <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
            
            {/* Main Card Body */}
            <div className="relative h-full p-6 rounded-2xl bg-white/60 dark:bg-cyan-950/20 border border-slate-200/80 dark:border-cyan-500/30 backdrop-blur-md text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.02] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] dark:hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)]">
                
                {/* Inner Glass Glare (Fades in on hover) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out bg-linear-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>
                
                {/* Animated Icon */}
                <div className="text-3xl mb-4 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 origin-bottom-left drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    {icon}
                </div>
                
                <h3 className="text-slate-800 dark:text-white font-black text-lg mb-2 relative z-10">{title}</h3>
                <p className="text-slate-500 dark:text-cyan-100/60 text-xs font-medium leading-relaxed relative z-10">{desc}</p>
            </div>
        </div>
    );
};

// --- Hover Button Component ---
const PrimaryButton = ({ onClick, isEntering }: { onClick: () => void, isEntering: boolean }) => {
    return (
        <button 
            onClick={onClick}
            className={`relative group inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-cyan-600 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 dark:via-cyan-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                Enter Login-portal
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

    const statuses = ["Loading...", "Connecting to RentFlow Database..."];

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
        // Adjust for scrolled position on mobile
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
        /* Replaced h-screen max-h-screen overflow-hidden with min-h-[100dvh] overflow-x-hidden so mobile can scroll */
        <div ref={containerRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsMouseInside(true)} onMouseLeave={() => setIsMouseInside(false)} className="min-h-[100dvh] w-full bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-white selection:bg-cyan-500/30 overflow-x-hidden relative font-sans flex flex-col group/container transition-colors duration-500">
            
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

            {/* --- HIGH VISIBILITY TRACKING ENGINE --- */}
            {/* Changed absolute inset-0 to fixed inset-0 so background stays put while scrolling */}
            <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ease-out ${isMounted && isMouseInside ? 'opacity-100' : 'opacity-0'}`}>                
                {/* Light Mode Effect */}
                <div className="absolute inset-0 block dark:hidden">                    {/* Stronger Cyan Spotlight */}
                    <div className="absolute inset-0" style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.30), transparent 70%)` }} />
                    {/* Clearer Blueprint Grid */}
                    <div className="absolute inset-0 opacity-60" style={{
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.8) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(6, 182, 212, 0.8) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px, 80px 80px',
                        backgroundPosition: '-1px -1px, -1px -1px',
                        WebkitMaskImage: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), black 30%, transparent 80%)`,
                        maskImage: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), black 30%, transparent 80%)`
                    }} />
                </div>

                {/* Dark Mode Effect */}
                <div className="absolute inset-0 hidden dark:block">
                    {/* Stronger Amber Spotlight */}
                    <div className="absolute inset-0 opacity-100" style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.25), transparent 70%)` }} />
                    {/* Bold Blueprint Grid */}
                    <div className="absolute inset-0 opacity-100" style={{
                        backgroundImage: `
                            linear-gradient(rgba(34, 211, 238, 0.6) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(34, 211, 238, 0.6) 1px, transparent 1px), 
                            linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                        backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
                        WebkitMaskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 15%, transparent 90%)`,
                        maskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 15%, transparent 90%)`
                    }} />
                </div>
            </div>

            {/* --- HEADER --- */}
            <header className={`relative z-50 w-full px-6 md:px-10 h-20 md:h-24 flex items-center justify-start shrink-0 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isMounted || isEntering ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out border border-transparent dark:border-cyan-300/30">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Rent<span className="text-cyan-600 dark:text-cyan-400">Flow</span></span>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 md:py-0 text-center transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${!isMounted || isEntering ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>

                {/* Staggered Glyph Reveal Heading - Adjusted scaling for mobile */}
                <h1 className="flex flex-col items-center text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-6 md:mb-8 leading-none">
                    <span className="block overflow-hidden relative z-10">
                        <span 
                            className="inline-block text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-slate-700 to-indigo-600 dark:from-cyan-300 dark:via-white dark:to-indigo-400 bg-size-[200%_auto] pb-2"
                            style={{ 
                                opacity: 0, 
                                animation: isMounted ? 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards, shimmer-text 6s linear infinite' : 'none' 
                            }}
                        >
                            Manage
                        </span>
                    </span>
                    <span className="block overflow-hidden -mt-1 sm:-mt-4 lg:-mt-8">
                        <span 
                            className="inline-block text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-slate-700 to-indigo-600 dark:from-cyan-300 dark:via-white dark:to-indigo-400 bg-size-[200%_auto] pb-2"
                            style={{ 
                                opacity: 0, 
                                animation: isMounted ? 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards, shimmer-text 6s linear infinite' : 'none' 
                            }}
                        >
                            Every Unit.
                        </span>
                    </span>
                </h1>

                <p className={`text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base max-w-xs sm:max-w-xl mb-8 md:mb-10 leading-relaxed font-bold transition-all duration-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    "Everything your boarding house needs, in one smart system."                
                </p>

                {/* Primary Button */}
                <div className={`mb-12 md:mb-16 transition-all duration-1000 delay-800 ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <PrimaryButton onClick={handleEnterPortal} isEntering={isEntering} />
                </div>

                {/* --- 2D Smooth Hover Feature Cards --- */}
                {/* Mobile stacks vertically, desktop places side by side */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto w-full transition-all duration-1000 delay-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <FeatureCard icon="🏢" title="Smart Allocation" desc="Drag and drop residents into optimized room layouts instantly." />
                    <FeatureCard icon="⚡" title="Automated Billing" desc="Generate invoices and track overdue balances with zero manual effort." />
                    <FeatureCard icon="🛠️" title="Live Maintenance" desc="Track, assign, and resolve property repair requests in real-time." />
                </div>
            </main>

            {/* --- LOADING OVERLAY --- */}
            {isEntering && (
                <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] animate-in fade-in duration-700 ease-out transition-colors">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.08) 0%, transparent 40%)' }}></div>
                    
                    <div className="relative mb-12 md:mb-16 flex items-center gap-4 md:gap-5 animate-breathe bg-white/70 dark:bg-slate-900/40 backdrop-blur-md px-6 py-5 md:px-8 md:py-6 rounded-3xl border border-cyan-100 dark:border-cyan-500/20 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)]">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] dark:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-transparent dark:border-cyan-300/40 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl animate-pulse"></div>
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white relative z-10 animate-float-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        
                        <div className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            Rent<span className="text-cyan-600 dark:text-cyan-400">Flow</span>
                        </div>
                    </div>
                    
                    {/* Progress Bar constrained to avoid mobile overflow */}
                    <div className="relative w-[80vw] max-w-[320px] h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-visible mb-8 border border-slate-300 dark:border-slate-700/50">
                        <div className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 via-cyan-400 to-teal-300 rounded-full animate-progress-smooth flex justify-end items-center shadow-[0_0_10px_rgba(34,211,238,0.4)] dark:shadow-[0_0_20px_rgba(34,211,238,0.7)]">
                            <div className="absolute right-0 translate-x-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-[#020617] border-2 border-cyan-500 dark:border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_20px_rgba(34,211,238,0.9)] z-20 overflow-hidden group">
                                <div className="absolute inset-0 bg-cyan-400/20 animate-[spin_3s_linear_infinite]"></div>
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 dark:text-cyan-300 animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-6 relative flex items-center justify-center w-full">
                        {statuses.map((status, index) => (
                            <p key={status} className={`absolute text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ease-out text-center px-4 ${loadingStep === index ? 'opacity-100 translate-y-0 text-cyan-700 dark:text-cyan-100 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : loadingStep > index ? 'opacity-0 -translate-y-4 text-slate-400 dark:text-slate-500' : 'opacity-0 translate-y-4 text-slate-400 dark:text-slate-500'}`}>
                                {status}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <footer className={`relative z-10 w-full shrink-0 h-20 md:h-24 flex flex-col items-center justify-center gap-1.5 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] delay-1200 ${!isMounted || isEntering ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[8px] md:text-[9px] font-black text-slate-500 dark:text-slate-400 tracking-[0.3em] md:tracking-[0.5em] uppercase text-center">Property Management Evolved</p>
                <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-300 font-bold tracking-widest text-center">&copy; {new Date().getFullYear()} RentFlow Systems.</p>
            </footer>
        </div>
    );
}