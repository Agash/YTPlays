import { configureStore } from "@reduxjs/toolkit";
import configReducer from "../slices/configSlice";
import queueSlice from "../slices/queueSlice";
import handlerSlice from "../slices/handlerSlice";

const store = configureStore({
  reducer: {
    config: configReducer,
    queue: queueSlice,
    handler: handlerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
