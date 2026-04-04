"use client";
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

// --- 3D Tilt Feature Card Component ---
const TiltCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateY = ((mouseX / width) - 0.5) * 30; 
        const rotateX = ((mouseY / height) - 0.5) * -30;

        setTilt({ rotateX, rotateY, glareX: (mouseX / width) * 100, glareY: (mouseY / height) * 100 });
    };

    return (
        <div 
            className="perspective-[1000px] w-full max-w-xs"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 }); }}
            onMouseMove={handleMouseMove}
        >
            <div 
                ref={cardRef}
                className="relative p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 backdrop-blur-sm text-left transition-all duration-200 ease-out overflow-hidden group cursor-pointer"
                style={{
                    transform: isHovered ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.05, 1.05, 1.05)` : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                    transformStyle: 'preserve-3d',
                    boxShadow: isHovered ? '0 20px 40px rgba(6,182,212,0.3)' : '0 4px 10px rgba(0,0,0,0.5)'
                }}
            >
                <div 
                    className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)` }}
                />
                
                <div className="text-3xl mb-4 transform translate-z-12">{icon}</div>
                <h3 className="text-white font-black text-lg mb-2 transform translate-z-10">{title}</h3>
                <p className="text-cyan-100/60 text-xs font-medium transform translate-z-8 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

// --- Standard Hover Button Component ---
const PrimaryButton = ({ onClick, isEntering }: { onClick: () => void, isEntering: boolean }) => {
    return (
        <button 
            onClick={onClick}
            className={`relative group inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] ${isEntering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                Access Matrix
                <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1.5 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </span>
        </button>
    );
};

// --- Main Landing Page Component ---
export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isEntering, setIsEntering] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseCurrent = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    const statuses = ["Loading Property Matrix...", "Connecting to RentFlow Database...", "Opening Admin Portal..."];

    useEffect(() => {
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
        return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseTarget.current.x = e.clientX - left;
        mouseTarget.current.y = e.clientY - top;
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
        <div ref={containerRef} onMouseMove={handleMouseMove} className="h-screen max-h-screen w-full bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden relative font-sans flex flex-col group/container">
            
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
                @keyframes equalizer {
                    0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
                    50% { transform: scaleY(1); opacity: 1; box-shadow: 0 0 15px rgba(34,211,238,0.8); }
                }

                .animate-progress-smooth { animation: progress-smooth 2.8s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
                .animate-breathe { animation: breathe 5s ease-in-out infinite; }
                .animate-float-icon { animation: float-icon 2.5s ease-in-out infinite; }
            `}</style>

            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-[2000ms] ease-out opacity-0 group-hover/container:opacity-100">
                
                <div className="absolute inset-0" style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.15), transparent 70%)` }} />
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px), 
                        linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                    backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
                    WebkitMaskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 90%)`,
                    maskImage: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 90%)`
                }} />
            </div>

            {/* --- HEADER --- */}
            <header className={`relative z-50 w-full px-10 h-24 flex items-center justify-start transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isEntering ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ease-out border border-cyan-300/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">Rent<span className="text-cyan-400">Flow</span></span>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isEntering ? 'opacity-0 scale-90 blur-3xl' : 'opacity-100 scale-100 blur-0'}`}>
                
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-400/20 text-cyan-300 text-[10px] uppercase font-black tracking-[0.3em] mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)] animate-pulse"></span>
                    Property Matrix Online
                </div>

                {/* Staggered Glyph Reveal Heading */}
                <h1 className="flex flex-col items-center text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.9]">
                    <span className="block overflow-hidden pb-2 pt-4">
                        <span 
                            className="inline-block"
                            style={{ opacity: 0, animation: 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }}
                        >
                            Manage
                        </span>
                    </span>
                    <span className="block overflow-hidden pb-4 pt-2">
                        <span 
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-indigo-400 bg-[length:200%_auto] drop-shadow-[0_0_40px_rgba(6,182,212,0.3)]"
                            style={{ opacity: 0, animation: 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards, shimmer-text 6s linear infinite' }}
                        >
                            Every Unit.
                        </span>
                    </span>
                </h1>

                <p className="text-slate-300 text-sm md:text-base max-w-md mb-10 leading-relaxed font-bold animate-in fade-in duration-1000 delay-500 fill-mode-both">
                    The intelligent operating system for modern boarding houses. Track tenants, monitor rooms, and automate billing.
                </p>

                {/* Primary Button */}
                <div className="mb-16 animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
                    <PrimaryButton onClick={handleEnterPortal} isEntering={isEntering} />
                </div>

                {/* 3D Tilt Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
                    <TiltCard icon="🏢" title="Smart Allocation" desc="Drag and drop residents into optimized room layouts instantly." />
                    <TiltCard icon="⚡" title="Automated Billing" desc="Generate invoices and track overdue balances with zero manual effort." />
                    <TiltCard icon="🛠️" title="Live Maintenance" desc="Track, assign, and resolve property repair requests in real-time." />
                </div>
            </main>

            {/* --- LOADING OVERLAY --- */}
            {isEntering && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] animate-in fade-in duration-700 ease-out backdrop-blur-sm">
                    {/* Background glow for overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
                    </div>
                    
                    {/* Official Logo Container */}
                    <div className="relative mb-16 flex items-center gap-4 animate-breathe">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-300/40 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                            <svg className="w-8 h-8 text-white relative z-10 animate-float-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        
                        <div className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            Rent<span className="text-cyan-400">Flow</span>
                        </div>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="relative w-[320px] h-2 bg-slate-800/80 rounded-full overflow-visible mb-8 border border-slate-700/50">
                        {/* Progress Fill */}
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 rounded-full animate-progress-smooth flex justify-end items-center shadow-[0_0_20px_rgba(34,211,238,0.7)]">
                            {/* Icon tracing the progress bar */}
                            <div className="absolute right-0 translate-x-1/2 w-10 h-10 bg-[#020617] border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.9)] z-20 overflow-hidden group">
                                <div className="absolute inset-0 bg-cyan-400/20 animate-[spin_3s_linear_infinite]"></div>
                                <svg className="w-5 h-5 text-cyan-300 animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Text */}
                    <div className="h-6 relative flex items-center justify-center w-full">
                        {statuses.map((status, index) => (
                            <p key={status} className={`absolute text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ease-out ${loadingStep === index ? 'opacity-100 translate-y-0 text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : loadingStep > index ? 'opacity-0 -translate-y-4 text-slate-500' : 'opacity-0 translate-y-4 text-slate-500'}`}>
                                {status}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <footer className={`relative z-10 w-full h-24 flex flex-col items-center justify-center gap-2 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isEntering ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[9px] font-black text-slate-400 tracking-[0.5em] uppercase">Property Management Evolved</p>
                <p className="text-[10px] text-slate-300 font-bold tracking-widest">&copy; {new Date().getFullYear()} RentFlow Systems.</p>
            </footer>
        </div>
    );
}