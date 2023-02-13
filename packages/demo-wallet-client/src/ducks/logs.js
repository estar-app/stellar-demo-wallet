import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ActionStatus } from "types/types.d";
const initialState = {
    errorString: "",
    items: [],
    status: undefined,
};
export const addLogAction = createAsyncThunk("logs/addLog", (logItem) => logItem);
const logsSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {
        clearLogsAction: () => initialState,
        logAction: (state, action) => {
            state.items = [...state.items, action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addLogAction.pending, (state = initialState) => {
            state.status = ActionStatus.PENDING;
        });
        builder.addCase(addLogAction.fulfilled, (state, action) => {
            state.items = [...state.items, action.payload];
            state.status = ActionStatus.SUCCESS;
        });
    },
});
export const logsSelector = (state) => state.logs;
export const { reducer } = logsSlice;
export const { logAction, clearLogsAction } = logsSlice.actions;
//# sourceMappingURL=logs.js.map