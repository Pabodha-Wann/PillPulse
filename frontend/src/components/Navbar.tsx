'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export function Navbar() {
    const { user, token, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        toast.success('Logged out')
        router.push('/')
    }

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4">
            <nav className="bg-[#2a2924] text-white rounded-full shadow-2xl pl-8 pr-2 py-2 w-full max-w-5xl flex justify-between items-center border border-white/10">
                <div className="flex gap-8 items-center text-sm font-medium text-gray-300">
                    <Link href="/search" className="hover:text-white transition-colors">Search</Link>
                    <Link href="/alerts" className="hover:text-white transition-colors">Alerts</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                        PillPulse
                    </Link>
                </div>

                <div className="flex gap-3 items-center">
                    {!token ? (
                        <>
                            <Link href="/register" className="text-sm font-medium text-gray-300 hover:text-white px-4 transition-colors">
                                Register a Pharmacy
                            </Link>
                            <Link href="/" className="bg-[#8b9d77] hover:bg-[#7b8d67] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
                                <span>Subscribe Now</span>
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-red-900/30 text-red-200 hover:bg-red-900/50 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </div>
    )
}