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


        const response = await axiosInstance.post('/api/auth/login', {
            email,
            password,
        })

        return response.data
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