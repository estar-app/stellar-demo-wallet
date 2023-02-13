import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StellarSdk from "stellar-sdk";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { ActionStatus, AssetType, } from "types/types.d";
export const fetchClaimableBalancesAction = createAsyncThunk("claimableBalances/fetchClaimableBalancesAction", async ({ publicKey }, { rejectWithValue }) => {
    const networkConfig = getNetworkConfig();
    const server = new StellarSdk.Server(networkConfig.url);
    try {
        const claimableBalanceResponse = await server
            .claimableBalances()
            .claimant(publicKey)
            .call();
        const cleanedRecords = [];
        claimableBalanceResponse.records.forEach((record) => {
            let assetCode;
            let assetIssuer;
            if (record.asset === AssetType.NATIVE) {
                assetCode = "XLM";
            }
            else {
                [assetCode, assetIssuer] = record.asset.split(":");
            }
            const cleanedRecord = {
                id: record.id,
                assetString: record.id,
                assetCode,
                assetIssuer,
                total: record.amount,
                sponsor: record.sponsor,
                lastModifiedLedger: record.last_modified_ledger,
                isClaimableBalance: true,
                source: record,
            };
            log.response({
                title: `Claimable balance of ${record.amount} ${assetCode} available`,
                body: cleanedRecord,
            });
            cleanedRecords.push(cleanedRecord);
        });
        return {
            records: cleanedRecords,
        };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({ title: errorMessage });
        return rejectWithValue({
            errorString: getErrorMessage(error),
        });
    }
});
const initialState = {
    data: {
        records: null,
    },
    errorString: undefined,
    status: undefined,
};
const claimableBalancesSlice = createSlice({
    name: "claimableBalances",
    initialState,
    reducers: {
        resetClaimableBalancesAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchClaimableBalancesAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(fetchClaimableBalancesAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(fetchClaimableBalancesAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const accountSelector = (state) => state.account;
export const { reducer } = claimableBalancesSlice;
export const { resetClaimableBalancesAction } = claimableBalancesSlice.actions;
//# sourceMappingURL=claimableBalances.js.map