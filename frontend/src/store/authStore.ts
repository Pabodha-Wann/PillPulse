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
    setAuth: (user: Pharmacy, token: string) => void
    logout: () => void
    getPharmacyId: () => number | null,
    isAuthenticated: () => boolean
}

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            token: null,
            isLoggedIn: false
        }
    }

    try {
        const stored = localStorage.getItem(('pillpulse-auth'))
        if (stored) {
            const { user, token, isLoggedIn } = JSON.parse(stored)
            return { user, token, isLoggedIn }
        }
    } catch (e) {
        console.error("Failed to parse auth tokens", e)
    }

    return { user: null, token: null, isLoggedIn: false }
}

export const useAuthStore = create<AuthState>()(
    (set, get) => ({
        ...getInitialState(),

        setAuth: (user: Pharmacy, token: string) => {
            set({ user, token, isLoggedIn: true })
            localStorage.setItem('pillpulse-auth', JSON.stringify({ user, token, isLoggedIn: true }))
        },

        logout: () => {
            set({
                user: null,
                token: null,
                isLoggedIn: false
            })
            localStorage.removeItem('pillpulse-auth')
        },

        getPharmacyId: () => get().user?.id ?? null,

        isAuthenticated: () => !!get().token || get().isLoggedIn,
    })
)

