"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'tenant' | 'admin'>('tenant');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
    const isNewlyRegistered = searchParams?.get('registered');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data.user.role !== selectedRole) {
                throw new Error(`Account not authorized for ${selectedRole} portal.`);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (selectedRole === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/tenant/dashboard');
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.message || "Login Failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0a0a0a] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-linear-to-b from-blue-600/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

            <div className="w-full max-w-5xl bg-zinc-950 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/5">
                
                {/* LEFT SIDE OF CARD: Branding */}
                <div className="md:w-5/12 bg-[#0a0a0a] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-r border-white/5">
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-90 transition-opacity">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <span className="text-3xl font-black tracking-tight flex items-center text-white">
                                <span className="bg-white text-zinc-950 px-2.5 py-0.5 rounded-lg mr-1">Rent</span>
                                <span className="text-blue-500">Flow</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Manage your stay<br />with ease.</h2>
                        <p className="text-zinc-400 leading-relaxed max-w-xs">Access your portal to pay bills, submit maintenance requests, and connect with management.</p>
                    </div>
                </div>

                {/* RIGHT SIDE OF CARD: Login Form (Dark Mode) */}
                <div className="md:w-7/12 p-10 lg:p-14 bg-zinc-950 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h2>
                        <p className="text-zinc-400">Please enter your details to sign in.</p>
                    </div>

                    {/* Dark Mode Role Selector */}
                    <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button type="button" onClick={() => setSelectedRole('tenant')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${selectedRole === 'tenant' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}>Tenant Portal</button>
                        <button type="button" onClick={() => setSelectedRole('admin')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${selectedRole === 'admin' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}>Admin Portal</button>
                    </div>

                    {/* Dark Mode Alerts */}
                    {isNewlyRegistered && !errorMsg && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-semibold flex items-start">
                            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Account created successfully! You can now log in.</span>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold flex items-start animate-pulse">
                            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Email Address</label>
                            <input
                                type="email" placeholder="name@example.com"
                                className="w-full bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-zinc-900 outline-none transition-all text-sm font-medium"
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-zinc-300">Password</label>
                                <Link href="#" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                            </div>
                            
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 pl-5 pr-12 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-zinc-900 outline-none transition-all text-sm font-medium"
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-blue-400 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-blue-900/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-zinc-400">Don't have an account? <Link href="/signup" className="text-white font-bold hover:text-blue-400 transition-colors underline decoration-zinc-700 hover:decoration-blue-400 underline-offset-4">Apply for residency</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}