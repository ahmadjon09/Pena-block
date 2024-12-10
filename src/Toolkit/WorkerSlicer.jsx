import { createSlice } from '@reduxjs/toolkit'

const Workerslicer = createSlice({
  name: 'Workers',
  initialState: {
    data: [],
    isAuth: false,
    isPending: false,
    isError: ''
  },
  reducers: {
    getWorkersPending (state) {
      state.isPending = true
      state.isError = ''
    },
    getWorkersSuccess (state, { payload }) {
      state.isAuth = true
      state.data = payload
      state.isPending = false
    },
    getWorkersError (state, { payload }) {
      state.isPending = false
      state.isError = payload
    }
  }
})

export const { getWorkersError, getWorkersPending, getWorkersSuccess } =
  Workerslicer.actions
export default Workerslicer.reducer
