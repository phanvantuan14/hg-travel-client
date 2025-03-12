import axiosClient from "../config/axiosClient";

const vnpayApi = {
    createPaymentUrl: async (params) => {
        try {
            const response = await axiosClient.post(
                "/vnpay/create_payment_url",
                params
            );
            return response;
        } catch (error) {
            console.error("Error creating payment URL:", error);
            throw error;
        }
    },

    verifyPayment: async (params) => {
        try {
            const response = await axiosClient.get("/vnpay/verify_payment", {
                params,
            });
            return response;
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw error;
        }
    },
};

export default vnpayApi;
