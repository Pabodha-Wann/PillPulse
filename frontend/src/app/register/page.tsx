'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const MapSelector = dynamic(() => import('@/components/MapSelector'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100/50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium">Loading Map...</div>
})

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        latitude: 6.9271,
        longitude: 79.8612,
        phone: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await authService.registerPharmacy(formData)
            toast.success('Registration successful! Please login.')
            router.push('/login')
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Registration failed'
            toast.error(errorMsg)
            console.error('Registration error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-outfit)' }}>
            {/* Left Side: Branding/Information */}
            <div className="hidden lg:flex w-[45%] bg-[#e8f3d6] flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white/40 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <Link href="/" className="text-3xl text-[#173822] flex items-center gap-3">
                        PillPulse
                    </Link>

                    <div className="mt-24 space-y-6">
                        <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-[#173822]">
                            Join the smartest<br />
                            pharmacy network.
                        </h1>
                        <p className="text-xl font-medium max-w-md opacity-80 leading-relaxed text-[#173822]">
                            Connect your pharmacy to thousands of patients looking for their prescriptions seamlessly.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 text-[#173822] font-semibold opacity-80">
                        <span>Trusted by 500+ pharmacies nationwide</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-[55%] flex flex-col px-8 sm:px-16 lg:px-24 py-16 lg:py-24 bg-white overflow-y-auto max-h-screen">
                <div className="max-w-xl w-full mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Create your account</h2>
                        <p className="text-gray-500 font-medium text-lg">Let's get your pharmacy set up on PillPulse.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pharmacy Name */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Pharmacy Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., City Pharmacy"
                                    className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g., 0112345678"
                                    className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@pharmacy.com"
                                className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full street address"
                                className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                required
                            />
                        </div>

                        {/* Location Info */}
                        <div className="space-y-2 pt-2">
                            <label className="block text-sm font-semibold text-gray-700">Pinpoint Location on Map</label>
                            <p className="text-xs text-gray-500 font-medium pb-2">Click anywhere on the map to set your pharmacy's exact location.</p>

                            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                <MapSelector
                                    initialLat={formData.latitude}
                                    initialLng={formData.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>

                            <div className="text-xs text-gray-500  flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
                                Selected Coordinates: <span className="text-gray-900">{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2a2924] hover:bg-[#1f1e1a] text-white p-4 rounded-xl font-bold transition-all shadow-xl shadow-black/10 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>

                        {/* Link to Login */}
                        <p className="text-center text-sm font-medium text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#697f4e] font-bold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}