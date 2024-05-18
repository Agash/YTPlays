import { Mode, ButtonPreset } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConfigState = {
  videoId: string;
  mode: Mode;
  buttonPreset: ButtonPreset;
  democracyCountdown: number;
  monarchyCooldown: number;
  monarchyThreshold: number;
  inactivityTimerInMs: number;
  normalInterval: number;
  streamDelay: number;
};

const initialState: ConfigState = {
  videoId: "",
  mode: "democracy",
  buttonPreset: "normal",
  democracyCountdown: 15000,
  monarchyCooldown: 25000,
  monarchyThreshold: 2,
  inactivityTimerInMs: 1500,
  normalInterval: 1500,
  streamDelay: 1500,
};

const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigState>) => {
      state.videoId = action.payload.videoId;
      state.mode = action.payload.mode;
      state.buttonPreset = action.payload.buttonPreset;
      state.democracyCountdown = action.payload.democracyCountdown;
      state.monarchyCooldown = action.payload.monarchyCooldown;
      state.monarchyThreshold = action.payload.monarchyThreshold;
      state.inactivityTimerInMs = action.payload.inactivityTimerInMs;
      state.normalInterval = action.payload.normalInterval;
      state.streamDelay = action.payload.streamDelay;
    },
  },
});

export { ConfigState };
export const { setConfig } = configSlice.actions;
export default configSlice.reducer;
