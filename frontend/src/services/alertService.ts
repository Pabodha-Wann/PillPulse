import axiosInstance from "@/lib/axiosInstance";
import { AlertSubscription, AlertHistory } from "@/lib/types";

export const alertService = {
    // Subscribe to stock alerts for a medicine
    subscribe: async (data: {
        userEmail: string;
        userPhone?: string;
        medicineId: number;
    }): Promise<AlertSubscription> => {
        const response = await axiosInstance.post('/api/alerts/subscribe', data);
        return response.data;
    },

    // Get all subscriptions for a user email
    getUserSubscriptions: async (email: string): Promise<AlertSubscription[]> => {
        const response = await axiosInstance.get(`/api/alerts/subscriptions/${email}`);
        return response.data;
    },

    // Get all active/global subscriptions for admin dashboard
    getAllSubscriptions: async (): Promise<AlertSubscription[]> => {
        const response = await axiosInstance.get('/api/alerts/subscriptions');
        return response.data;
    },

    // Unsubscribe from alerts for a medicine
    unsubscribe: async (email: string, medicineId: number): Promise<void> => {
        await axiosInstance.delete(`/api/alerts/unsubscribe/${email}/medicine/${medicineId}`);
    },

    // Get alert notification history for a user email
    getUserAlertHistory: async (email: string): Promise<AlertHistory[]> => {
        const response = await axiosInstance.get(`/api/alerts/history/${email}`);
        return response.data;
    }
};
