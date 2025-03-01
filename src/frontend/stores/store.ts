import { configureStore } from "@reduxjs/toolkit";
import configReducer from "../slices/configSlice";
import queueReducer from "../slices/queueSlice";
import handlerReducer from "../slices/handlerSlice";

const store = configureStore({
  reducer: {
    config: configReducer,
    queue: queueReducer,
    handler: handlerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
