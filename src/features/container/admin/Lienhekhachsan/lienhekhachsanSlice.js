import axiosClient from "../../../../api/config/axiosClient";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Tạo async thunk actions
export const lienhekhachsanData = createAsyncThunk(
    'lienhekhachsans/lienhekhachsanData', 
    async () => {
        const response = await axiosClient.get('/lienhekhachsan');
        return response;
    }
);

export const updateStatus = createAsyncThunk(
    'lienhekhachsans/updateStatus',
    async ({id, status}) => {
        const response = await axiosClient.patch(`/lienhekhachsan/${id}`, { status });
        return response;
    }
);

export const deleteLienhe = createAsyncThunk(
    'lienhekhachsans/deleteLienhe',
    async (id) => {
        await axiosClient.delete(`/lienhekhachsan/${id}`);
        return id;
    }
);

const Lienhekhachsan = createSlice({
    name: "lienhekhachsans",
    initialState: {
        lienhe: [],
        loading: true,
        error: ''
    },
    reducers: {},
    extraReducers: {
        // Get all
        [lienhekhachsanData.pending]: (state) => {
            state.loading = true;
        },
        [lienhekhachsanData.fulfilled]: (state, action) => {
            state.loading = false;
            state.lienhe = action.payload;
        },
        [lienhekhachsanData.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        // Update status
        [updateStatus.pending]: (state) => {
            state.loading = true;
        },
        [updateStatus.fulfilled]: (state, action) => {
            state.loading = false;
            // Cập nhật state sau khi update thành công
            if (state.lienhe.data) {
                const index = state.lienhe.data.findIndex(item => item.id === action.payload.data.id);
                if (index !== -1) {
                    state.lienhe.data[index].status = action.payload.data.status;
                }
            }
        },
        [updateStatus.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },

        // Delete
        [deleteLienhe.pending]: (state) => {
            state.loading = true;
        },
        [deleteLienhe.fulfilled]: (state, action) => {
            state.loading = false;
            // Xóa item khỏi state sau khi xóa thành công
            if (state.lienhe.data) {
                state.lienhe.data = state.lienhe.data.filter(item => item.id !== action.payload);
            }
        },
        [deleteLienhe.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        }
    }
});

export default Lienhekhachsan.reducer;