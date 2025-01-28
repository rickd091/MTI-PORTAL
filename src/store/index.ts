import { configureStore } from "@reduxjs/toolkit";
import institutionReducer from "./slices/institutionSlice";
import programReducer from "./slices/programSlice";
import trainerReducer from "./slices/trainerSlice";
import inspectionReducer from "./slices/inspectionSlice";

export const store = configureStore({
  reducer: {
    institutions: institutionReducer,
    programs: programReducer,
    trainers: trainerReducer,
    inspections: inspectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
