import axiosClient from "../config/axiosClient";

class AnhApi {
    getAll = async () => {
        try {
            const url = '/anhs';
            const response = await axiosClient.get(url);
            // console.log("API Response:", response);
            return response;
        } catch (error) {
            console.error("Error fetching images:", error);
            throw error;
        }
    }

    getOne = (id) => {
        const url = `/anhs/${id}`;
        return axiosClient.get(url);
    }

    postanh = (data) => {
        const url = '/anhs';
        return axiosClient.post(url, data);
    }

    deleteanh = (type, id) => {
        const url = `/anhs/${type}/${id}`;
        return axiosClient.delete(url);
    }

    editanh = (data) => {
        const url = `/anhs/${data.idsua}`;
        return axiosClient.patch(url, data);
    }

    // Thêm các phương thức mới
    getByTour = (tourId) => {
        const url = `/anhs/tour/${tourId}`;
        return axiosClient.get(url);
    }

    getByHotel = (hotelId) => {
        const url = `/anhs/hotel/${hotelId}`;
        return axiosClient.get(url);
    }
}

const anhApi = new AnhApi();
export default anhApi;