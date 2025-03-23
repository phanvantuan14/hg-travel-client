import { message } from "antd";
import axiosClient from "../config/axiosClient";

class UserroleApi {
    getAll = async (params) => {
        const url = "/userroles";
        return await axiosClient.get(url, { params });
    };
    postuserrole = (params) => {
        const url = "/userroles";
        return axiosClient
            .post(url, params)
            .then((data) => {
                message.success("Thêm thành công!");
            })
            .catch((err) => {
                message.error("Có lỗi xảy ra!");
            });
    };
    deleteuserrole = (id) => {
        const url = `/userroles/${id}`;
        return axiosClient
            .delete(url)
            .then((data) => {
                message.success("Xoá thành công!");
            })
            .catch((err) => {
                message.error("Có lỗi xảy ra!");
            });
    };
    edituserrole = async (params) => {
        try {
            const url = `/userroles/${params.idsua}`;
            const response = await axiosClient.patch(url, {
                roleId: params.roleId,
            });

            // Kiểm tra response
            if (response) {
                message.success("Cập nhật quyền thành công!");
                return response;
            }
            throw new Error("Không nhận được phản hồi từ server");
        } catch (error) {
            console.error("API Error:", error);
            message.error(
                error.response?.data?.message ||
                    "Có lỗi xảy ra khi cập nhật quyền!"
            );
            throw error;
        }
    };
    edituserroleHeader = (params) => {
        const url = `/userroles/${params.idsua}`;
        console.log(params);
        return axiosClient
            .patch(url, params)
            .then((data) => {
                return data.data;
            })
            .catch((err) => {
                message.error("Có lỗi xảy ra!");
            });
    };
    getuserrole = () => {
        const url = "/userroles";
        return axiosClient.get(url).then((data) => {
            return data.data;
        });
    };
}
const userroleApi = new UserroleApi();
export default userroleApi;
