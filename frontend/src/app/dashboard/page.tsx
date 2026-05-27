'use client'

import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

export default function DashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    Welcome back, {user?.email?.split('@')[0]}
                </h1>
                <p className="text-slate-500 text-lg">
                    Here's what's happening with your pharmacy inventory today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Total Medicines</h3>
                    <div className="flex items-baseline gap-4 mb-1">
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">1,048</p>
                        <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                            12%
                        </span>
                    </div>
                    <p className="text-sm text-slate-400">vs last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Low Stock Alerts</h3>
                    <div className="flex items-baseline gap-4 mb-1">
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">24</p>
                        <span className="flex items-center text-sm font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            4%
                        </span>
                    </div>
                    <p className="text-sm text-slate-400">Items nearing depletion</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Out of Stock</h3>
                    <div className="flex items-baseline gap-4 mb-1">
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">3</p>
                        <span className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                            0%
                        </span>
                    </div>
                    <p className="text-sm text-slate-400">Requires immediate restock</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/dashboard/medicines" className="group p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#173822]/30 hover:shadow transition-all flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#e8f3d6] transition-colors">
                            <svg className="w-6 h-6 text-slate-600 group-hover:text-[#173822] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Manage Inventory</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Add new medicines to your catalog, update stock quantities, and remove expired items securely.</p>
                        </div>
                    </Link>

                    <Link href="/search" className="group p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#173822]/30 hover:shadow transition-all flex items-start gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#e8f3d6] transition-colors">
                            <svg className="w-6 h-6 text-slate-600 group-hover:text-[#173822] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Search Preview</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Preview the global search interface to verify how patients locate your pharmacy's stock.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}