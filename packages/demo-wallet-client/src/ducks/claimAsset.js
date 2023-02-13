import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_FEE } from "stellar-sdk";
import { accountSelector } from "ducks/account";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { claimClaimableBalance } from "demo-wallet-shared/build/methods/claimClaimableBalance";
import { trustAsset } from "demo-wallet-shared/build/methods/trustAsset";
import { ActionStatus, } from "types/types.d";
export const claimAssetAction = createAsyncThunk("claimAsset/claimAssetAction", async (balance, { rejectWithValue, getState }) => {
    const { data, secretKey } = accountSelector(getState());
    const networkConfig = getNetworkConfig();
    const { assetCode, assetIssuer } = balance;
    const assetString = assetIssuer ? `${assetCode}:${assetIssuer}` : assetCode;
    log.instruction({
        title: `Claiming asset \`${assetString}\``,
    });
    let trustedAssetAdded;
    try {
        if (assetString !== "XLM" && !(data === null || data === void 0 ? void 0 : data.balances[assetString])) {
            log.instruction({
                title: "Not a trusted asset, need to add a trustline",
            });
            try {
                await trustAsset({
                    secretKey,
                    networkPassphrase: networkConfig.network,
                    networkUrl: networkConfig.url,
                    untrustedAsset: {
                        assetString,
                        assetCode,
                        assetIssuer,
                    },
                });
                trustedAssetAdded = `${assetString}`;
            }
            catch (error) {
                throw new Error(getErrorMessage(error));
            }
        }
        try {
            const result = await claimClaimableBalance({
                secretKey,
                balance,
                assetCode,
                networkPassphrase: networkConfig.network,
                networkUrl: networkConfig.url,
                fee: BASE_FEE,
            });
            return { result, trustedAssetAdded };
        }
        catch (error) {
            throw new Error(getErrorMessage(error));
        }
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
    data: {
        result: null,
        trustedAssetAdded: undefined,
    },
    status: undefined,
    errorString: undefined,
};
const claimAssetSlice = createSlice({
    name: "claimAsset",
    initialState,
    reducers: {
        resetClaimAssetAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(claimAssetAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(claimAssetAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(claimAssetAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const { reducer } = claimAssetSlice;
export const { resetClaimAssetAction } = claimAssetSlice.actions;
//# sourceMappingURL=claimAsset.js.map