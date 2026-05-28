'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { setAuth, isLoggedIn } = useAuthStore()

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/dashboard')
        }
    }, [isLoggedIn, router])

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await authService.loginPharmacy(credentials.email, credentials.password)

            const accesstoken = response.access_token
            const pharmacy = response.user

            // Save token and user to Zustand store
            setAuth(pharmacy, accesstoken)

            toast.success('Login successful!')
            router.push('/dashboard')
        } catch (error: any) {
            const errorMsg = error.message || 'Login failed'
            toast.error(errorMsg)
            console.error('Login error:', error)
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
                            Welcome back to<br />
                            your dashboard.
                        </h1>
                        <p className="text-xl font-medium max-w-md opacity-80 leading-relaxed text-[#173822]">
                            Manage your pharmacy's prescriptions, stay connected with patients, and monitor your alerts.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 text-[#173822] font-semibold opacity-80">
                        <span>The smartest pharmacy network</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-[55%] flex flex-col px-8 sm:px-16 lg:px-24 py-16 lg:py-24 bg-white overflow-y-auto max-h-screen">
                <div className="max-w-md w-full mx-auto mt-auto mb-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Login</h2>
                        <p className="text-gray-500 font-medium text-lg">Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={credentials.email}
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
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                className="w-full border border-gray-200 bg-gray-50/50 p-3.5 rounded-xl focus:outline-none focus:border-[#8b9d77] focus:ring-4 focus:ring-[#8b9d77]/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2a2924] hover:bg-[#1f1e1a] text-white p-4 rounded-xl font-bold transition-all shadow-xl shadow-black/10 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>

                        {/* Link to Register */}
                        <p className="text-center text-sm font-medium text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[#697f4e] font-bold hover:underline">
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}