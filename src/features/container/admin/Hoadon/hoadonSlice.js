import hoadonApi from "../../../../api/payment/hoadonApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const hoadonData = createAsyncThunk('hoadons/hoadonData', async () => {
    const hoadon = await hoadonApi.getAll();
    return hoadon;
});

export const updatehoadonStatus = createAsyncThunk(
    'hoadons/updateStatus',
    async ({id, status}) => {
        try {
            const response = await hoadonApi.edithoadon(id, { status });
            return { id, status };
        } catch (error) {
            throw error;
        }
    }
);

const Hoadon = createSlice({
    name: "hoadons",
    initialState: {
        hoadon: [],
        loading: true,
        error: ''
    },
    reducers: {
        addhoadon: (state, action) => {
            hoadonApi.posthoadon(action.payload);
        },
        removehoadon: (state, action) => {
            hoadonApi.deletehoadon(action.payload);
        },
    },
    extraReducers: {
        [updatehoadonStatus.pending]: (state) => {
            state.loading = true;
        },
        [updatehoadonStatus.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [updatehoadonStatus.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [hoadonData.pending]: (state) => {
            state.loading = true;
        },
        [hoadonData.rejected]: (state, action) => {
            state.loading = true;
            state.error = action.error;
        },
        [hoadonData.fulfilled]: (state, action) => {
            state.loading = false;
            state.hoadon = action.payload;
        }
    }
});
const { reducer, actions } = Hoadon;
export const { addhoadon, removehoadon } = actions;

export default reducer;
