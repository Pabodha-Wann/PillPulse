import { useAuthStore } from "@/store/authStore"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": 'application/json'
    }
})

const decodeJwt = (token: string) => {
    try {
        const payload = token.split('.')[1]
        if (!payload) return null
        const decoded = typeof window !== 'undefined' ? window.atob(payload) : Buffer.from(payload, 'base64').toString('binary')
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

const isTokenExpired = (token: string) => {
    const decoded = decodeJwt(token)
    if (!decoded || !decoded.exp) return true
    // Refresh if expiring in less than 30 seconds
    return decoded.exp < Date.now() / 1000 + 30
}

let refreshPromise: Promise<string | null> | null = null

const refreshTokenCall = async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/refresh`, {
        refresh_token: refreshToken
    })
    return response.data
}

//request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        let token = useAuthStore.getState().token
        const refreshToken = useAuthStore.getState().refreshToken

        if (token && refreshToken && isTokenExpired(token)) {
            try {
                if (!refreshPromise) {
                    refreshPromise = refreshTokenCall(refreshToken)
                        .then((data) => {
                            useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
                            refreshPromise = null
                            return data.access_token
                        })
                        .catch((err) => {
                            console.error("Token refresh failed", err)
                            refreshPromise = null
                            useAuthStore.getState().logout()
                            if (typeof window !== 'undefined') {
                                window.location.href = '/login'
                            }
                            return null
                        })
                }
                const newToken = await refreshPromise
                if (newToken) {
                    token = newToken
                }
            } catch (e) {
                console.error("Token auto-refresh failed internally", e)
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)


//response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance