import { QueueStatistics } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type QueueState = {
  stats: QueueStatistics;
};

const initialState: QueueState = {
  stats: null,
};

const queueSlice = createSlice({
  name: "queue",
  initialState: initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<QueueStatistics>) => {
      state.stats = action.payload;
    },
  },
});

export { QueueState };
export const { updateStats } = queueSlice.actions;
export default queueSlice.reducer;
