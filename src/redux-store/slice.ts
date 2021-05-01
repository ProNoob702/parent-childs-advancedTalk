import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

export interface IChildHeights {
  [key: string]: number
}

interface IState {
  childsHeight: IChildHeights
}

const inialState: IState = {
  childsHeight: {}
}

const appSlice = createSlice({
  name: 'appSlice',
  initialState: inialState,
  reducers: {}
})

export const appReducer = appSlice.reducer
export const appActions = appSlice.actions
