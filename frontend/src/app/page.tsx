import Link from 'next/link';

export default function LandingPage() {
  return (
    // Locked the page size to prevent scrolling (100vh)
    <div className="bg-[#0a0a0a] text-zinc-50 flex flex-col h-screen overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">

      {/* Hero Section takes up all the main space */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 relative">

        {/* Abstract Background Elements (Glowing Blobs) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        {/* Hero Content Wrapper */}
        <div className="relative z-10 max-w-5xl text-center space-y-8 px-4 flex flex-col items-center">

          {/* Dipolog City Availability Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-200 mt-6 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Now available in Dipolog City
          </div>

          {/* CENTERED BRAND LOGO */}
          <div className="flex items-center justify-center gap-4 cursor-default mb-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            
            <span className="text-4xl font-black tracking-tight flex items-center">
              {/* Solid white background on "Rent" */}
              <span className="bg-white text-zinc-950 px-3 py-1 rounded-xl mr-1">Rent</span>
              <span className="text-blue-500">Flow</span>
            </span>
          </div>

          {/* INSPIRATIONAL QUOTE */}
          <div className="relative inline-block">
            <span className="absolute -left-4 -top-2 text-4xl text-blue-500/30 font-serif">"</span>
            <p className="text-xl text-blue-200/90 font-medium italic px-4">
              The smartest choice for seamless, stress-free property management.
            </p>
            <span className="absolute -right-2 -bottom-4 text-4xl text-blue-500/30 font-serif">"</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
            Modernize Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-blue-500 pb-2">
              Property Management
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The premium management system designed specifically for modern boarding houses, dormitories, and co-living spaces. Streamline operations, delight tenants.
          </p>

          {/* GET STARTED BUTTON (Routes directly to /login) */}
          <div className="flex justify-center pt-4">
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.25)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transform hover:-translate-y-1"
            >
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 py-6 border-t border-white/5 text-center text-zinc-400 font-medium bg-zinc-950 relative z-10">
        <p>© 2026 RentFlow Boarding House Management. All rights reserved.</p>
      </footer>
    </div>
  );
}