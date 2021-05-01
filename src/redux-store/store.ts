import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { appReducer } from "./slice";

export const rootReducer = combineReducers({
  appState: appReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true, // TODO: not in production
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //typed useSelector
export default store;
