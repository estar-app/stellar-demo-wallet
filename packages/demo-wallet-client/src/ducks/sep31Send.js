import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletBackendEndpoint, clientDomain } from "config/store";
import { accountSelector } from "ducks/account";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getNetworkConfig } from "demo-wallet-shared/build/helpers/getNetworkConfig";
import { log } from "demo-wallet-shared/build/helpers/log";
import { sep10AuthStart, sep10AuthSign, sep10AuthSend, } from "demo-wallet-shared/build/methods/sep10Auth";
import { checkInfo, getSep12Fields, putSep12Fields, postTransaction, pollTransactionUntilReady, sendPayment, pollTransactionUntilComplete, } from "demo-wallet-shared/build/methods/sep31Send";
import { checkTomlForFields } from "demo-wallet-shared/build/methods/checkTomlForFields";
import { ActionStatus, TomlFields, } from "types/types.d";
export const initiateSendAction = createAsyncThunk("sep31Send/initiateSendAction", async (asset, { rejectWithValue, getState }) => {
    try {
        const { data } = accountSelector(getState());
        const networkConfig = getNetworkConfig();
        const publicKey = data === null || data === void 0 ? void 0 : data.id;
        const { assetCode, assetIssuer, homeDomain } = asset;
        if (!publicKey) {
            throw new Error("Something is wrong with Account, no public key.");
        }
        if (!homeDomain) {
            throw new Error("Something went wrong, home domain is not defined.");
        }
        log.instruction({ title: "Initiating a SEP-31 direct payment" });
        const tomlResponse = await checkTomlForFields({
            sepName: "SEP-31 send",
            assetIssuer,
            requiredKeys: [
                TomlFields.WEB_AUTH_ENDPOINT,
                TomlFields.SIGNING_KEY,
                TomlFields.DIRECT_PAYMENT_SERVER,
                TomlFields.KYC_SERVER,
            ],
            networkUrl: networkConfig.url,
            homeDomain,
        });
        const authEndpoint = tomlResponse.WEB_AUTH_ENDPOINT;
        const serverSigningKey = tomlResponse.SIGNING_KEY;
        const sendServer = tomlResponse.DIRECT_PAYMENT_SERVER;
        const kycServer = tomlResponse.KYC_SERVER;
        const infoResponse = await checkInfo({ assetCode, sendServer });
        return {
            publicKey,
            homeDomain,
            assetCode,
            assetIssuer,
            fields: {
                transaction: infoResponse.fields.transaction,
                sender: {},
                receiver: {},
            },
            senderType: infoResponse.senderType,
            receiverType: infoResponse.receiverType,
            multipleSenderTypes: infoResponse.multipleSenderTypes,
            multipleReceiverTypes: infoResponse.multipleReceiverTypes,
            authEndpoint,
            sendServer,
            kycServer,
            serverSigningKey,
            isTypeSelected: Boolean(!infoResponse.multipleSenderTypes &&
                !infoResponse.multipleReceiverTypes),
        };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({
            title: errorMessage,
        });
        return rejectWithValue({
            errorString: errorMessage,
        });
    }
});
export const setCustomerTypesAction = createAsyncThunk("sep31Send/setCustomerTypesAction", ({ senderType = "", receiverType = "" }) => {
    if (senderType) {
        log.instruction({
            title: `Using \`${senderType}\` type for sending customers`,
        });
    }
    if (receiverType) {
        log.instruction({
            title: `Using \`${receiverType}\` type for receiving customers`,
        });
    }
    return {
        senderType,
        receiverType,
        isTypeSelected: true,
    };
});
export const fetchSendFieldsAction = createAsyncThunk("sep31Send/fetchSendFieldsAction", async (_, { rejectWithValue, getState }) => {
    try {
        const { secretKey } = accountSelector(getState());
        const { data } = sep31SendSelector(getState());
        const networkConfig = getNetworkConfig();
        const { authEndpoint, serverSigningKey, publicKey, kycServer, senderType, receiverType, fields, } = data;
        const serviceDomain = new URL(kycServer).host;
        const challengeTransaction = await sep10AuthStart({
            authEndpoint,
            serverSigningKey,
            publicKey,
            homeDomain: serviceDomain,
            clientDomain,
        });
        const signedChallengeTransaction = await sep10AuthSign({
            secretKey,
            networkPassphrase: networkConfig.network,
            challengeTransaction,
            walletBackendEndpoint,
        });
        const token = await sep10AuthSend({
            authEndpoint,
            signedChallengeTransaction,
        });
        const sep12Fields = await getSep12Fields({
            kycServer,
            publicKey,
            token,
            senderType,
            receiverType,
        });
        log.instruction({
            title: "To collect the required information we show a form with all the requested fields from `/info`",
        });
        return {
            token,
            fields: {
                transaction: fields.transaction,
                sender: sep12Fields.senderSep12Fields || {},
                receiver: sep12Fields.receiverSep12Fields || {},
            },
            senderMemo: sep12Fields.info.senderSep12Memo,
            receiverMemo: sep12Fields.info.receiverSep12Memo,
        };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({
            title: errorMessage,
        });
        return rejectWithValue({
            errorString: errorMessage,
        });
    }
});
export const submitSep31SendTransactionAction = createAsyncThunk("sep31Send/submitSep31SendTransactionAction", async ({ amount, transaction, sender, receiver }, { rejectWithValue, getState }) => {
    var _a;
    try {
        const { secretKey } = accountSelector(getState());
        const { data } = sep31SendSelector(getState());
        const networkConfig = getNetworkConfig();
        const { token, assetCode, assetIssuer, kycServer, sendServer, senderMemo, receiverMemo, fields, } = data;
        const putSep12FieldsResponse = await putSep12Fields({
            fields,
            formData: { sender, receiver },
            secretKey,
            senderMemo,
            receiverMemo,
            kycServer,
            token,
        });
        const postResponse = await postTransaction({
            amount: amount.amount,
            assetCode,
            senderId: putSep12FieldsResponse.senderSep12Id,
            receiverId: putSep12FieldsResponse.receiverSep12Id,
            transactionFormData: transaction,
            sendServer,
            token,
        });
        const getSep31Tx = await pollTransactionUntilReady({
            sendServer,
            transactionId: postResponse.transactionId,
            token,
        });
        const amountIn = (_a = getSep31Tx === null || getSep31Tx === void 0 ? void 0 : getSep31Tx.transaction) === null || _a === void 0 ? void 0 : _a.amount_in;
        if (amountIn === undefined) {
            throw new Error(`"amount_in" is missing from the GET /transaction response`);
        }
        await sendPayment({
            amount: amountIn,
            assetCode,
            assetIssuer,
            receiverAddress: postResponse.receiverAddress,
            secretKey,
            sendMemo: postResponse.sendMemo,
            sendMemoType: postResponse.sendMemoType,
            networkUrl: networkConfig.url,
            networkPassphrase: networkConfig.network,
        });
        await pollTransactionUntilComplete({
            sendServer,
            transactionId: postResponse.transactionId,
            token,
        });
        log.instruction({
            title: "SEP-31 send payment completed",
        });
        return true;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error({
            title: errorMessage,
        });
        return rejectWithValue({
            errorString: errorMessage,
        });
    }
});
const initialState = {
    data: {
        publicKey: "",
        homeDomain: "",
        assetCode: "",
        assetIssuer: "",
        token: "",
        fields: {
            transaction: {},
            sender: {},
            receiver: {},
        },
        isTypeSelected: false,
        senderType: undefined,
        receiverType: undefined,
        senderMemo: "",
        receiverMemo: "",
        multipleSenderTypes: undefined,
        multipleReceiverTypes: undefined,
        authEndpoint: "",
        sendServer: "",
        kycServer: "",
        serverSigningKey: "",
    },
    errorString: undefined,
    status: undefined,
};
const sep31SendSlice = createSlice({
    name: "sep31Send",
    initialState,
    reducers: {
        resetSep31SendAction: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(initiateSendAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(initiateSendAction.fulfilled, (state, action) => {
            state.data = { ...state.data, ...action.payload };
            state.status =
                action.payload.multipleSenderTypes ||
                    action.payload.multipleReceiverTypes
                    ? ActionStatus.NEEDS_INPUT
                    : ActionStatus.CAN_PROCEED;
        });
        builder.addCase(initiateSendAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(setCustomerTypesAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(setCustomerTypesAction.fulfilled, (state, action) => {
            state.data = { ...state.data, ...action.payload };
            state.status = ActionStatus.CAN_PROCEED;
        });
        builder.addCase(fetchSendFieldsAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(fetchSendFieldsAction.fulfilled, (state, action) => {
            state.data = { ...state.data, ...action.payload };
            state.status = ActionStatus.NEEDS_INPUT;
        });
        builder.addCase(fetchSendFieldsAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(submitSep31SendTransactionAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(submitSep31SendTransactionAction.fulfilled, (state) => {
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(submitSep31SendTransactionAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const sep31SendSelector = (state) => state.sep31Send;
export const { reducer } = sep31SendSlice;
export const { resetSep31SendAction } = sep31SendSlice.actions;
//# sourceMappingURL=sep31Send.js.map