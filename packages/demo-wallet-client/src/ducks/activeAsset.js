import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    action: undefined,
    status: undefined,
};
const activeAssetSlice = createSlice({
    name: "activeAsset",
    initialState,
    reducers: {
        setActiveAssetAction: (state, action) => {
            state.action = action.payload;
        },
        setActiveAssetStatusAction: (state, action) => {
            if (state.action) {
                state.status = action.payload;
            }
        },
        resetActiveAssetAction: () => initialState,
    },
});
export const activeAssetSelector = (state) => state.activeAsset;
export const { reducer } = activeAssetSlice;
export const { setActiveAssetAction, setActiveAssetStatusAction, resetActiveAssetAction, } = activeAssetSlice.actions;
//# sourceMappingURL=activeAsset.js.map