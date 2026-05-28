'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export function Navbar() {
    const { user, isLoggedIn, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        toast.success('Logged out')
        router.push('/')
    }

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4">
            <nav className="bg-[#2a2924]/80 backdrop-blur-md text-white rounded-xl shadow-lg px-6 py-3 w-full max-w-5xl flex justify-between items-center border border-white/10">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="text-lg font-bold text-white flex items-center gap-2">
                        PillPulse
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-300">
                        <Link href="/search" className="hover:text-white transition-colors">Search</Link>
                        <Link href="/alerts" className="hover:text-white transition-colors">Alerts</Link>
                        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    </div>
                </div>

                {/* Right side items */}
                <div className="flex gap-4 items-center">
                    {!isLoggedIn ? (
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
    )
}