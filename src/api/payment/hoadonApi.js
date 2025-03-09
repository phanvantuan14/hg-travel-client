import { message } from "antd";
import axiosClient from "../config/axiosClient";

const hoadonApi = {
    getAll: () => {
        const url = '/hoadons';
        return axiosClient.get(url);
    },
    posthoadon: (params) => {
        const url = '/hoadons';
        return axiosClient.post(url, params).then(data => {
            message.success("Đặt vé thành công!");
        }).catch(err => {
            message.error("Có lỗi xảy ra!");
        });
    },
    deletehoadon: (id) => {
        const url = `/hoadons/${id}`;
        return axiosClient.delete(url).then(data => {
            message.success("Xoá thành công!");
        }).catch(err => {
            message.error("Có lỗi xảy ra!");
        });
    },
    edithoadon: (id, data) => {
        const url = `/hoadons/${id}`;
        return axiosClient.patch(url, data);
    }
};

export default hoadonApi;