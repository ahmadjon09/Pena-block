import { createSlice } from '@reduxjs/toolkit'

const GSlicer = createSlice({
  name: 'Gs',
  initialState: {
    data: [],
    isAuth: false,
    isPending: false,
    isError: ''
  },
  reducers: {
    getGsPending (state) {
      state.isPending = true
      state.isError = ''
    },
    getGsSuccess (state, { payload }) {
      state.isAuth = true
      state.data = payload
      state.isPending = false
    },
    getGsError (state, { payload }) {
      state.isPending = false
      state.isError = payload
    }
  }
})

export const { getGsError, getGsPending, getGsSuccess } = GSlicer.actions
export default GSlicer.reducer
