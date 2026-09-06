"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from "@/components/theme-toggle";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
        <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-10 sm:p-6 lg:p-8 bg-zinc-950 relative overflow-x-hidden font-sans">
            {/* Ambient Background Glow */}
            <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] sm:h-[500px] bg-linear-to-b from-blue-600/10 to-transparent blur-[60px] sm:blur-[100px] rounded-full pointer-events-none transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0 scale-50'}`}></div>
            
            {/* Main Wrapper */}
            <div className={`w-full max-w-5xl my-auto grid md:grid-cols-2 bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-md'}`}>
                
                {/* --- LEFT PANEL: Branding (HIDDEN ON MOBILE) --- */}
                <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden bg-black/40 border-r border-white/5">
                    
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white transition-colors">Rent<span className="text-blue-500">Flow</span></span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">Start your stay<br/> with us.</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">Apply for residency today to access the premium tenant portal and manage your accommodations.</p>
                    </div>
                </div>

                {/* --- RIGHT PANEL: Form --- */}
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
                                <span className="text-xl font-black tracking-tight text-white">Rent<span className="text-blue-500">Flow</span></span>
                            </div>
                            <ThemeToggle />
                        </div>

                        <CardHeader className="px-0 pt-0 text-center md:text-left">
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Create an account</CardTitle>
                            <CardDescription className="text-zinc-400">Please enter your details to apply for residency.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {errorMsg && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name Input */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="phone">Contact Number</Label>
                                        <Input id="phone" type="tel" placeholder="09xxxxx8022" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
                                    </div>

                                    {/* Gender Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={gender} onValueChange={(val) => setGender(val || '')} disabled={isLoading}>
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Address Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="address">Home Address</Label>
                                        <Input id="address" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isLoading} />
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} />
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="space-y-2 sm:col-span-1">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={isLoading} />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        
                        <CardFooter className="px-0 flex flex-col items-center">
                            <p className="text-sm text-zinc-400 mt-4">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium underline underline-offset-4">
                                    Log in here
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
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
                            className="bg-zinc-950 border border-white/10 rounded-3xl p-8 sm:p-10 max-w-sm w-full shadow-2xl relative shadow-black flex flex-col items-center"
                        >
                            {/* Close Button Top Right */}
                            <button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    router.push('/login?registered=true');
                                }}
                                className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            {/* ANIMATED SUCCESS ICON */}
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                            <h3 className="text-xl font-bold text-white text-center mb-2">Account Registered!</h3>
                            <p className="text-zinc-400 text-center mb-6 text-sm leading-relaxed">
                                Welcome to RentFlow. Your account has been created. Wait for the admin for the account approval.
                            </p>

                            <Button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    router.push('/login?registered=true');
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Proceed to Login
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}