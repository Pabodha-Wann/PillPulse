'use client'

import React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-toastify'

export function Navbar() {
    const { user, isLoggedIn, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        logout()
        toast.success('Logged out')
        router.push('/')
    }

    // Do not show the navbar on these specific pages
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 h-24 z-50 group">
            {/* The actual navbar that slides down on hover */}
            <div className="absolute top-6 left-0 right-0 flex justify-center w-full px-4 transform -translate-y-32 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <nav className="bg-[#2a2924]/80 backdrop-blur-md text-white rounded-xl shadow-lg px-6 py-3 w-full max-w-5xl flex justify-between items-center border border-white/10">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="text-lg font-bold text-white flex items-center gap-2">
                            PillPulse
                        </Link>

                        {/* Links */}
                        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-300">
                            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
                            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex gap-4 items-center">
                        {!mounted ? (
                            // Return empty/loading state to match SSR until mounted on client
                            <div className="w-10 h-6"></div>
                        ) : !isLoggedIn ? (
                            <>
                                <div className="hidden md:flex items-center gap-4">
                                    <Link href="/register" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                        Register a Pharmacy
                                    </Link>
                                    <Link href="/" className="bg-[#8b9d77] hover:bg-[#7b8d67] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                        Subscribe Now
                                    </Link>
                                </div>
                                {/* Hamburger Menu Icon for mobile or style matching */}
                                <button className="text-gray-300 hover:text-white transition-colors ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-900/30 text-red-200 hover:bg-red-900/50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                                {/* Hamburger Menu Icon */}
                                <button className="text-gray-300 hover:text-white transition-colors ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    )
}