import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getAssetOverridesData } from "demo-wallet-shared/build/helpers/getAssetOverridesData";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { searchKeyPairStringToArray } from "demo-wallet-shared/build/helpers/searchKeyPairStringToArray";
import { ActionStatus, } from "types/types.d";
export const addAssetOverridesAction = createAsyncThunk("assetOverrides/addAssetOverridesAction", async (assetOverridesString, { rejectWithValue }) => {
    try {
        const assetOverrides = searchKeyPairStringToArray(assetOverridesString);
        const response = await getAssetOverridesData({
            assetOverrides,
            networkUrl: getNetworkConfig().url,
        });
        return response;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({ title: errorMessage });
        return rejectWithValue({
            errorString: errorMessage,
        });
    }
});
const initialState = {
    data: [],
    errorString: undefined,
    status: undefined,
};
const assetOverridesSlice = createSlice({
    name: "assetOverrides",
    initialState,
    reducers: {
        resetAssetOverridesStatusAction: (state) => {
            state.status = undefined;
        },
        resetAssetOverridesAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(addAssetOverridesAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(addAssetOverridesAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(addAssetOverridesAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const assetOverridesSelector = (state) => state.assetOverrides;
export const { reducer } = assetOverridesSlice;
export const { resetAssetOverridesStatusAction, resetAssetOverridesAction } = assetOverridesSlice.actions;
//# sourceMappingURL=assetOverrides.js.map