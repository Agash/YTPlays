import { QueueStatistics } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type QueueState = {
  commandStats: QueueStatistics;
  userStats: QueueStatistics;
};

const initialState: QueueState = {
  commandStats: null,
  userStats: null,
};

const queueSlice = createSlice({
  name: "queue",
  initialState: initialState,
  reducers: {
    updateCommandStats: (state, action: PayloadAction<QueueStatistics>) => {
      state.commandStats = action.payload;
    },
    updateUserStats: (state, action: PayloadAction<QueueStatistics>) => {
      state.userStats = action.payload;
    },
  },
});

export { QueueState };
export const { updateCommandStats, updateUserStats } = queueSlice.actions;
export default queueSlice.reducer;
