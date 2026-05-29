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
    refreshToken: string | null
    isLoggedIn: boolean
    isAdmin: boolean
    userRole: 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
    setAuth: (user: Pharmacy, token: string, refreshToken: string) => void
    setTokens: (token: string, refreshToken: string) => void
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
            refreshToken: null,
            isLoggedIn: false,
            isAdmin: false,
            userRole: null as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
        }
    }

    try {
        const stored = localStorage.getItem('pillpulse-auth')
        if (stored) {
            const { user, token, refreshToken, isLoggedIn } = JSON.parse(stored)
            const decoded = token ? decodeJwt(token) : null
            const roles = decoded?.realm_access?.roles || []
            const isAdmin = roles.includes('SYSTEM_ADMIN')
            const userRole = isAdmin 
                ? 'SYSTEM_ADMIN' 
                : (roles.includes('PHARMACY_ADMIN') ? 'PHARMACY_ADMIN' : null) as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null

            return { user, token, refreshToken, isLoggedIn, isAdmin, userRole }
        }
    } catch (e) {
        console.error("Failed to parse auth tokens", e)
    }

    return { 
        user: null, 
        token: null, 
        refreshToken: null,
        isLoggedIn: false, 
        isAdmin: false, 
        userRole: null as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null
    }
}

export const useAuthStore = create<AuthState>()(
    (set, get) => ({
        ...getInitialState(),

        setAuth: (user: Pharmacy, token: string, refreshToken: string) => {
            const decoded = decodeJwt(token)
            const roles = decoded?.realm_access?.roles || []
            const isAdmin = roles.includes('SYSTEM_ADMIN')
            const userRole = isAdmin 
                ? 'SYSTEM_ADMIN' 
                : (roles.includes('PHARMACY_ADMIN') ? 'PHARMACY_ADMIN' : null) as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null

            set({ user, token, refreshToken, isLoggedIn: true, isAdmin, userRole })
            localStorage.setItem('pillpulse-auth', JSON.stringify({ user, token, refreshToken, isLoggedIn: true }))
        },

        setTokens: (token: string, refreshToken: string) => {
            const decoded = decodeJwt(token)
            const roles = decoded?.realm_access?.roles || []
            const isAdmin = roles.includes('SYSTEM_ADMIN')
            const userRole = isAdmin 
                ? 'SYSTEM_ADMIN' 
                : (roles.includes('PHARMACY_ADMIN') ? 'PHARMACY_ADMIN' : null) as 'SYSTEM_ADMIN' | 'PHARMACY_ADMIN' | null

            set({ token, refreshToken, isAdmin, userRole })
            
            const currentAuth = localStorage.getItem('pillpulse-auth')
            if (currentAuth) {
                const parsed = JSON.parse(currentAuth)
                localStorage.setItem('pillpulse-auth', JSON.stringify({
                    ...parsed,
                    token,
                    refreshToken
                }))
            }
        },

        logout: () => {
            set({
                user: null,
                token: null,
                refreshToken: null,
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


