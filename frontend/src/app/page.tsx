"use client";
import Link from 'next/link';
import { useRef } from 'react';

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    // High-performance mouse tracking using CSS variables
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="h-screen w-full bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden relative font-sans flex flex-col group/container"
        >
            
            {/* --- THE ENHANCED INTERACTIVE GLOW --- */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-700"
                style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.25), transparent 80%)`
                }}
            />
            
            {/* Secondary High-Intensity Spotlight */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000 blur-[100px]"
                style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 100%)`
                }}
            />

            {/* Static Background Orbs (Depth Layer) */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"></div>

            {/* --- NAVBAR --- */}
            <header className="relative z-20 w-full px-10 h-24 flex items-center justify-center sm:justify-start">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">
                        Rent<span className="text-indigo-500">Flow</span>
                    </span>
                </div>
            </header>

            {/* --- HERO CONTENT --- */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-12">
                
                {/* 1. Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></span>
                    Comming Soon!!!
                </div>

                {/* 2. Main Headline */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Less hassle.  <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-500 to-blue-400">
                        More control.
                    </span>
                </h1>

                {/* 3. Subheadline */}
                <p className="text-zinc-500 text-sm md:text-base max-w-sm mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 leading-relaxed font-medium">
                    “A modern system for landlords and tenants simple, smooth, and efficient.
                </p>

                {/* 4. The Action Button */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                    <Link 
                        href="/login" 
                        className="relative group inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        {/* Magnetic Shine Effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        
                        <span className="relative z-10 flex items-center gap-3">
                            Enter Portal
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </Link>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 w-full h-20 flex items-center justify-center px-10 animate-in fade-in duration-1000 delay-1000">
                <p className="text-[9px] font-bold text-zinc-700 tracking-[0.4em] uppercase">
                    Built for the future of living
                </p>
            </footer>

        </div>
    );
}