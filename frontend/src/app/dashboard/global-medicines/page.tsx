'use client'

import { useState, useEffect } from 'react'
import { medicineService } from '@/services/medicineService'
import { toast } from 'react-toastify'
import type { Medicine } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function GlobalMedicinesPage() {
    const { isAdmin, isAuthenticated } = useAuthStore()
    const router = useRouter()

    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    
    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        category: '',
        description: '',
        manufacturer: ''
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
            loadMedicines()
        }
    }, [isAdmin, isAuthenticated])

    const loadMedicines = async () => {
        setLoading(true)
        try {
            const data = await medicineService.getAllMedicines()
            setMedicines(data)
        } catch (error) {
            toast.error('Failed to load medicine catalog')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            genericName: '',
            category: '',
            description: '',
            manufacturer: ''
        })
        setShowForm(true)
    }

    const handleOpenEdit = (medicine: Medicine) => {
        setEditMode(true)
        setSelectedId(medicine.id)
        setFormData({
            name: medicine.name,
            genericName: medicine.genericName,
            category: medicine.category,
            description: medicine.description,
            manufacturer: medicine.manufacturer
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.genericName || !formData.category) {
            toast.error('Please fill required fields (Name, Generic Name, Category)')
            return
        }

        try {
            if (editMode && selectedId !== null) {
                await medicineService.updateMedicine(selectedId, formData)
                toast.success('Medicine catalog definition updated!')
            } else {
                await medicineService.createMedicine(formData)
                toast.success('New medicine added to global catalog!')
            }
            setShowForm(false)
            await loadMedicines()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed')
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to permanently delete this medicine from the global catalog? This removes it from all pharmacies' stock listings as well.")) {
            return
        }

        try {
            await medicineService.deleteMedicine(id)
            toast.success('Medicine deleted from global catalog!')
            await loadMedicines()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete medicine')
            console.error(error)
        }
    }

    if (loading && medicines.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-medium animate-pulse text-lg">Loading Medicine Catalog...</p>
            </div>
        )
    }

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto" style={{ fontFamily: 'var(--font-outfit)' }}>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Global Medicine Catalog</h1>
                    <p className="text-slate-500 text-lg">Manage the master catalog of medications available to pharmacy partners in PillPulse.</p>
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
                            Add New Medicine
                        </>
                    )}
                </button>
            </div>

            {/* Creation / Edit Form */}
            {showForm && (
                <div className="mb-10 p-6 md:p-8 bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
                        {editMode ? 'Edit Medicine Definition' : 'Define New Medication Master'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Brand Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Brand / Commercial Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Panadol"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    required
                                />
                            </div>

                            {/* Generic Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Chemical / Generic Name *</label>
                                <input
                                    type="text"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleChange}
                                    placeholder="e.g. Paracetamol"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Analgesics, Antibiotics, Antihistamines"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                    required
                                />
                            </div>

                            {/* Manufacturer */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Manufacturer</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                    placeholder="e.g. GlaxoSmithKline"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Description & Usage Guidelines</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Indications, dosage details, cautionary notes..."
                                    rows={4}
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900 font-medium"
                                />
                            </div>
                        </div>

                        {/* Actions */}
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
                                {editMode ? 'Update Definition' : 'Register Medication'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Medicines List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">System Master Catalog ({medicines.length})</h2>
                </div>

                {medicines.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <p className="text-lg font-medium text-slate-900 mb-1">No medicines in catalog</p>
                        <p className="text-sm">Click 'Add New Medicine' above to populate the master catalog.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {medicines.map((med) => (
                            <div key={med.id} className="p-6 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-50/50 transition-colors gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h3 className="font-semibold text-lg text-slate-900">{med.name}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f3d6] text-[#173822] uppercase tracking-wider">
                                            {med.category}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-[#173822] mb-2">{med.genericName}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 max-w-3xl mb-3">{med.description || 'No description provided.'}</p>
                                    
                                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                        Manufacturer: <span className="text-slate-600 font-bold">{med.manufacturer || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                                    <button
                                        onClick={() => handleOpenEdit(med)}
                                        className="p-2 text-slate-600 hover:text-[#173822] hover:bg-slate-100 rounded-lg transition-all"
                                        title="Edit Definition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(med.id)}
                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Delete Definition"
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
