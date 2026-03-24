"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'tenant' | 'admin'>('tenant');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => {
        setErrorMsg('');
        setEmail('');
        setPassword('');
    }, [selectedRole]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            if (data.user.role === 'admin') router.push('/admin/dashboard');
            else router.push('/tenant/dashboard');
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 404) {
                setErrorMsg("Invalid account. Incorrect email or password.");
            } else {
                setErrorMsg(err.response?.data?.message || "Login Failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const primaryGlow = selectedRole === 'tenant' ? 'bg-blue-600' : 'bg-purple-600';
    const secondaryGlow = selectedRole === 'tenant' ? 'bg-indigo-600' : 'bg-fuchsia-600';
    const buttonColor = selectedRole === 'tenant' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-purple-600 shadow-purple-900/20';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0a0a0a] relative overflow-hidden">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] blur-3xl rounded-full pointer-events-none transition-all duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0 scale-50'} ${selectedRole === 'tenant' ? 'bg-blue-600/10' : 'bg-purple-600/10'}`}></div>

            <div className={`w-full max-w-5xl bg-zinc-950 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/5 transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-md'}`}>
                
                <div className={`md:w-5/12 bg-[#0a0a0a] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-r border-white/5 transition-all duration-1000 delay-300 ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                    <div className={`absolute top-[-20%] left-[-20%] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse-slow transition-colors duration-1000 ${primaryGlow}`}></div>
                    <div className={`absolute bottom-[-20%] right-[-20%] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-30 transition-colors duration-1000 ${secondaryGlow}`}></div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-90 transition-opacity">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-700 shadow-lg ${selectedRole === 'tenant' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <span className="text-3xl font-black tracking-tight text-white">Rent<span className={selectedRole === 'tenant' ? 'text-blue-500' : 'text-purple-500'}>Flow</span></span>
                        </Link>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{selectedRole === 'tenant' ? "Manage your stay" : "Manage your property"}<br />with ease.</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">Secure access to the RentFlow ecosystem.</p>
                    </div>
                </div>

                <div className={`md:w-7/12 p-10 lg:p-14 bg-zinc-950 flex flex-col justify-center transition-all duration-1000 delay-500 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl mb-8 border border-white/5 relative z-20">
                        <button type="button" onClick={() => setSelectedRole('tenant')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedRole === 'tenant' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}>Tenant Portal</button>
                        <button type="button" onClick={() => setSelectedRole('admin')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedRole === 'admin' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}>Admin Portal</button>
                    </div>

                    <div key={selectedRole} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{selectedRole === 'tenant' ? 'Welcome back' : 'Admin Access'}</h2>
                            <p className="text-zinc-500 text-sm">Please authenticate to continue.</p>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold flex items-start animate-pulse">
                                <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input type="email" value={email} placeholder={selectedRole === 'tenant' ? "name@example.com" : "admin@rentflow.com"} className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                                    <Link href="#" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={password} placeholder="••••••••" className="w-full bg-zinc-900/30 border border-white/5 text-white placeholder-zinc-700 pl-5 pr-12 py-4 rounded-2xl focus:ring-2 focus:ring-white/10 focus:bg-zinc-900 outline-none transition-all text-sm font-medium" onChange={(e) => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors">
                                        {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={isLoading} className={`w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${buttonColor}`}>
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </button>
                                
                                {selectedRole === 'tenant' && (
                                    <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                                        <p className="text-zinc-500 text-sm font-medium">
                                            Don't have an account?{' '}
                                            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors underline-offset-4 hover:underline">
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}