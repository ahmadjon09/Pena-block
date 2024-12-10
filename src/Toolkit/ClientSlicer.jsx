import { createSlice } from "@reduxjs/toolkit";

const ClientSlicer = createSlice({
    name: "Clients",
    initialState: {
        data: [],
        isAuth: false,
        isPending: false,
        isError: "",
    },
    reducers: {
        getClientsPending(state) {
            state.isPending = true;
            state.isError = "";
        },
        getClientsSuccess(state, { payload }) {
            state.isAuth = true;
            state.data = payload;
            state.isPending = false;
        },
        getClientsError(state, { payload }) {
            state.isPending = false;
            state.isError = payload;
        },
    },
});

export const { getClientsError, getClientsPending, getClientsSuccess } = ClientSlicer.actions;
export default ClientSlicer.reducer;
