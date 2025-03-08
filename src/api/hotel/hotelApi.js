import { message } from "antd";
import axiosClient from "../config/axiosClient";

class HotelApi {
    getAll = async () => {
        try {
            const url = '/hotels';
            const response = await axiosClient.get(url);
            // Kiểm tra và log response để debug
            // console.log("API Response:", response);
            
            // Kiểm tra response có đúng cấu trúc không
            if (response && response.data) {
                return response.data;
            } else {
                throw new Error("Dữ liệu không đúng định dạng");
            }
        } catch (error) {
            console.error("Error in getAll:", error);
            message.error("Không thể tải danh sách khách sạn!");
            throw error;
        }
    };

    getOne = async (id) => {
        try {
            const url = `/hotels/${id}`;
            const response = await axiosClient.get(url);
            if (response && response.data) {
                return response.data;
            }
            throw new Error("Không tìm thấy dữ liệu khách sạn");
        } catch (error) {
            console.error("Error in getOne:", error);
            message.error("Không thể tải thông tin khách sạn!");
            throw error;
        }
    };

    posthotel = async (params) => {
        try {
            const url = '/hotels';
            const response = await axiosClient.post(url, params);
            if (response && response.data) {
                message.success("Thêm khách sạn thành công!");
                return response.data;
            }
            throw new Error("Không nhận được phản hồi từ server");
        } catch (error) {
            console.error("Error in posthotel:", error);
            message.error(error.response?.data?.error || "Có lỗi xảy ra khi thêm khách sạn!");
            throw error;
        }
    };

    deletehotel = async (id) => {
        try {
            const url = `/hotels/${id}`;
            const response = await axiosClient.delete(url);
            if (response && response.data) {
                message.success("Xóa khách sạn thành công!");
                return response.data;
            }
            throw new Error("Không nhận được phản hồi từ server");
        } catch (error) {
            console.error("Error in deletehotel:", error);
            message.error(error.response?.data?.error || "Có lỗi xảy ra khi xóa khách sạn!");
            throw error;
        }
    };

    edithotel = async (params) => {
        try {
            const url = `/hotels/${params.idsua}`;
            const response = await axiosClient.patch(url, params);
            if (response && response.data) {
                message.success("Cập nhật khách sạn thành công!");
                return response.data;
            }
            throw new Error("Không nhận được phản hồi từ server");
        } catch (error) {
            console.error("Error in edithotel:", error);
            message.error(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật khách sạn!");
            throw error;
        }
    }
}

const hotelApi = new HotelApi();
export default hotelApi;