import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCatchError } from "@stellar/frontend-helpers";
import { accountSelector } from "ducks/account";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getUntrustedAssetData } from "demo-wallet-shared/build/helpers/getUntrustedAssetData";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { ActionStatus, } from "types/types.d";
const removeExistingAssets = ({ assetsString, untrustedAssets, }) => {
    const assetsArray = assetsString.split(",");
    if (!untrustedAssets.length) {
        return assetsArray;
    }
    const untrustedAssetsList = untrustedAssets.map((ua) => ua.assetString);
    return assetsArray.filter((asset) => !untrustedAssetsList.includes(asset));
};
export const addUntrustedAssetAction = createAsyncThunk("untrustedAssets/addUntrustedAssetAction", async (assetsString, { rejectWithValue, getState }) => {
    const { data: accountData } = accountSelector(getState());
    const { data } = untrustedAssetsSelector(getState());
    try {
        const assetsListToAdd = removeExistingAssets({
            assetsString,
            untrustedAssets: data,
        });
        if (!assetsListToAdd.length) {
            return [];
        }
        log.instruction({ title: "Adding untrusted asset" });
        let response;
        try {
            response = await getUntrustedAssetData({
                assetsToAdd: assetsListToAdd,
                accountAssets: accountData === null || accountData === void 0 ? void 0 : accountData.balances,
                networkUrl: getNetworkConfig().url,
            });
        }
        catch (e) {
            const error = getCatchError(e);
            throw new Error(error.message);
        }
        if (!response.length) {
            log.instruction({ title: "No new assets to add" });
            return [];
        }
        return response;
    }
    catch (e) {
        const error = getCatchError(e);
        log.error({ title: error.toString() });
        return rejectWithValue({
            errorString: getErrorMessage(error),
        });
    }
});
export const removeUntrustedAssetAction = createAsyncThunk("untrustedAssets/removeUntrustedAssetAction", (removeAssetString, { getState }) => {
    const { data } = untrustedAssetsSelector(getState());
    return data.filter((ua) => ua.assetString !== removeAssetString);
});
const initialState = {
    data: [],
    errorString: undefined,
    status: undefined,
};
const untrustedAssetsSlice = createSlice({
    name: "untrustedAssets",
    initialState,
    reducers: {
        resetUntrustedAssetStatusAction: (state) => {
            state.status = undefined;
        },
        resetUntrustedAssetsAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(addUntrustedAssetAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(addUntrustedAssetAction.fulfilled, (state, action) => {
            state.data = [...state.data, ...action.payload];
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(addUntrustedAssetAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(removeUntrustedAssetAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(removeUntrustedAssetAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
    },
});
export const untrustedAssetsSelector = (state) => state.untrustedAssets;
export const { reducer } = untrustedAssetsSlice;
export const { resetUntrustedAssetStatusAction, resetUntrustedAssetsAction } = untrustedAssetsSlice.actions;
//# sourceMappingURL=untrustedAssets.js.map