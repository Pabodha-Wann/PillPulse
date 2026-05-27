import axiosInstance from "@/lib/axiosInstance"
import { Pharmacy } from "@/lib/types"

export const authService = {
    registerPharmacy: async (data: {
        name: string
        email: string
        password: string
        address: string
        latitude: number
        longitude: number
        phone: string
    }): Promise<Pharmacy> => {
        const response = await axiosInstance.post('/api/pharmacies/register', data)
        return response.data
    },


    loginPharmacy: async (email: string, password: string) => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: email,
                    password: password,
                    client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                    grant_type: 'password',
                }).toString(),
            }
        )


        if (!response.ok) {
            throw new Error('Login failed')
        }

        return response.json()
    },

    // Get pharmacy details
    getPharmacy: async (id: number): Promise<Pharmacy> => {
        const response = await axiosInstance.get(`/api/pharmacies/${id}`)
        return response.data
    },

    //update pharmacy
    updatePharmacy: async (id: number, data: Partial<Pharmacy>): Promise<Pharmacy> => {
        const response = await axiosInstance.put(`/api/pharmacies/${id}`, data)
        return response.data
    },


}