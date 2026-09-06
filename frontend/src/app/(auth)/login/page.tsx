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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
            className="min-h-dvh flex flex-col items-center justify-center p-4 py-10 sm:p-6 lg:p-8 bg-zinc-950 relative overflow-x-hidden font-sans"
        >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] sm:h-[500px] blur-[100px] rounded-full pointer-events-none transition-all duration-1000 bg-blue-600/10 ${isMounted ? 'opacity-100' : 'opacity-0 scale-50'}`}></div>

            <div className={`w-full max-w-5xl my-auto grid md:grid-cols-2 bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-md'}`}>
                
                {/* --- LEFT PANEL --- */}
                <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden bg-black/40 border-r border-white/5">
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse-slow transition-colors duration-1000 bg-blue-600"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-30 transition-colors duration-1000 bg-indigo-600"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">
                                Rent<span className="text-blue-500">Flow</span>
                            </span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">Welcome back to <br/> RentFlow.</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">Secure access to the ultimate property management ecosystem.</p>
                    </div>
                </div>

                {/* --- RIGHT PANEL (FORM) --- */}
                <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
                    
                    <Card className="w-full max-w-md bg-transparent border-none shadow-none">
                        {/* MOBILE BRANDING HEADER (Visible ONLY on Mobile) */}
                        <div className="flex md:hidden items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 text-white shadow-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-black tracking-tight text-white">
                                    Rent<span className="text-blue-500">Flow</span>
                                </span>
                            </div>
                            <ThemeToggle />
                        </div>

                        <CardHeader className="px-0 pt-0 text-center md:text-left">
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Login</CardTitle>
                            <CardDescription className="text-zinc-400">Enter your email below to login to your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {errorMsg && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="px-0 flex flex-col items-center">
                            <p className="text-sm text-zinc-400 mt-4">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium underline underline-offset-4">
                                    Apply now
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}