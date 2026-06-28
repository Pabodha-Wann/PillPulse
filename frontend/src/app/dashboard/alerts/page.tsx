'use client'

import { useState, useEffect } from 'react'
import { alertService } from '@/services/alertService'
import { toast } from 'react-toastify'
import type { AlertSubscription, AlertHistory } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function AdminAlertsPage() {
    const { isAdmin, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>([])
    const [history, setHistory] = useState<AlertHistory[]>([])
    
    // Global subscriptions
    const [allSubscriptions, setAllSubscriptions] = useState<AlertSubscription[]>([])
    const [loadingAll, setLoadingAll] = useState(false)

    const fetchAllSubscriptions = async () => {
        setLoadingAll(true)
        try {
            const data = await alertService.getAllSubscriptions()
            setAllSubscriptions(data)
        } catch (error) {
            console.error('Failed to load all subscriptions:', error)
        } finally {
            setLoadingAll(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isAuthenticated()) {
                toast.error("Session missing. Please log in.")
                router.push('/login')
                return
            }
            if (!isAdmin) {
                toast.error("Access denied. System Admins only.")
                router.push('/dashboard')
                return
            }
            fetchAllSubscriptions()
        }
    }, [isAdmin, isAuthenticated])

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Please enter a user email address')
            return
        }

        setLoading(true)
        setSearched(true)
        
        try {
            const [subsResult, historyResult] = await Promise.allSettled([
                alertService.getUserSubscriptions(email.trim()),
                alertService.getUserAlertHistory(email.trim())
            ])

            if (subsResult.status === 'fulfilled') {
                setSubscriptions(subsResult.value.filter(s => s.isActive))
            } else {
                setSubscriptions([])
            }

            if (historyResult.status === 'fulfilled') {
                setHistory(historyResult.value)
            } else {
                setHistory([])
            }

            toast.success('Alert details retrieved!')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUnsubscribe = async (subEmail: string, medicineId: number, medicineName: string, pharmacyId: number) => {
        if (!window.confirm(`Are you sure you want to stop alerts for ${medicineName} on behalf of ${subEmail}?`)) {
            return
        }

        try {
            await alertService.unsubscribe(subEmail, medicineId, pharmacyId)
            toast.success(`Successfully removed subscription for ${medicineName}!`)
            setSubscriptions(prev => prev.filter(sub => !(sub.medicineId === medicineId && sub.pharmacyId === pharmacyId)))
            fetchAllSubscriptions()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to unsubscribe')
        }
    }

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto" style={{ fontFamily: 'var(--font-outfit)' }}>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Subscriber Alerts Lookup</h1>
                <p className="text-slate-500 text-lg">Perform search inquiries, review active stock watchers, and audit SMS notification logs.</p>
            </div>

            {/* Email Lookup Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 max-w-xl">
                <form onSubmit={handleLookup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Search Subscriber Email
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="e.g. patient@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 border border-slate-200 bg-slate-50/50 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent text-slate-900 font-semibold text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#173822] hover:bg-[#204a2d] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm text-sm"
                            >
                                {loading ? 'Searching...' : 'Audit Alerts'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#173822] border-t-transparent"></div>
                    <p className="text-sm font-semibold animate-pulse">Scanning subscriptions...</p>
                </div>
            )}

            {/* Results Grid */}
            {searched && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    
                    {/* Active Watchers */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Watchers</h2>
                            <span className="bg-[#e8f3d6] text-[#173822] px-2.5 py-0.5 rounded-full text-xs font-bold">
                                {subscriptions.length} active
                            </span>
                        </div>

                        {subscriptions.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <p className="text-base font-semibold text-slate-800 mb-1">No active stock alerts</p>
                                <p className="text-xs max-w-xs mx-auto">This email has no pending notifications registered.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {subscriptions.map((sub) => (
                                    <div key={sub.id} className="p-6 flex justify-between items-center hover:bg-slate-50/30 transition-colors">
                                        <div className="space-y-1">
                                            <h3 className="font-extrabold text-slate-900 text-base">{sub.medicineName}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                <span>Email: {sub.userEmail}</span>
                                                {sub.userPhone && (
                                                    <span className="text-[#173822] font-bold">SMS Mobile: {sub.userPhone}</span>
                                                )}
                                            </div>
                                        </div>

                                         <button
                                             onClick={() => handleUnsubscribe(sub.userEmail, sub.medicineId, sub.medicineName, sub.pharmacyId || 0)}
                                             className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                                         >
                                             Delete Alert
                                         </button>
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
 
                     {/* Dispatched History */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                         <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                             <h2 className="text-lg font-bold text-slate-900 tracking-tight">Notification History</h2>
                             <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                 {history.length} logs
                             </span>
                         </div>
 
                         {history.length === 0 ? (
                             <div className="p-12 text-center text-slate-400">
                                 <p className="text-base font-semibold text-slate-800 mb-1">No alert history</p>
                                 <p className="text-xs max-w-xs mx-auto">No messages have been sent to this address yet.</p>
                             </div>
                         ) : (
                             <div className="p-6">
                                 <div className="flow-root">
                                     <ul className="-mb-8">
                                         {history.map((log, idx) => (
                                             <li key={log.id}>
                                                 <div className="relative pb-8">
                                                     {idx !== history.length - 1 && (
                                                         <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                                     )}
                                                     <div className="relative flex space-x-3">
                                                         <div>
                                                             <span className="h-8 w-8 rounded-full bg-[#e8f3d6] flex items-center justify-center text-[#173822] text-xs font-bold ring-8 ring-white">
                                                                 ✓
                                                             </span>
                                                         </div>
                                                         <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                                             <div>
                                                                 <p className="text-sm font-extrabold text-slate-800">{log.medicineName}</p>
                                                                 <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">{log.message}</p>
                                                             </div>
                                                             <div className="text-right text-xs font-bold text-slate-400 whitespace-nowrap">
                                                                 {new Date(log.sentAt).toLocaleDateString()}
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                         )}
                     </div>
 
                 </div>
             )}

             {/* Global Subscriptions Table */}
             <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                     <div>
                         <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Stock Alert Registrations</h2>
                         <p className="text-slate-500 text-xs mt-1">Real-time status overview of subscribers and requested medications.</p>
                     </div>
                     <span className="bg-[#173822] text-white px-3 py-1 rounded-full text-xs font-bold">
                         {allSubscriptions.length} total subscriptions
                     </span>
                 </div>

                 {loadingAll ? (
                     <div className="p-12 text-center text-slate-400">
                         <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#173822] border-t-transparent mx-auto mb-2"></div>
                         <p className="text-sm font-semibold animate-pulse">Retrieving subscriptions...</p>
                     </div>
                 ) : allSubscriptions.length === 0 ? (
                     <div className="p-12 text-center text-slate-400">
                         <p className="text-base font-semibold text-slate-800 mb-1">No registrations found</p>
                         <p className="text-xs">There are currently no alert subscriptions registered in the system.</p>
                     </div>
                 ) : (
                     <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse">
                             <thead>
                                 <tr className="border-b border-slate-200 bg-slate-100/55 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                     <th className="py-4 px-6">Subscriber</th>
                                     <th className="py-4 px-6">Phone Number</th>
                                     <th className="py-4 px-6">Subscribed Medicine</th>
                                     <th className="py-4 px-6">Date Registered</th>
                                     <th className="py-4 px-6">Alert Status</th>
                                     <th className="py-4 px-6 text-right">Actions</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
                                 {allSubscriptions.map((sub) => (
                                     <tr key={sub.id} className="hover:bg-slate-50/40 transition-colors">
                                         <td className="py-4 px-6">
                                             <div className="font-extrabold text-slate-900">{sub.userEmail}</div>
                                         </td>
                                         <td className="py-4 px-6">
                                             {sub.userPhone ? (
                                                 <span className="text-[#173822] font-bold text-xs bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">{sub.userPhone}</span>
                                             ) : (
                                                 <span className="text-slate-400 text-xs font-semibold italic">Not Provided</span>
                                             )}
                                         </td>
                                         <td className="py-4 px-6">
                                             <div className="font-extrabold text-slate-900">{sub.medicineName}</div>
                                             <div className="text-[#173822] font-extrabold text-xs">{sub.pharmacyName || 'Global Watch'}</div>
                                             <div className="text-slate-400 text-[10px] font-medium mt-0.5">Med ID: {sub.medicineId} | Pharm ID: {sub.pharmacyId || 'N/A'}</div>
                                         </td>
                                         <td className="py-4 px-6 text-slate-500 text-xs">
                                             {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A'}
                                         </td>
                                         <td className="py-4 px-6">
                                             {sub.isActive ? (
                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#173822]">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                     Active Watcher
                                                 </span>
                                             ) : (
                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                     Unsubscribed
                                                 </span>
                                             )}
                                         </td>
                                         <td className="py-4 px-6 text-right">
                                             {sub.isActive && (
                                                 <button
                                                     onClick={() => handleUnsubscribe(sub.userEmail, sub.medicineId, sub.medicineName, sub.pharmacyId || 0)}
                                                     className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                 >
                                                     Delete Alert
                                                 </button>
                                             )}
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>
         </div>
     )
 }
