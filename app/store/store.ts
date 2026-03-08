import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "./financeSlice";
import gamificationReducer from "./gamificationSlice";

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    gamification: gamificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
