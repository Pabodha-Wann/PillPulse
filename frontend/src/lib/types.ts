export interface Pharmacy {
    id: number
    name: string
    email: string
    address: string
    latitude: number
    longitude: number
    phone: string
    isVerified: boolean
    createdAt: string
}

export interface Medicine {
    id: number
    name: string
    genericName: string
    category: string
    description: string
    manufacturer: string
}

export interface PharmacyMedicine {
    id: number
    pharmacyId: number
    medicineId: number
    medicineName: string
    quantityInStock: number
    price: number
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

export interface SearchResult {
    pharmacyId: number
    pharmacyName: string
    address: string
    phone: string
    distanceKm: number
    medicineId: number
    medicineName: string
    quantityInStock: number
    price: number
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
    latitude: number
    longitude: number
}

export interface AlertSubscription {
    id: number
    userEmail: string
    userPhone?: string
    medicineId: number
    medicineName: string
    pharmacyId?: number
    pharmacyName?: string
    isActive: boolean
    createdAt: string
}

export interface AlertHistory {
    id: number
    userEmail: string
    medicineName: string
    pharmacyId: number
    message: string
    sentAt: string
}