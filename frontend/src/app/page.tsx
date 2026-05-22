import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663413689012/3eKksqTiRWCGrjPMSqcjX7/pillpulse-hero-green-bpD7Kn4H6RttsBcEAGqMtE.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/100 via-white/80 to-transparent" />


        {/* Main content */}
        <div className="container mx-auto px-10 relative z-10">
          <div className="max-w-2xl space-y-12">


            <div className="space-y-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              <h1 className="text-5xl md:text-6xl tracking-tight text-[#2a2924] ">
                Never miss your<br />
                <span className="text-[#8b9d77]">medication again</span>
              </h1>
              <p className="text-lg text-[#2a2924]/70 leading-relaxed max-w-xl">
                Smart prescription tracking and pharmacy management for the modern Sri Lankan healthcare system.
              </p>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 pt-4" style={{ fontFamily: 'var(--font-outfit)' }}>
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-[#8b9d77] hover:bg-[#7b8d67] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg active:scale-95"
              >
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>


            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-2xl font-bold text-[#2a2924]">500+</div>
                <p className="text-sm text-[#2a2924]/60">Pharmacies connected</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2a2924]">50K+</div>
                <p className="text-sm text-[#2a2924]/60">Active users</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2a2924]">99.9%</div>
                <p className="text-sm text-[#2a2924]/60">Uptime</p>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  )
}