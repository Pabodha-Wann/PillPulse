'use client'

import { useState, useEffect } from 'react'
import { pharmacyService } from '@/services/pharmacyService'
import { toast } from 'react-toastify'
import type { Pharmacy } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function PharmaciesPage() {
    const { isAdmin, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [loading, setLoading] = useState(false)
    
    // Register / Update Form States
    const [showForm, setShowForm] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: ''
    })

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
            loadPharmacies()
        }
    }, [isAdmin, isAuthenticated])

    const loadPharmacies = async () => {
        setLoading(true)
        try {
            const data = await pharmacyService.getAllPharmacies()
            setPharmacies(data)
        } catch (error) {
            toast.error('Failed to load pharmacies')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleOpenCreate = () => {
        setEditMode(false)
        setSelectedId(null)
        setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            latitude: '',
            longitude: '',
            phone: ''
        })
        setShowForm(true)
    }

    const handleOpenEdit = (pharmacy: Pharmacy) => {
        setEditMode(true)
        setSelectedId(pharmacy.id)
        setFormData({
            name: pharmacy.name,
            email: pharmacy.email,
            password: '', // blank during edit
            address: pharmacy.address,
            latitude: pharmacy.latitude?.toString() || '',
            longitude: pharmacy.longitude?.toString() || '',
            phone: pharmacy.phone || ''
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.address) {
            toast.error('Please fill required fields (Name, Email, Address)')
            return
        }

        try {
            if (editMode && selectedId !== null) {
                // Update pharmacy
                await pharmacyService.updatePharmacy(selectedId, {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                    phone: formData.phone
                })
                toast.success('Pharmacy updated successfully!')
            } else {
                // Register/Create pharmacy
                if (!formData.password) {
                    toast.error('Password is required for registration')
                    return
                }
                await pharmacyService.registerPharmacy({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : 0.0,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : 0.0,
                    phone: formData.phone
                })
                toast.success('Pharmacy registered successfully!')
            }
            setShowForm(false)
            await loadPharmacies()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed')
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to suspend/delete this pharmacy? This action removes their portal profile and revokes Keycloak access.")) {
            return
        }

        try {
            await pharmacyService.deletePharmacy(id)
            toast.success('Pharmacy suspended/deleted successfully!')
            await loadPharmacies()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete pharmacy')
            console.error(error)
        }
    }

    if (loading && pharmacies.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-medium animate-pulse text-lg">Loading PillPulse Pharmacies...</p>
            </div>
        )
    }

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto" style={{ fontFamily: 'var(--font-outfit)' }}>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Manage Pharmacies</h1>
                    <p className="text-slate-500 text-lg">Oversee all pharmacy partners, register new locations, or suspend active profiles.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) setShowForm(false)
                        else handleOpenCreate()
                    }}
                    className="bg-[#173822] hover:bg-[#204a2d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    {showForm ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Register Pharmacy
                        </>
                    )}
                </button>
            </div>

            {/* Creation / Edit Form */}
            {showForm && (
                <div className="mb-10 p-6 md:p-8 bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
                        {editMode ? 'Edit Pharmacy Profile' : 'Register New Pharmacy Partner'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pharmacy Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Pharmacy Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. LifeCare Pharmacy"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. contact@lifecare.com"
                                    disabled={editMode}
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium disabled:opacity-50"
                                    required
                                />
                            </div>

                            {/* Password - only required for new pharmacies */}
                            {!editMode && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Login Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min 6 characters"
                                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                        required={!editMode}
                                    />
                                </div>
                            )}

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Physical Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Full street address"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +94771234567"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        placeholder="6.9271"
                                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        placeholder="79.8612"
                                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#e8f3d6] hover:bg-[#d4e6b5] text-[#173822] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                            >
                                {editMode ? 'Update Profile' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pharmacies List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Active Pharmacy Partners ({pharmacies.length})</h2>
                </div>

                {pharmacies.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <p className="text-lg font-medium text-slate-900 mb-1">No registered pharmacies</p>
                        <p className="text-sm">Click 'Register Pharmacy' above to introduce your first pharmacy client.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {pharmacies.map((pharm) => (
                            <div key={pharm.id} className="p-6 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-50/50 transition-colors gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-lg text-slate-900">{pharm.name}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#e8f3d6] text-[#173822] uppercase tracking-wider">
                                            Partner
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mb-3">{pharm.address}</p>
                                    
                                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">
                                        <div>
                                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Email</span>
                                            <span className="font-medium">{pharm.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Phone</span>
                                            <span className="font-medium">{pharm.phone || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Coordinates</span>
                                            <span className="font-medium">
                                                {pharm.latitude && pharm.longitude 
                                                    ? `${pharm.latitude.toFixed(4)}, ${pharm.longitude.toFixed(4)}`
                                                    : 'Not set'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                                    <button
                                        onClick={() => handleOpenEdit(pharm)}
                                        className="p-2 text-slate-600 hover:text-[#173822] hover:bg-slate-100 rounded-lg transition-all"
                                        title="Edit Profile"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pharm.id)}
                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Suspend / Delete Pharmacy"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
