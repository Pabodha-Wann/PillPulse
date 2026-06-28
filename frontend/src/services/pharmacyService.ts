import axiosInstance from "@/lib/axiosInstance";
import { Pharmacy } from "@/lib/types";

export const pharmacyService = {
    // Get all pharmacies
    getAllPharmacies: async (): Promise<Pharmacy[]> => {
        const response = await axiosInstance.get('/api/pharmacies');
        return response.data;
    },

    // Get specific pharmacy by ID
    getPharmacy: async (id: number): Promise<Pharmacy> => {
        const response = await axiosInstance.get(`/api/pharmacies/${id}`);
        return response.data;
    },

    // Register a new pharmacy (Admin or Self-registration)
    registerPharmacy: async (data: {
        name: string;
        email: string;
        password?: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string;
    }): Promise<Pharmacy> => {
        const response = await axiosInstance.post('/api/pharmacies/register', data);
        return response.data;
    },

    // Update pharmacy profile
    updatePharmacy: async (id: number, data: Partial<Pharmacy>): Promise<Pharmacy> => {
        const response = await axiosInstance.put(`/api/pharmacies/${id}`, data);
        return response.data;
    },

    // Delete or suspend pharmacy
    deletePharmacy: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/api/pharmacies/${id}`);
    },

    // Verify a pharmacy
    verifyPharmacy: async (id: number): Promise<Pharmacy> => {
        const response = await axiosInstance.put(`/api/pharmacies/${id}/verify`);
        return response.data;
    }
};
