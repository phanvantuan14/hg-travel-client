import axiosClient from "../config/axiosClient";
import { message } from "antd";

const resetPasswordApi = {
    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post("/reset/forgot-password", {
                email,
            });
            message.success("Email đặt lại mật khẩu đã được gửi!");
            return response;
        } catch (error) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await axiosClient.post("/reset/reset-password", {
                token,
                newPassword,
            });
            message.success("Mật khẩu đã được cập nhật!");
            return response;
        } catch (error) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
            throw error;
        }
    },
};

export default resetPasswordApi;
