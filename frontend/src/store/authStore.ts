import { create } from "zustand"

interface AuthState {
    user: any
    token: string | null
    isPharmacy: boolean
    setAuth: (user: any, token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isPharmacy: false,
    setAuth: (user, token) => set({
        user,
        token,
        isPharmacy: true
    }),
    logout: () => set({
        user: null,
        token: null,
        isPharmacy: false
    })
}))