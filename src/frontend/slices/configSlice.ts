import { Mode } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConfigState = {
  videoId: string;
  mode: Mode;
  democracyCountdown: number;
  monarchyCooldown: number;
  monarchyThreshold: number;
  normalInterval: number;
};

const initialState: ConfigState = {
  videoId: "",
  mode: "democracy",
  democracyCountdown: 15000,
  monarchyCooldown: 25000,
  monarchyThreshold: 2,
  normalInterval: 1500,
};

const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigState>) => {
      console.log("[YTPlays] STORE: setting config", action);
      state.videoId = action.payload.videoId;
      state.mode = action.payload.mode;
      state.democracyCountdown = action.payload.democracyCountdown;
      state.monarchyCooldown = action.payload.monarchyCooldown;
      state.monarchyThreshold = action.payload.monarchyThreshold;
      state.normalInterval = action.payload.normalInterval;
    },
  },
});

export { ConfigState };
export const { setConfig } = configSlice.actions;
export default configSlice.reducer;
