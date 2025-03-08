import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hotelApi from '../../../../api/hotel/hotelApi';

// Tạo action async
export const hotelData = createAsyncThunk(
    'hotels/hotelData',
    async () => {
        try {
            const response = await hotelApi.getAll();
            return response; // Trả về trực tiếp response, không cần .data
        } catch (error) {
            console.error("Error in thunk:", error);
            throw error;
        }
    }
);

const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        hotel: {
            data: [], 
        },
        loading: false,
        error: null,
    },
    reducers: {
        addhotel: (state, action) => {
            hotelApi.posthotel(action.payload);
        },
        removehotel: (state, action) => {
            hotelApi.deletehotel(action.payload);
        },
        updatehotel: (state, action) => {
            hotelApi.edithotel(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(hotelData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hotelData.fulfilled, (state, action) => {
                state.loading = false;
                // Kiểm tra và gán dữ liệu an toàn
                if (action.payload && Array.isArray(action.payload)) {
                    state.hotel.data = action.payload;
                } else if (action.payload && Array.isArray(action.payload.data)) {
                    state.hotel.data = action.payload.data;
                } else {
                    state.hotel.data = [];
                }
            })
            .addCase(hotelData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.hotel.data = []; // Reset data khi có lỗi
            });
    },
});

const { reducer, actions } = hotelSlice;
export const { addhotel, removehotel, updatehotel } = actions;

export default reducer;