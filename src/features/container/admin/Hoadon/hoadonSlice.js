import hoadonApi from "../../../../api/payment/hoadonApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const hoadonData = createAsyncThunk('hoadons/hoadonData', async () => {
    const hoadon = await hoadonApi.getAll();
    return hoadon;
});

export const addhoadon = createAsyncThunk(
    'hoadons/addhoadon',
    async (payload) => {
        const response = await hoadonApi.posthoadon(payload);
        return response.data;
    }
);

export const updatehoadonStatus = createAsyncThunk(
    'hoadons/updateStatus',
    async ({id, status}) => {
        const response = await hoadonApi.edithoadon(id, { status });
        return { id, status };
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
        removehoadon: (state, action) => {
            hoadonApi.deletehoadon(action.payload);
        },
    },
    extraReducers: {
        [addhoadon.pending]: (state) => {
            state.loading = true;
        },
        [addhoadon.fulfilled]: (state, action) => {
            state.loading = false;
            if (state.hoadon.data) {
                state.hoadon.data.unshift(action.payload);
            }
        },
        [addhoadon.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [hoadonData.pending]: (state) => {
            state.loading = true;
        },
        [hoadonData.fulfilled]: (state, action) => {
            state.loading = false;
            state.hoadon = action.payload;
        },
        [hoadonData.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [updatehoadonStatus.pending]: (state) => {
            state.loading = true;
        },
        [updatehoadonStatus.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [updatehoadonStatus.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        }
    }
});
const { reducer, actions } = Hoadon;
export const { removehoadon } = actions;

export default reducer;
