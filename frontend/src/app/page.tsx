"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isEntering, setIsEntering] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const statuses = [
        "Loading Property Matrix...",
        "Connecting to RentFlow Database...",
        "Opening Admin Portal..."
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
        
        const step1 = setTimeout(() => setLoadingStep(1), 1200);
        const step2 = setTimeout(() => setLoadingStep(2), 3200);

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
            className="h-screen w-full bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden relative font-sans flex flex-col group/container"
        >
            <style>{`
                @keyframes progress-smooth {
                    0% { width: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    100% { width: 100%; opacity: 1; }
                }
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 20px rgba(6,182,212,0.2); }
                    50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 60px rgba(6,182,212,0.6); }
                }
                .animate-progress-smooth {
                    animation: progress-smooth 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
                }
                .animate-breathe {
                    animation: breathe 4s ease-in-out infinite;
                }
            `}</style>

            {/* --- ARCHITECTURAL BLUEPRINT TRACKING ENGINE --- */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                
                {/* Layer 1: Warm "Room/Window" Illumination */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000 ease-out"
                    style={{
                        background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.08), transparent 50%)`
                    }}
                />
                
                {/* Layer 2: The Architectural Blueprint Grid */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-700 ease-out"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                        backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
                        /* Mask to only show the blueprint near the mouse */
                        WebkitMaskImage: `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), black 5%, transparent 100%)`,
                        maskImage: `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), black 5%, transparent 100%)`
                    }}
                />

                {/* Layer 3: Scanner Crosshairs */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover/container:opacity-50 transition-opacity duration-300"
                    style={{
                        background: `
                            linear-gradient(to right, transparent calc(var(--mouse-x) - 1px), rgba(6, 182, 212, 0.5) var(--mouse-x), transparent calc(var(--mouse-x) + 1px)),
                            linear-gradient(to bottom, transparent calc(var(--mouse-y) - 1px), rgba(6, 182, 212, 0.5) var(--mouse-y), transparent calc(var(--mouse-y) + 1px))
                        `,
                        WebkitMaskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
                        maskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`
                    }}
                />
            </div>
            {/* ------------------------------------- */}

            <header className={`relative z-50 w-full px-10 h-24 flex items-center justify-start transition-all duration-1000 ease-out ${isEntering ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-cyan-400/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">
                        Rent<span className="text-cyan-400">Flow</span>
                    </span>
                </div>
            </header>

            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] -mt-24 ${isEntering ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-black tracking-[0.3em] mb-10 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-colors hover:bg-cyan-900/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse"></span>
                    Property Matrix Online
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
                    Manage <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                        Every Unit.
                    </span>
                </h1>

                <p className="text-slate-400 text-sm md:text-base max-w-md mb-12 leading-relaxed font-medium">
                    The intelligent operating system for modern boarding houses. Track tenants, monitor rooms, and automate billing in one fluid space.
                </p>

                <button onClick={handleEnterPortal} className="relative group inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <span className="relative z-10 flex items-center gap-3">
                        Access Matrix
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </span>
                </button>
            </main>

            {/* LOADING OVERLAY */}
            {isEntering && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]/90 backdrop-blur-3xl animate-in fade-in duration-1000 ease-out">
                    
                    {/* Deep Architectural Ambient */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                    
                    <div className="relative mb-16 animate-breathe flex flex-col items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)] border border-white/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Scanner Progress Track */}
                    <div className="relative w-72 h-[2px] bg-white/10 rounded-full overflow-hidden mb-10">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,1)] rounded-full animate-progress-smooth"></div>
                    </div>
                    
                    <div className="h-6 relative flex items-center justify-center overflow-hidden w-full">
                        {statuses.map((status, index) => (
                            <p 
                                key={status}
                                className={`absolute text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    loadingStep === index 
                                        ? 'opacity-100 translate-y-0 text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                                        : loadingStep > index 
                                            ? 'opacity-0 -translate-y-8 text-slate-600 blur-sm' 
                                            : 'opacity-0 translate-y-8 text-slate-600 blur-sm'
                                }`}
                            >
                                {status}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <footer className={`relative z-10 w-full h-24 flex flex-col items-center justify-center gap-2 transition-all duration-1000 ease-out ${isEntering ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[9px] font-black text-slate-600 tracking-[0.5em] uppercase">Property Management Evolved</p>
                <p className="text-[10px] text-slate-700 font-bold tracking-widest">&copy; {new Date().getFullYear()} RentFlow Systems.</p>
            </footer>
        </div>
    );
}