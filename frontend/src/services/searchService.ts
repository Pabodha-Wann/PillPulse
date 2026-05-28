import axiosInstance from '@/lib/axiosInstance'
import type { SearchResult } from '@/lib/types'

export const searchService = {
    // Search nearest pharmacies with medicine
    searchNearbyPharmacies: async (
        medicineName: string,
        latitude: number,
        longitude: number,
        radius: number = 10
    ): Promise<SearchResult[]> => {
        const response = await axiosInstance.get('/api/search', {
            params: {
                medicineName,
                latitude,
                longitude,
                radius,
            },
        })
        return response.data
    },
}