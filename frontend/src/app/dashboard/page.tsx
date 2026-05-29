'use client'

import { useAuthStore } from '@/store/authStore'
import { useState, useEffect } from 'react'
import { medicineService } from '@/services/medicineService'
import { pharmacyService } from '@/services/pharmacyService'
import Link from 'next/link'

export default function DashboardPage() {
    const { user, isAdmin } = useAuthStore()
    
    // Dynamic system counters
    const [stats, setStats] = useState({
        totalMedicines: 0,
        totalPharmacies: 0,
        lowStock: 0,
        outOfStock: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const meds = await medicineService.getAllMedicines()
                
                if (isAdmin) {
                    const pharms = await pharmacyService.getAllPharmacies()
                    setStats({
                        totalMedicines: meds.length,
                        totalPharmacies: pharms.length,
                        lowStock: 0,
                        outOfStock: 0
                    })
                } else if (user?.id) {
                    const localMeds = await medicineService.getPharmacyMedicines(user.id)
                    const low = localMeds.filter(m => m.status === 'LOW_STOCK').length
                    const out = localMeds.filter(m => m.status === 'OUT_OF_STOCK').length
                    setStats({
                        totalMedicines: localMeds.length,
                        totalPharmacies: 0,
                        lowStock: low,
                        outOfStock: out
                    })
                }
            } catch (e) {
                console.error("Failed to load dashboard metrics", e)
            } finally {
                setLoading(false)
            }
        }
        
        fetchStats()
    }, [isAdmin, user?.id])

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto" style={{ fontFamily: 'var(--font-outfit)' }}>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    {isAdmin ? 'System Administrator Portal' : `Welcome back, ${user?.name || user?.email?.split('@')[0]}`}
                </h1>
                <p className="text-slate-500 text-lg">
                    {isAdmin 
                        ? 'Global administration suite for PillPulse. Monitor pharmacies, medicine directories, and system integrity.' 
                        : 'Real-time overview of your local pharmacy stock, depletion warnings, and catalog options.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {isAdmin ? (
                    <>
                        {/* Admin Stats */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Global Medicine Definitions</h3>
                            <div className="flex items-baseline gap-4 mb-1">
                                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                                    {loading ? '...' : stats.totalMedicines}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400">Medications defined in global catalog</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Registered Pharmacies</h3>
                            <div className="flex items-baseline gap-4 mb-1">
                                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                                    {loading ? '...' : stats.totalPharmacies}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400">Partner locations on network</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Identity Realm (Keycloak)</h3>
                            <div className="flex items-baseline gap-2 mb-1 text-emerald-600 font-bold text-lg mt-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 11.388a.75.75 0 011.096-.188 8.5 8.5 0 105.313-7.619.75.75 0 11-.64-1.356 10 10 0 11-6.155 8.97.75.75 0 01.386-.807zM10 3a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75H4.75a.75.75 0 010-1.5h4.5V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
                                Synchronized
                            </div>
                            <p className="text-sm text-slate-400 mt-2">Access control and security is active</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Pharmacy Stats */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Local Stock Items</h3>
                            <div className="flex items-baseline gap-4 mb-1">
                                <p className="text-4xl font-bold text-slate-900 tracking-tight">
                                    {loading ? '...' : stats.totalMedicines}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400">Medicines added to your profile</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Low Stock Warnings</h3>
                            <div className="flex items-baseline gap-4 mb-1">
                                <p className="text-4xl font-bold text-amber-600 tracking-tight">
                                    {loading ? '...' : stats.lowStock}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400">Items nearing critical levels</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                            <h3 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Out of Stock</h3>
                            <div className="flex items-baseline gap-4 mb-1">
                                <p className="text-4xl font-bold text-rose-600 tracking-tight">
                                    {loading ? '...' : stats.outOfStock}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400">Requires immediate restock</p>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isAdmin ? (
                        <>
                            <Link href="/dashboard/global-medicines" className="group p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#173822]/30 hover:shadow transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#e8f3d6] transition-colors">
                                    <svg className="w-6 h-6 text-slate-600 group-hover:text-[#173822] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Global Catalog Manager</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">Add new medication chemical master records, edit specifications, or prune expired listings.</p>
                                </div>
                            </Link>

                            <Link href="/dashboard/pharmacies" className="group p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#173822]/30 hover:shadow transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#e8f3d6] transition-colors">
                                    <svg className="w-6 h-6 text-slate-600 group-hover:text-[#173822] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Partner Pharmacy Registrar</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">View all active pharmacy profiles, authorize brand-new partnerships, or suspend credentials instantly.</p>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard/medicines" className="group p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#173822]/30 hover:shadow transition-all flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#e8f3d6] transition-colors">
                                    <svg className="w-6 h-6 text-slate-600 group-hover:text-[#173822] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Manage Local Inventory</h3>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}