"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from 'framer-motion';
import api from '@/lib/api';

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [errorMsg, setErrorMsg] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    
    const router = useRouter();

    useEffect(() => { setIsMounted(true); }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                router.push(response.data.user.role === 'admin' ? '/admin/dashboard' : '/tenant/dashboard');
            } else {
                throw new Error("No token returned");
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.message || "Login failed. Please check credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-zinc-950" />;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-cyan-500/30">
            
            {/* Header branding (absolute top) */}
            <header className="absolute top-0 w-full px-6 md:px-12 h-24 flex items-center justify-between z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Rent<span className="text-cyan-600 dark:text-cyan-400">Flow</span>
                    </span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* Login Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md px-6 py-10 sm:p-12 mx-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Enter your credentials to access your portal.</p>
                </div>

                {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span>{errorMsg}</span>
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 ml-1">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-zinc-950/50 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-medium focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Password</Label>
                            <Link href="#" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-zinc-950/50 border-slate-200 dark:border-white/10 rounded-2xl px-4 font-medium focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 transition-all shadow-inner"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full h-12 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-slate-900 rounded-2xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold ml-1 transition-colors">
                            Apply now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}