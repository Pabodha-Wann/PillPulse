'use client'

import { useState, useEffect } from 'react'
import { medicineService } from '@/services/medicineService'
import { toast } from 'react-toastify'
import type { Medicine, PharmacyMedicine } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function MedicinesPage() {
    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const pharmacyId = user?.id

    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [pharmacyMedicines, setPharmacyMedicines] = useState<PharmacyMedicine[]>([])
    const [loading, setLoading] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null)
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')

    // Load data on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isAuthenticated()) {
                toast.error("Session missing. Please log in.")
                router.push('/')
                return
            }

            if (pharmacyId) {
                loadData()
            }
        }
    }, [pharmacyId, isAuthenticated])

    const loadData = async () => {
        setLoading(true)
        try {
            const [allMeds, pharmMeds] = await Promise.all([
                medicineService.getAllMedicines(),
                medicineService.getPharmacyMedicines(pharmacyId!),
            ])
            setMedicines(allMeds)
            setPharmacyMedicines(pharmMeds)

        } catch (error) {
            toast.error('Failed to load medicines')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedMedicine || !quantity || !price) {
            toast.error('Fill all fields')
            return
        }

        try {
            await medicineService.addMedicineToPharmacy({
                pharmacyId: pharmacyId!,
                medicineId: selectedMedicine,
                quantityInStock: parseInt(quantity),
                price: parseFloat(price),
            })

            toast.success('Medicine added!')
            setShowAddForm(false)
            setSelectedMedicine(null)
            setQuantity('')
            setPrice('')
            await loadData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add medicine')
        }
    }

    const handleUpdateStock = async (medicineId: number, newQuantity: string) => {
        if (!newQuantity) return

        const existingMed = pharmacyMedicines.find(med => med.medicineId === medicineId)
        const existingPrice = existingMed ? existingMed.price : 0

        try {
            await medicineService.updatePharmacyMedicineStock(pharmacyId!, medicineId, {
                quantityInStock: parseInt(newQuantity),
                price: existingPrice,
            })

            toast.success('Stock updated!')
            await loadData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update stock')
        }
    }

    const handleUpdatePrice = async (medicineId: number, newPrice: string) => {
        if (!newPrice) return

        const existingMed = pharmacyMedicines.find(med => med.medicineId === medicineId)
        const existingQty = existingMed ? existingMed.quantityInStock : 0

        try {
            await medicineService.updatePharmacyMedicineStock(pharmacyId!, medicineId, {
                quantityInStock: existingQty,
                price: parseFloat(newPrice),
            })

            toast.success('Price updated!')
            await loadData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update price')
        }
    }

    const handleRemoveMedicine = async (medicineId: number) => {
        if (!window.confirm("Are you sure you want to remove this medicine from your inventory?")) {
            return
        }

        try {
            await medicineService.removePharmacyMedicine(pharmacyId!, medicineId)
            toast.success('Medicine removed from inventory!')
            await loadData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove medicine')
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-medium animate-pulse">Syncing PillPulse Inventory...</p>
            </div>
        )
    }

    return (
        <div className="p-8 md:p-12 max-w-6xl w-full mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Manage Inventory</h1>
                    <p className="text-slate-500 text-lg">Add new medicines and update stock quantities.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[#173822] hover:bg-[#204a2d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    {showAddForm ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Medicine
                        </>
                    )}
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="mb-10 p-6 md:p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 tracking-tight">Add Medicine to Your Pharmacy</h2>
                    <form onSubmit={handleAddMedicine} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Medicine Dropdown */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Medicine</label>
                                <select
                                    value={selectedMedicine || ''}
                                    onChange={(e) => setSelectedMedicine(parseInt(e.target.value))}
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-700"
                                    required
                                >
                                    <option value="">Choose a medicine...</option>
                                    {medicines.map((med) => (
                                        <option key={med.id} value={med.id}>
                                            {med.name} - {med.genericName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="e.g. 100"
                                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price (Rs.)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">Rs.</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full border border-slate-200 p-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 transition-all text-slate-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="bg-[#e8f3d6] hover:bg-[#d4e6b5] text-[#173822] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                            >
                                Save to Inventory
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Medicines List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Your Medicines</h2>
                </div>

                {pharmacyMedicines.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <p className="text-lg font-medium text-slate-900 mb-1">No medicines added yet</p>
                        <p className="text-sm">Click the 'Add Medicine' button above to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {pharmacyMedicines.map((med) => (
                            <div key={med.id} className="p-6 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-50/50 transition-colors gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-slate-900 mb-3">{med.medicineName}</h3>
                                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                                        <div>
                                            <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-[11px]">Quantity In Stock</p>
                                            <p className="font-semibold text-slate-700 text-base">{med.quantityInStock}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-[11px]">Price</p>
                                            <p className="font-semibold text-slate-700 text-base">Rs. {med.price.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-[11px]">Status</p>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${med.status === 'IN_STOCK'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : med.status === 'LOW_STOCK'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-rose-50 text-rose-600'
                                                    }`}
                                            >
                                                {med.status === 'IN_STOCK' ? 'In Stock' : med.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Update Controls (Qty, Price, Delete) */}
                                <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                    {/* Qty Input */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:block">Qty:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="New qty"
                                            onBlur={(e) => {
                                                if (e.target.value) {
                                                    handleUpdateStock(med.medicineId, e.target.value)
                                                    e.target.value = ''
                                                }
                                            }}
                                            className="border border-slate-200 p-2 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 text-sm text-slate-700 font-medium transition-all"
                                        />
                                    </div>

                                    {/* Price Input */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:block">Price:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="New price"
                                            onBlur={(e) => {
                                                if (e.target.value) {
                                                    handleUpdatePrice(med.medicineId, e.target.value)
                                                    e.target.value = ''
                                                }
                                            }}
                                            className="border border-slate-200 p-2 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-[#173822] focus:border-transparent bg-slate-50 text-sm text-slate-700 font-medium transition-all"
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleRemoveMedicine(med.medicineId)}
                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Remove from inventory"
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