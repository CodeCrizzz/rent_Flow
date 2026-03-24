"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isEntering, setIsEntering] = useState(false);

    // mouse tracking
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
        
        // 3000ms (3 seconds)
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="h-screen w-full bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden relative font-sans flex flex-col group/container"
        >
            
            {/* --- INTERACTIVE GLOW --- */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/container:opacity-100 transition-opacity duration-700"
                style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.2), transparent 80%)`
                }}
            />

            {/* --- NAVBAR --- */}
            <header className={`relative z-50 w-full px-10 h-24 flex items-center justify-start transition-all duration-1000 ${isEntering ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
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
            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-1000 -mt-24 ${isEntering ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></span>
                    In Development
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Simplify <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-500 to-blue-400">
                        Everything.
                    </span>
                </h1>

                <p className="text-zinc-500 text-sm md:text-base max-w-sm mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 leading-relaxed font-medium">
                    A modern system for landlords and tenants. Manage everything in one place.
                </p>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                    <button 
                        onClick={handleEnterPortal}
                        className="relative group inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10 flex items-center gap-3">
                            Enter Portal
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </main>

            {/* --- LOADING OVERLAY --- */}
            {isEntering && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-3xl animate-in fade-in duration-700">
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Outer Glow */}
                        <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                        
                        {/* Spinning Rings */}
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500/80 animate-spin" style={{ animationDuration: '1s' }}></div>
                            <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-400/80 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                            <div className="absolute inset-4 rounded-full border-t-2 border-indigo-300/60 animate-spin" style={{ animationDuration: '2s' }}></div>
                            
                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Animated Text Sequence */}
                    <div className="relative h-6 flex justify-center items-center overflow-hidden w-64">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.5em] absolute opacity-0 animate-[load-step-1_3s_forwards]">
                            Initializing
                        </p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.5em] absolute opacity-0 animate-[load-step-2_3s_forwards]">
                            Authenticating
                        </p>
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.5em] absolute opacity-0 animate-[load-step-3_3s_forwards]">
                            Entering Portal
                        </p>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse"></div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <footer className={`relative z-10 w-full py-8 flex flex-col items-center justify-center transition-all duration-1000 ${isEntering ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[9px] font-bold text-zinc-700 tracking-[0.4em] uppercase flex flex-col items-center text-center gap-2">
                    Built for the future of living
                    <span className="text-indigo-500">© 2026 RentFlow. All rights reserved.</span> 
                    <span className="text-indigo-500">Created by CodeCrizzz</span>   
                </p>
            </footer>

            <style jsx global>{`
                @keyframes load-step-1 {
                    0%, 25% { transform: translateY(0); opacity: 1; filter: blur(0); }
                    30%, 100% { transform: translateY(-20px); opacity: 0; filter: blur(2px); }
                }
                @keyframes load-step-2 {
                    0%, 25% { transform: translateY(20px); opacity: 0; filter: blur(2px); }
                    30%, 60% { transform: translateY(0); opacity: 1; filter: blur(0); }
                    65%, 100% { transform: translateY(-20px); opacity: 0; filter: blur(2px); }
                }
                @keyframes load-step-3 {
                    0%, 60% { transform: translateY(20px); opacity: 0; filter: blur(2px); }
                    65%, 100% { transform: translateY(0); opacity: 1; filter: blur(0); }
                }
            `}</style>
        </div>
    );
}