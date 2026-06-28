'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { searchService } from '@/services/searchService'
import { alertService } from '@/services/alertService'
import { toast } from 'react-toastify'
import type { SearchResult } from '@/lib/types'
import Link from 'next/link'

// Load map dynamically to prevent SSR issues with Leaflet
const SearchMap = dynamic(() => import('@/components/SearchMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 border-l border-slate-200">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#173822] border-t-transparent"></div>
            <p className="text-sm font-semibold">Initializing Maps...</p>
        </div>
    )
})

export default function SearchPage() {
    const [medicineName, setMedicineName] = useState('')
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
    const [radius, setRadius] = useState<number>(10)
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null)

    // Subscription modal state
    const [subModalOpen, setSubModalOpen] = useState(false)
    const [selectedMedId, setSelectedMedId] = useState<number | null>(null)
    const [selectedMedName, setSelectedMedName] = useState('')
    const [selectedPharmacyIdForSub, setSelectedPharmacyIdForSub] = useState<number | null>(null)
    const [selectedPharmacyNameForSub, setSelectedPharmacyNameForSub] = useState('')
    const [subEmail, setSubEmail] = useState('')
    const [subPhone, setSubPhone] = useState('')
    const [submittingSub, setSubmittingSub] = useState(false)

    // Refs for scrolling to highlighted cards
    const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

    // Get user location on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                },
                () => {
                    // Default to Colombo coordinates
                    setLocation({
                        latitude: 6.9271,
                        longitude: 79.8612,
                    })
                    toast.info('Using default location (Colombo)')
                }
            )
        }
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!medicineName.trim()) {
            toast.error('Please enter a medicine name')
            return
        }

        if (!location) {
            toast.error('Acquiring your location...')
            return
        }

        setLoading(true)
        setSearched(true)
        setSelectedPharmacyId(null)

        try {
            const data = await searchService.searchNearbyPharmacies(
                medicineName,
                location.latitude,
                location.longitude,
                radius
            )
            console.log("Search Results Data: ", data)
            setResults(data)

            if (data.length === 0) {
                toast.info('No pharmacies found with this medicine inside search radius.')
            } else {
                toast.success(`Found ${data.length} pharmacies nearby!`)
            }
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setResults([])
                toast.info('No pharmacies found with this medicine inside search radius.')
            } else {
                toast.error(error.response?.data?.message || error.message || 'Search failed')
                console.error('Search error:', error)
            }
        } finally {
            setLoading(false)
        }
    }

    const selectPharmacy = (pharmacy: SearchResult) => {
        setSelectedPharmacyId(pharmacy.pharmacyId)

        // Scroll list to card
        const cardElement = cardRefs.current[pharmacy.pharmacyId]
        if (cardElement) {
            cardElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    }

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMedId || !selectedPharmacyIdForSub) {
            toast.error('Technical Error: Medicine ID or Pharmacy ID is missing for subscription!')
            console.error('Subscription Error: selectedMedId or selectedPharmacyIdForSub is null. Selected name:', selectedMedName)
            return
        }
        if (!subEmail.trim()) {
            toast.error('Email address is required')
            return
        }

        setSubmittingSub(true)
        try {
            await alertService.subscribe({
                userEmail: subEmail.trim(),
                userPhone: subPhone.trim() || undefined,
                medicineId: selectedMedId,
                pharmacyId: selectedPharmacyIdForSub,
                pharmacyName: selectedPharmacyNameForSub
            })
            toast.success(`Subscribed successfully for ${selectedMedName} stock alerts at ${selectedPharmacyNameForSub}!`)
            setSubModalOpen(false)
            setSubEmail('')
            setSubPhone('')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to subscribe')
            console.error(error)
        } finally {
            setSubmittingSub(false)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden" style={{ fontFamily: 'var(--font-outfit)' }}>

            {/* Left Column: Search & Results List */}
            <div className="w-full lg:w-[42%] flex flex-col h-full bg-slate-50 border-r border-slate-200 z-10">

                {/* Header & Search Form */}
                <div className="p-6 md:p-8 bg-white border-b border-slate-100 shadow-sm">
                    <div className="mb-6">
                        <Link href="/" className="text-slate-400 text-xs font-semibold hover:text-[#173822] transition-colors flex items-center gap-1.5 mb-3">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            <span>Back to home</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#173822]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                            </svg>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Search Medicines
                            </h1>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Locate pharmacies carrying your medicine near you.</p>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Panadol, Amoxicillin"
                                    value={medicineName}
                                    onChange={(e) => setMedicineName(e.target.value)}
                                    className="flex-1 border border-slate-200 bg-slate-50/50 p-3 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-slate-400 text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#173822] hover:bg-[#204a2d] text-white px-6 rounded-xl font-bold transition-all shadow-lg shadow-black/10 disabled:opacity-50 text-sm"
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>

                        {/* Search Radius Slider */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <span>Search Radius</span>
                                <span className="text-[#173822] font-extrabold">{radius} km</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={radius}
                                onChange={(e) => setRadius(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#173822]"
                            />
                        </div>
                    </form>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#173822] border-t-transparent"></div>
                            <p className="text-sm font-semibold">Scanning nearby pharmacies...</p>
                        </div>
                    )}

                    {!loading && !searched && (
                        <div className="text-center py-16 text-slate-400">
                            <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <p className="text-base font-semibold text-slate-800 mb-1">Enter a medicine to search</p>
                            <p className="text-xs max-w-xs mx-auto">We'll show you exactly where the pharmacies are and list them by distance.</p>
                        </div>
                    )}

                    {searched && !loading && results.length === 0 && (
                        <div className="text-center py-16 text-slate-400">
                            <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-base font-semibold text-slate-800 mb-1">No pharmacies found</p>
                            <p className="text-xs max-w-xs mx-auto">Try extending your search radius or searching for another medicine.</p>
                        </div>
                    )}

                    {searched && !loading && results.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <span>Results ({results.length})</span>
                                <span>Sorted by Nearest</span>
                            </div>

                            {results.map((pharmacy) => (
                                <div
                                    key={pharmacy.pharmacyId}
                                    ref={(el) => { cardRefs.current[pharmacy.pharmacyId] = el }}
                                    onClick={() => selectPharmacy(pharmacy)}
                                    className={`p-5 bg-white rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${selectedPharmacyId === pharmacy.pharmacyId
                                            ? 'border-[#173822] ring-4 ring-[#173822]/5 shadow-md transform -translate-y-0.5'
                                            : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{pharmacy.pharmacyName}</h3>
                                            <span className="bg-slate-100 text-[#173822] text-xs font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                                                <svg className="w-3 h-3 text-[#173822]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                {pharmacy.distanceKm.toFixed(1)} km
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium mb-3">{pharmacy.address}</p>
                                        <p className="text-slate-700 text-sm font-semibold flex items-center gap-2 mb-4">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.96-6.963l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                            {pharmacy.phone}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-100/80 my-1 pt-3">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Medicine</p>
                                                <p className="font-bold text-slate-800 text-sm">{pharmacy.medicineName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Price</p>
                                                <p className="font-extrabold text-slate-900 text-sm">Rs. {pharmacy.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Quantity</p>
                                                <p className="font-extrabold text-slate-800 text-xs">{pharmacy.quantityInStock} left</p>
                                            </div>
                                            <div>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${pharmacy.status === 'IN_STOCK'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : pharmacy.status === 'LOW_STOCK'
                                                                ? 'bg-amber-50 text-amber-600'
                                                                : 'bg-rose-50 text-rose-600'
                                                        }`}
                                                >
                                                    {pharmacy.status === 'IN_STOCK' ? 'In Stock' : pharmacy.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedMedId(pharmacy.medicineId)
                                            setSelectedMedName(pharmacy.medicineName)
                                            setSelectedPharmacyIdForSub(pharmacy.pharmacyId)
                                            setSelectedPharmacyNameForSub(pharmacy.pharmacyName)
                                            setSubModalOpen(true)
                                        }}
                                        className="mt-4 w-full bg-[#e8f3d6] hover:bg-[#d4e6b5] text-[#173822] py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <svg className="w-3.5 h-3.5 text-[#173822]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        Subscribe to Alert
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Full Screen Leaflet Map */}
            <div className="w-full lg:w-[58%] h-[350px] lg:h-full relative shadow-inner">
                {location ? (
                    <SearchMap
                        userLat={location.latitude}
                        userLng={location.longitude}
                        results={results}
                        radiusKm={radius}
                        selectedPharmacyId={selectedPharmacyId}
                        onSelectPharmacy={selectPharmacy}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-[#173822] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <p className="text-sm font-semibold">Acquiring your location...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Glassmorphic Subscription Modal */}
            {subModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 duration-300">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                                        Stock Alert Setup
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Get notified instantly when stock becomes available.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSubModalOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-[#e8f3d6] px-4 py-3 rounded-2xl mb-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 bg-[#173822] rounded-lg text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="text-[10px] font-bold text-[#173822]/80 uppercase tracking-wider block">Selected Medicine</span>
                                        <span className="font-extrabold text-[#173822] text-sm">{selectedMedName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 border-t border-[#173822]/10 pt-2.5">
                                    <span className="p-2 bg-[#173822] rounded-lg text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="text-[10px] font-bold text-[#173822]/80 uppercase tracking-wider block">Target Pharmacy</span>
                                        <span className="font-extrabold text-[#173822] text-sm">{selectedPharmacyNameForSub}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                {/* Email Address */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="yourname@example.com"
                                        value={subEmail}
                                        onChange={(e) => setSubEmail(e.target.value)}
                                        className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-semibold text-gray-900 placeholder:text-slate-400 placeholder:font-normal text-sm"
                                        required
                                    />
                                </div>

                                {/* Phone Number (SMS) */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Phone Number <span className="text-slate-400 font-normal">(Optional for SMS alerts)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="e.g. +94771234567"
                                        value={subPhone}
                                        onChange={(e) => setSubPhone(e.target.value)}
                                        className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-semibold text-gray-900 placeholder:text-slate-400 placeholder:font-normal text-sm"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSubModalOpen(false)}
                                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingSub}
                                        className="flex-1 bg-[#173822] hover:bg-[#204a2d] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                                    >
                                        {submittingSub ? 'Subscribing...' : 'Activate Alerts'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}