import { create } from "zustand"

interface Pharmacy {
    id: number
    name: string
    email: string
    address: string
    latitude: number
    longitude: number
    phone: string
}

interface AuthState {
    user: Pharmacy | null
    token: string | null
    isLoggedIn: boolean
    isAdmin: boolean
    userRole: 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
    setAuth: (user: Pharmacy, token: string) => void
    logout: () => void
    getPharmacyId: () => number | null
    isAuthenticated: () => boolean
}

const decodeJwt = (token: string) => {
    try {
        const payload = token.split('.')[1]
        if (!payload) return null
        // Decode base64 handling unicode/UTF-8
        const decoded = typeof window !== 'undefined' ? window.atob(payload) : Buffer.from(payload, 'base64').toString('binary')
        return JSON.parse(decoded)
    } catch (e) {
        console.error("JWT decoding failed", e)
        return null
    }
}

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            token: null,
            isLoggedIn: false,
            isAdmin: false,
            userRole: null as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
        }
    }

    try {
        const stored = localStorage.getItem('pillpulse-auth')
        if (stored) {
            const { user, token, isLoggedIn } = JSON.parse(stored)
            const decoded = token ? decodeJwt(token) : null
            const roles = decoded?.realm_access?.roles || []
            const isAdmin = roles.includes('SYSTEM_ADMIN')
            const userRole = isAdmin 
                ? 'SYSTEM_ADMIN' 
                : (roles.includes('PHARMACY_ADMIN') ? 'PHARMACY_ADMIN' : null) as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null

            return { user, token, isLoggedIn, isAdmin, userRole }
        }
    } catch (e) {
        console.error("Failed to parse auth tokens", e)
    }

    return { 
        user: null, 
        token: null, 
        isLoggedIn: false, 
        isAdmin: false, 
        userRole: null as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
    }
}

export const useAuthStore = create<AuthState>()(
    (set, get) => ({
        ...getInitialState(),

        setAuth: (user: Pharmacy, token: string) => {
            const decoded = decodeJwt(token)
            const roles = decoded?.realm_access?.roles || []
            const isAdmin = roles.includes('SYSTEM_ADMIN')
            const userRole = isAdmin 
                ? 'SYSTEM_ADMIN' 
                : (roles.includes('PHARMACY_ADMIN') ? 'PHARMACY_ADMIN' : null) as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null

            set({ user, token, isLoggedIn: true, isAdmin, userRole })
            localStorage.setItem('pillpulse-auth', JSON.stringify({ user, token, isLoggedIn: true }))
        },

        logout: () => {
            set({
                user: null,
                token: null,
                isLoggedIn: false,
                isAdmin: false,
                userRole: null
            })
            localStorage.removeItem('pillpulse-auth')
        },

        getPharmacyId: () => get().user?.id ?? null,

        isAuthenticated: () => !!get().token || get().isLoggedIn,
    })
)


