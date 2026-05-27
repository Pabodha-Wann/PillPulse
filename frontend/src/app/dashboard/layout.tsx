'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, token, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!token) {
            router.push('/login')
        }
    }, [token, router])

    if (!mounted || !token) return null

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const isActive = (path: string) => pathname === path

    return (
        <div className="flex bg-[#fafafa] h-screen pt-28 overflow-hidden" style={{ fontFamily: 'var(--font-outfit)' }}>
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-full bg-[#fafafa] border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shrink-0`}
            >
                <div className="p-4 flex items-center justify-end">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        aria-label="Toggle Sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>
                
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link href="/dashboard" 
                        className={`px-3 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors ${isActive('/dashboard') ? 'bg-[#e8f3d6] text-[#173822]' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {isSidebarOpen && <span>Overview</span>}
                    </Link>
                    
                    <Link href="/dashboard/medicines" 
                        className={`px-3 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors ${isActive('/dashboard/medicines') ? 'bg-[#e8f3d6] text-[#173822]' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {isSidebarOpen && <span>Inventory</span>}
                    </Link>
                    
                    <Link href="/search" 
                        className={`px-3 py-2 rounded-lg font-medium flex items-center gap-3 transition-colors ${isActive('/search') ? 'bg-[#e8f3d6] text-[#173822]' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {isSidebarOpen && <span>Global Search</span>}
                    </Link>
                </nav>

                <div className="p-3 border-t border-slate-200">
                    <button 
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium flex items-center gap-3 transition-colors text-left"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
