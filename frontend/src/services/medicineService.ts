import axiosInstance from "@/lib/axiosInstance";
import type { Medicine, PharmacyMedicine } from "@/lib/types";

export const medicineService = {

    //get all medicines
    getAllMedicines: async (): Promise<Medicine[]> => {
        const response = await axiosInstance.get('/api/medicines')
        return response.data
    },


    //get single medicine
    getMedicine: async (id: number): Promise<Medicine> => {
        const response = await axiosInstance.get(`/api/medicines/${id}`)
        return response.data
    },


    //create medicine
    createMedicine: async (data: {
        name: string
        genericName: string
        category: string
        description: string
        manufacturer: string
    }): Promise<Medicine> => {
        const response = await axiosInstance.post(`/api/medicines`, data)
        return response.data
    },


    //update medicine
    updateMedicine: async (id: number, data: Partial<Medicine>): Promise<Medicine> => {
        const response = await axiosInstance.put(`/api/medicines/${id}`, data)
        return response.data
    },


    //delete medicine
    deleteMedicine: async (id: number): Promise<void> => {
        axiosInstance.delete(`/api/medicines/${id}`)
    },


    // Get medicines in pharmacy
    getPharmacyMedicines: async (pharmacId: number): Promise<PharmacyMedicine[]> => {
        const response = await axiosInstance.get(`/api/medicines/pharmacy/${pharmacId}`)
        return response.data;
    },


    //Add medicine to pharmacy
    addMedicineToPharmacy: async (data: {
        pharmacyId: number
        medicineId: number
        quantityInStock: number
        price: number
    }): Promise<PharmacyMedicine> => {
        const response = await axiosInstance.post(`/api/medicines/addToPharmacy`, data)
        return response.data
    },


    //update medicine stock in pharmacy
    updatePharmacyMedicineStock: async (
        pharmacyId: number,
        medicineId: number,
        data: {
            quantityInStock: number
            price: number
        }
    ): Promise<PharmacyMedicine> => {
        const response = await axiosInstance.put(
            `/api/medicines/pharmacy/${pharmacyId}/medicine/${medicineId}`,
            data
        )
        return response.data
    },


    removePharmacyMedicine: async (pharmacyId: number, medicineId: number): Promise<void> => {
        await axiosInstance.delete(
            `/api/medicines/pharmacy/${pharmacyId}/medicine/${medicineId}`
        )
    },

    // Search for medicines by name
    searchMedicines: async (name: string): Promise<Medicine[]> => {
        const response = await axiosInstance.get(`/api/medicines/search`, {
            params: { name }
        })
        return response.data
    }

}