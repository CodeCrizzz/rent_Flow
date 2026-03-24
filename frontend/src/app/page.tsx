"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isEntering, setIsEntering] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const statuses = [
        "Loading...",
        "Initializing...",
        "Redirecting to Log-in page..."
    ];

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleEnterPortal = () => {
        setIsEntering(true);
        
        // Smoothly transition the status text
        const step1 = setTimeout(() => setLoadingStep(1), 1000);
        const step2 = setTimeout(() => setLoadingStep(2), 3000);

        setTimeout(() => {
            clearTimeout(step1);
            clearTimeout(step2);
            router.push('/login');
        }, 5000);
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="h-screen w-full bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden relative font-sans flex flex-col group/container"
        >
            <style>{`
                @keyframes progress-smooth {
                    0% { width: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    100% { width: 100%; opacity: 1; }
                }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; shadow-[0_0_40px_rgba(99,102,241,0.5)]; }
                }
                .animate-progress-smooth {
                    animation: progress-smooth 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
                }
                .animate-breathe {
                    animation: breathe 3s ease-in-out infinite;
                }
            `}</style>

            {/* Ambient Mouse Tracking Glow */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.12), transparent 80%)`
                }}
            />

            <header className={`relative z-50 w-full px-10 h-24 flex items-center justify-start transition-all duration-1000 ease-out ${isEntering ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-500">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">
                        Rent<span className="text-indigo-400">Flow</span>
                    </span>
                </div>
            </header>

            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] -mt-24 ${isEntering ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-10">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                    In Development
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
                    Simplify <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-500 to-blue-400">
                        Everything.
                    </span>
                </h1>

                <p className="text-zinc-500 text-sm md:text-base max-w-sm mb-12 leading-relaxed font-medium">
                    The modern operating system for landlords and tenants. Manage your ecosystem in one crisp, fluid frame.
                </p>

                <button onClick={handleEnterPortal} className="relative group inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    <span className="relative z-10 flex items-center gap-3">
                        Enter Portal
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                </button>
            </main>

            {/* LOADING OVERLAY */}
            {isEntering && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-3xl animate-in fade-in duration-1000 ease-out">
                    
                    {/* Deep Ambient*/}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                    
                    {/* Center Icon */}
                    <div className="relative mb-12 animate-breathe flex flex-col items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="relative w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] rounded-full animate-progress-smooth"></div>
                    </div>
                    
                    {/* Dissolving Status Text */}
                    <div className="h-6 relative flex items-center justify-center overflow-hidden w-full">
                        {statuses.map((status, index) => (
                            <p 
                                key={status}
                                className={`absolute text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-700 ease-in-out ${
                                    loadingStep === index 
                                        ? 'opacity-100 translate-y-0 text-zinc-300' 
                                        : loadingStep > index 
                                            ? 'opacity-0 -translate-y-4 text-zinc-500' 
                                            : 'opacity-0 translate-y-4 text-zinc-500'
                                }`}
                            >
                                {status}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <footer className={`relative z-10 w-full h-24 flex flex-col items-center justify-center gap-2 transition-all duration-1000 ease-out ${isEntering ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[9px] font-bold text-zinc-700 tracking-[0.4em] uppercase">Built for the future of living</p>
                <p className="text-[10px] text-zinc-600 font-medium tracking-wide">&copy; {new Date().getFullYear()} RentFlow. All rights reserved.</p>
            </footer>
        </div>
    );
}