import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider } from "@stellar/wallet-sdk";
import { getCatchError } from "@stellar/frontend-helpers";
import { Keypair } from "stellar-sdk";
import { getAssetData } from "demo-wallet-shared/build/helpers/getAssetData";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getErrorString } from "demo-wallet-shared/build/helpers/getErrorString";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { ActionStatus, } from "types/types.d";
export const fetchAccountAction = createAsyncThunk("account/fetchAccountAction", async ({ publicKey, secretKey }, { rejectWithValue }) => {
    const networkConfig = getNetworkConfig();
    const dataProvider = new DataProvider({
        serverUrl: networkConfig.url,
        accountOrKey: publicKey,
        networkPassphrase: networkConfig.network,
    });
    let stellarAccount = null;
    let assets = [];
    let isUnfunded = false;
    log.request({
        title: `Fetching account info`,
        body: `Public key: ${publicKey}`,
    });
    try {
        stellarAccount = await dataProvider.fetchAccountDetails();
        assets = await getAssetData({
            balances: stellarAccount.balances,
            networkUrl: networkConfig.url,
        });
    }
    catch (e) {
        const error = getCatchError(e);
        if (error.isUnfunded) {
            log.instruction({ title: `Account is not funded` });
            stellarAccount = {
                id: publicKey,
            };
            isUnfunded = true;
        }
        else {
            const errorMessage = getErrorString(error);
            log.error({
                title: `Fetching account \`${publicKey}\` failed`,
                body: errorMessage,
            });
            return rejectWithValue({
                errorString: errorMessage,
            });
        }
    }
    log.response({
        title: `Account info fetched`,
        body: stellarAccount,
    });
    return { data: stellarAccount, assets, isUnfunded, secretKey };
});
export const createRandomAccount = createAsyncThunk("account/createRandomAccount", (_, { rejectWithValue }) => {
    try {
        log.instruction({ title: "Generating new keypair" });
        const keypair = Keypair.random();
        return keypair.secret();
    }
    catch (error) {
        log.error({
            title: "Generating new keypair failed",
            body: getErrorMessage(error),
        });
        return rejectWithValue({
            errorString: "Something went wrong while creating random account, please try again.",
        });
    }
});
export const fundTestnetAccount = createAsyncThunk("account/fundTestnetAccount", async (publicKey, { rejectWithValue }) => {
    log.instruction({
        title: "The friendbot is funding testnet account",
        body: `Public key: ${publicKey}`,
    });
    const networkConfig = getNetworkConfig();
    const dataProvider = new DataProvider({
        serverUrl: networkConfig.url,
        accountOrKey: publicKey,
        networkPassphrase: networkConfig.network,
    });
    try {
        await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
        const stellarAccount = await dataProvider.fetchAccountDetails();
        const assets = await getAssetData({
            balances: stellarAccount.balances,
            networkUrl: networkConfig.url,
        });
        log.response({
            title: "The friendbot funded account",
            body: stellarAccount,
        });
        return { data: stellarAccount, assets, isUnfunded: false };
    }
    catch (error) {
        log.error({
            title: "The friendbot funding of the account failed",
            body: getErrorMessage(error),
        });
        return rejectWithValue({
            errorString: "Something went wrong with funding the account, please try again.",
        });
    }
});
const initialState = {
    data: null,
    assets: [],
    errorString: undefined,
    isAuthenticated: false,
    isUnfunded: false,
    secretKey: "",
    status: undefined,
};
const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        resetAccountAction: () => initialState,
        resetAccountStatusAction: (state) => {
            state.status = undefined;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccountAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(fetchAccountAction.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.assets = action.payload.assets;
            state.isAuthenticated = Boolean(action.payload.data);
            state.isUnfunded = action.payload.isUnfunded;
            state.secretKey = action.payload.secretKey;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(fetchAccountAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(createRandomAccount.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(createRandomAccount.fulfilled, (state, action) => {
            state.secretKey = action.payload;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(createRandomAccount.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(fundTestnetAccount.pending, (state) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(fundTestnetAccount.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.assets = action.payload.assets;
            state.isUnfunded = action.payload.isUnfunded;
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(fundTestnetAccount.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const accountSelector = (state) => state.account;
export const { reducer } = accountSlice;
export const { resetAccountAction, resetAccountStatusAction } = accountSlice.actions;
//# sourceMappingURL=account.js.map