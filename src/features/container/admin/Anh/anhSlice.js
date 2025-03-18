import anhApi from "../../../../api/media/anhApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// Tạo action get all ảnh
export const anhData = createAsyncThunk("anhs/anhData", async () => {
    const response = await anhApi.getAll();
    return response;
});

const Anh = createSlice({
    name: "anhs",
    initialState: {
        anh: {
            data: [], // Khởi tạo là mảng rỗng
            loading: false,
            error: null,
        },
    },
    reducers: {
        // Thêm ảnh mới
        addanh: (state, action) => {
            anhApi.postanh(action.payload);
        },
        // Xóa ảnh - cần thêm type
        removeanh: (state, action) => {
            const { type, id } = action.payload;
            anhApi.deleteanh(type, id);
        },
        // Cập nhật ảnh
        updateanh: (state, action) => {
            anhApi.editanh(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(anhData.pending, (state) => {
                state.anh.loading = true;
            })
            .addCase(anhData.fulfilled, (state, action) => {
                state.anh.loading = false;
                // Đảm bảo data là mảng
                state.anh.data = Array.isArray(action.payload)
                    ? action.payload
                    : Array.isArray(action.payload?.data)
                    ? action.payload.data
                    : [];
            })
            .addCase(anhData.rejected, (state, action) => {
                state.anh.loading = false;
                state.anh.error = action.error.message;
            });
    },
});

const { reducer, actions } = Anh;
export const { addanh, removeanh, updateanh } = actions;

export default reducer;
