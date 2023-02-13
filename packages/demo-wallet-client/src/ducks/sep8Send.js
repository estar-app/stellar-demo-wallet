import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { settingsSelector } from "ducks/settings";
import { getErrorMessage } from "demo-wallet-shared/build/helpers/getErrorMessage";
import { getErrorString } from "demo-wallet-shared/build/helpers/getErrorString";
import { getSep8NextStepOnSuccess } from "demo-wallet-shared/build/helpers/getSep8NextStepOnSuccess";
import { log } from "demo-wallet-shared/build/helpers/log";
import { getToml } from "demo-wallet-shared/build/methods/getToml";
import { revisePaymentTransaction } from "demo-wallet-shared/build/methods/sep8Send/revisePaymentTransaction";
import { sendActionRequiredFields } from "demo-wallet-shared/build/methods/sep8Send/sendActionRequiredFields";
import { submitRevisedTransaction } from "demo-wallet-shared/build/methods/sep8Send/submitRevisedTransaction";
import { ActionStatus, Sep8ApprovalStatus, Sep8Step, } from "types/types.d";
export const initiateSep8SendAction = createAsyncThunk("sep8Send/initiateSep8SendAction", async (asset, { rejectWithValue }) => {
    const { assetCode, assetIssuer, homeDomain } = asset;
    try {
        if (!homeDomain) {
            throw new Error("Something went wrong, home domain is not defined.");
        }
        const tomlResponse = await getToml(homeDomain);
        const currency = tomlResponse.CURRENCIES.find((c) => c.code === assetCode && c.issuer === assetIssuer);
        if (!currency) {
            throw new Error("Couldn't find the desired asset in the anchor toml file.");
        }
        const { approval_criteria: approvalCriteria, approval_server: approvalServer, regulated: isRegulated, } = currency;
        if (!approvalCriteria) {
            throw new Error("The anchor toml file does not contain an approval criteria.");
        }
        if (!approvalServer) {
            throw new Error("The anchor toml file does not contain an approval server.");
        }
        if (!isRegulated) {
            throw new Error('The anchor toml file does not specify this asset as "regulated".');
        }
        return {
            approvalCriteria,
            approvalServer,
            assetCode,
            assetIssuer,
            homeDomain,
            isRegulated,
        };
    }
    catch (error) {
        const errorString = getErrorMessage(error);
        log.error({
            title: errorString,
        });
        return rejectWithValue({ errorString });
    }
});
export const sep8ReviseTransactionAction = createAsyncThunk("sep8Send/sep8ReviseTransactionAction", async (params, { rejectWithValue }) => {
    try {
        const result = await revisePaymentTransaction({
            params,
        });
        return result;
    }
    catch (error) {
        const errorString = getErrorString(error);
        log.error({ title: errorString });
        return rejectWithValue({ errorString });
    }
});
export const sep8SubmitRevisedTransactionAction = createAsyncThunk("sep8Send/sep8SubmitRevisedTransactionAction", async (_, { rejectWithValue, getState }) => {
    const { secretKey } = settingsSelector(getState());
    const { data } = sep8SendSelector(getState());
    const { amount, destination, revisedTxXdr } = data.revisedTransaction;
    try {
        const result = await submitRevisedTransaction({
            amount,
            destination,
            assetCode: data.assetCode,
            revisedTxXdr,
            secretKey,
        });
        return result;
    }
    catch (error) {
        const errorString = getErrorString(error);
        log.error({ title: errorString });
        return rejectWithValue({ errorString });
    }
});
export const sep8SendActionRequiredFieldsAction = createAsyncThunk("sep8Send/sep8SendActionRequiredFieldsAction", async (params, { rejectWithValue }) => {
    const { actionFields, actionMethod, actionUrl } = params;
    try {
        const result = await sendActionRequiredFields({
            actionFields,
            actionMethod,
            actionUrl,
        });
        return result;
    }
    catch (error) {
        const errorString = getErrorString(error);
        log.error({ title: errorString });
        return rejectWithValue({ errorString });
    }
});
const initialState = {
    data: {
        sep8Step: Sep8Step.DISABLED,
        approvalCriteria: "",
        approvalServer: "",
        assetCode: "",
        assetIssuer: "",
        homeDomain: "",
        isRegulated: false,
        revisedTransaction: {
            amount: "",
            destination: "",
            submittedTxXdr: "",
            revisedTxXdr: "",
        },
        actionRequiredInfo: {
            actionFields: [],
            actionMethod: "",
            actionUrl: "",
            message: "",
        },
        actionRequiredResult: {
            result: "",
            nextUrl: undefined,
            message: undefined,
        },
    },
    errorString: undefined,
    status: undefined,
};
const sep8SendSlice = createSlice({
    name: "sep8Send",
    initialState,
    reducers: {
        resetSep8SendAction: () => initialState,
        sep8ClearErrorAction: (state) => ({ ...state, errorString: undefined }),
    },
    extraReducers: (builder) => {
        builder.addCase(initiateSep8SendAction.pending, (state = initialState) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(initiateSep8SendAction.fulfilled, (state, action) => {
            state.data = {
                ...state.data,
                ...action.payload,
                sep8Step: getSep8NextStepOnSuccess({
                    currentStep: state.data.sep8Step,
                }),
            };
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(initiateSep8SendAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(sep8ReviseTransactionAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(sep8ReviseTransactionAction.fulfilled, (state, action) => {
            switch (action.payload.status) {
                case Sep8ApprovalStatus.ACTION_REQUIRED: {
                    const { actionRequiredInfo, revisedTransaction } = action.payload;
                    state.data = {
                        ...state.data,
                        actionRequiredInfo: actionRequiredInfo !== null && actionRequiredInfo !== void 0 ? actionRequiredInfo : state.data.actionRequiredInfo,
                        revisedTransaction: revisedTransaction !== null && revisedTransaction !== void 0 ? revisedTransaction : state.data.revisedTransaction,
                    };
                    break;
                }
                case Sep8ApprovalStatus.PENDING:
                    break;
                case Sep8ApprovalStatus.REVISED:
                case Sep8ApprovalStatus.SUCCESS:
                    if (action.payload.revisedTransaction) {
                        state.data = {
                            ...state.data,
                            revisedTransaction: action.payload.revisedTransaction,
                        };
                    }
                    break;
                default:
                    state.errorString = `The SEP-8 flow for "${action.payload.status}" status is not supported yet.`;
                    break;
            }
            state.status = ActionStatus.SUCCESS;
            state.data.sep8Step = getSep8NextStepOnSuccess({
                approvalStatus: action.payload.status,
                currentStep: state.data.sep8Step,
                didUndergoKyc: Boolean(state.data.actionRequiredResult.result),
            });
        });
        builder.addCase(sep8ReviseTransactionAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(sep8SubmitRevisedTransactionAction.pending, (state) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(sep8SubmitRevisedTransactionAction.fulfilled, (state) => {
            state.status = ActionStatus.SUCCESS;
            state.data.sep8Step = getSep8NextStepOnSuccess({
                currentStep: state.data.sep8Step,
            });
        });
        builder.addCase(sep8SubmitRevisedTransactionAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
        builder.addCase(sep8SendActionRequiredFieldsAction.pending, (state = initialState) => {
            state.errorString = undefined;
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(sep8SendActionRequiredFieldsAction.fulfilled, (state, action) => {
            state.data = {
                ...state.data,
                actionRequiredResult: action.payload,
                sep8Step: getSep8NextStepOnSuccess({
                    currentStep: state.data.sep8Step,
                }),
            };
            state.status = ActionStatus.SUCCESS;
        });
        builder.addCase(sep8SendActionRequiredFieldsAction.rejected, (state, action) => {
            var _a;
            state.errorString = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.errorString;
            state.status = ActionStatus.ERROR;
        });
    },
});
export const sep8SendSelector = (state) => state.sep8Send;
export const { reducer } = sep8SendSlice;
export const { resetSep8SendAction, sep8ClearErrorAction } = sep8SendSlice.actions;
//# sourceMappingURL=sep8Send.js.map