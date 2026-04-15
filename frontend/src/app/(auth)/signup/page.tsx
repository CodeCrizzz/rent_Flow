"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const router = useRouter();

    useEffect(() => { setIsMounted(true); }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (password !== confirmPassword) {
            return setErrorMsg("Passwords do not match. Please try again.");
        }

        setIsLoading(true);
        try {
            await api.post('/auth/register', { name, email, phone, gender, address, password, role: 'tenant' });
            setShowSuccessModal(true);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.message || "Registration Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Use 100dvh to fix mobile browser address bar clipping */
        <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0a0a0a] relative overflow-hidden font-sans">
            
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] sm:h-[500px] bg-linear-to-b from-blue-600/10 to-transparent blur-[60px] sm:blur-[100px] rounded-full pointer-events-none transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0 scale-50'}`}></div>
            
            {/* Main Wrapper */}
            <div className={`w-full max-w-5xl bg-zinc-950 rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/5 transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-md'}`}>
                
                {/* --- LEFT PANEL: Branding --- */}
                <div className={`w-full md:w-5/12 bg-[#0a0a0a] p-8 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5 transition-all duration-1000 delay-300 ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                    
                    <div className="absolute top-[-20%] left-[-20%] w-48 h-48 sm:w-64 sm:h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[60px] sm:blur-[80px] opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[60px] sm:blur-[80px] opacity-30"></div>

                    <div className="relative z-10 mb-8 md:mb-12">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white transition-colors">Rent<span className="text-blue-500">Flow</span></span>
                        </Link>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 leading-tight">Start your stay<br className="hidden sm:block" /> with us.</h2>
                        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xs">Apply for residency today to access the premium tenant portal and manage your accommodations.</p>
                    </div>
                </div>

                {/* --- RIGHT PANEL: Form --- */}
                <div className={`w-full md:w-7/12 p-6 sm:p-10 lg:p-14 bg-zinc-950 flex flex-col justify-center transition-all duration-1000 delay-500 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    
                    <div className="mb-6 sm:mb-8 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1 sm:mb-2">Create an account</h2>
                        <p className="text-zinc-500 text-xs sm:text-sm">Please enter your details to apply for residency.</p>
                    </div>

                    {/* Dark Mode Alerts */}
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs sm:text-sm font-semibold flex items-start animate-pulse">
                            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            
                            {/* Full Name Input */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Full Name</label>
                                <input type="text" placeholder="Enter Full name" className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setName(e.target.value)} required />
                            </div>

                            {/* Email Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Email Address</label>
                                <input type="email" placeholder="name@example.com" className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            {/* Phone Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Contact Number</label>
                                <input type="tel" placeholder="09xxxxxxxxx" className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setPhone(e.target.value)} required />
                            </div>

                            {/* Gender Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Gender</label>
                                <select value={gender} className="w-full bg-zinc-900/30 border border-white/5 text-zinc-400 focus:text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium appearance-none" onChange={(e) => setGender(e.target.value)} required>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Address Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Home Address <span className="normal-case tracking-normal font-normal opacity-70">(Optional)</span></label>
                                <input type="text" placeholder="City, Region" className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            {/* Password Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 pl-4 sm:pl-5 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium"
                                        onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="sm:col-span-1">
                                <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 pl-4 sm:pl-5 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium"
                                        onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6">
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-4 px-4 rounded-xl sm:rounded-2xl shadow-xl shadow-blue-900/20 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                                {isLoading ? "Processing Application..." : "Complete Sign Up"}
                            </button>

                            <div className="mt-6 sm:mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                                <p className="text-zinc-500 text-xs sm:text-sm font-medium">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors underline-offset-4 hover:underline">
                                        Log in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- SUCCESS MODAL OVERLAY --- */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-zinc-950 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full shadow-2xl relative shadow-black flex flex-col items-center"
                        >
                            
                            {/* Close Button Top Right */}
                            <button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    router.push('/login?registered=true');
                                }}
                                className="absolute top-5 right-5 sm:top-6 sm:right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
                                aria-label="Close"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            {/* ANIMATED SUCCESS ICON */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <motion.path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                                    />
                                </svg>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-2 sm:mb-3">Account Registered!</h3>
                            <p className="text-zinc-400 text-center mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed">
                                Welcome to RentFlow. Your tenant account has been created. You can now log in to manage your residency.
                            </p>

                            <button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    router.push('/login?registered=true');
                                }}
                                className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                            >
                                Proceed to Login
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}