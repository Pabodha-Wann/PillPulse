import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-outfit)' }}>
      {/* Hero Section Container */}
      <div className="pt-6 px-4 sm:px-8 lg:px-5 pb-12">
        <section
          className="relative min-h-[95vh] rounded-[1rem] flex items-center overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663413689012/3eKksqTiRWCGrjPMSqcjX7/pillpulse-hero-green-bpD7Kn4H6RttsBcEAGqMtE.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          {/* Dark cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111612]/95 via-[#111612]/70 to-transparent" />

          {/* Transparent Inner Navbar */}
          <div className="absolute top-0 left-0 right-0 w-full px-8 sm:px-16 lg:px-24 py-10 z-20 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-3xl text-white tracking-tight">
              PillPulse
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-10 text-[12px] text-white uppercase tracking-[0.15em]">
              <Link href="/" className="border-b-2 border-white pb-1">Home</Link>
              <Link href="/search" className="opacity-70 hover:opacity-100 transition-opacity pb-1">Search</Link>
              <Link href="/dashboard" className="opacity-70 hover:opacity-100 transition-opacity pb-1">Dashboard</Link>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/search" className="bg-white text-[#111612] px-4 md:px-8 py-3 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] hover:bg-gray-100 transition-colors shadow-lg text-center">
                Find Medicine
              </Link>
              <Link href="/login" className="bg-white text-[#111612] px-4 md:px-8 py-3 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] hover:bg-gray-100 transition-colors shadow-lg text-center">
                Login
              </Link>
            </div>
          </div>

          {/* Hero content */}
          <div className="container mx-auto px-8 sm:px-16 lg:px-24 relative z-10 pt-16">
            <div className="max-w-3xl space-y-12">

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05]">
                  Never miss your<br />
                  <span className="text-[#8b9d77]">medication again</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl">
                  Smart prescription tracking and pharmacy management for the modern Sri Lankan healthcare system.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center bg-[#8b9d77] hover:bg-[#7a8c66] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-95"
                >
                  Find Medicine
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-transparent border border-white/30 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all"
                >
                  Register Pharmacy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section below Hero on White Background */}
      <section className="py-16 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111612] leading-[1.1] tracking-tight">
              Smart Healthcare That Moves Your Business
            </h2>
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#111612] mb-3">500+</div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Pharmacies<br />Connected</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#111612] mb-3">50K+</div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">Active<br />Users</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#111612] mb-3">99.9%</div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed">System<br />Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-4 sm:px-8 lg:px-20 max-w-screen mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#111612] leading-[1.1] tracking-tight mb-16">
          The Medication Accessibility Crisis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="border border-gray-100 rounded-[1.5rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-8 bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111612] mb-4">01. Stock Uncertainty</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Patients waste hours visiting multiple pharmacies just to find a single prescribed medication.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-gray-100 rounded-[1.5rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-8 bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21v-5h5" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111612] mb-4">02. Inventory Blindspots</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Pharmacies lack visibility into local demand, leading to frequent stock-outs of critical drugs.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-gray-100 rounded-[1.5rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-8 bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111612] mb-4">03. Delayed Treatments</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">The time spent frantically searching for medicines directly delays crucial patient care.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-gray-100 rounded-[1.5rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-8 bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111612] mb-4">04. Disconnected Network</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">A fragmented system prevents pharmacies from communicating seamlessly with patients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-12 px-4 sm:px-8 lg:px-20 max-w-screen mx-auto mb-24">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111612] leading-[1.1] tracking-tight mb-6">
            The Connected Solution Layer
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Moving from reactive firefighting to predictive orchestration. PillPulse solves problems before they impact your health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Top Left: Large */}
          <div className="md:col-span-7 relative h-[400px] rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold border border-white/20">01</div>
            <div className="absolute bottom-10 left-10">
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-2">Real-Time Inventory</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">Live Stock Tracking</h3>
            </div>
          </div>

          {/* Top Right: Narrow */}
          <div className="md:col-span-5 relative h-[400px] rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold border border-white/20">02</div>
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-2">Location Intelligence</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">Interactive Discovery Map</h3>
            </div>
          </div>

          {/* Bottom Left: Narrow */}
          <div className="md:col-span-5 relative h-[400px] rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173822]/90 via-[#173822]/40 to-transparent" />
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold border border-white/20">03</div>
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-2">Proactive Notifications</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">Automated Stock Alerts</h3>
            </div>
          </div>

          {/* Bottom Right: Large */}
          <div className="md:col-span-7 relative h-[400px] rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold border border-white/20">04</div>
            <div className="absolute bottom-10 left-10">
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-2">Seamless Management</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">Unified Pharmacy Dashboard</h3>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111612] text-white py-20 px-4 sm:px-8 lg:px-20 border-t border-white/10 rounded-t-[2rem] mx-2 mt-12 mb-2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="text-3xl font-bold text-white tracking-tight">
              PillPulse
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Smart prescription tracking and pharmacy management for the modern Sri Lankan healthcare system. Moving from reactive firefighting to predictive orchestration.
            </p>
          </div>

          {/* Links Cols */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">For Patients</h4>
              <ul className="space-y-4">
                <li><Link href="/search" className="text-sm text-white/70 hover:text-white transition-colors">Interactive Map</Link></li>
                <li><Link href="/search" className="text-sm text-white/70 hover:text-white transition-colors">Find Medicine</Link></li>
                <li><Link href="/search" className="text-sm text-white/70 hover:text-white transition-colors">Stock Alerts</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">For Pharmacies</h4>
              <ul className="space-y-4">
                <li><Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Unified Dashboard</Link></li>
                <li><Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Live Stock Tracking</Link></li>
                <li><Link href="/register" className="text-sm text-white/70 hover:text-white transition-colors">Register Pharmacy</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-medium">© {new Date().getFullYear()} PillPulse. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
          </div>
        </div>
      </footer>
    </div>
  )
}