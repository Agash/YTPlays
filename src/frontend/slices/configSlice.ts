import { Mode } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConfigState = {
  videoId: string;
  mode: Mode;
  democracyCountdown: number;
  monarchyCooldown: number;
  normalInterval: number;
};

const initialState: ConfigState = {
  videoId: "",
  mode: "democracy",
  democracyCountdown: 5000,
  monarchyCooldown: 15000,
  normalInterval: 500,
};

const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    loadConfig: (state, action: PayloadAction<ConfigState>) => {
      state = action.payload;
    },
    setMode: (state, action: PayloadAction<Mode | null>) => {
      state.mode = action.payload ?? "democracy";
    },
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
    setDemocracyCountdown: (state, action: PayloadAction<number | null>) => {
      state.democracyCountdown = action.payload ?? 0;
    },
    setMonarchyCooldown: (state, action: PayloadAction<number | null>) => {
      state.monarchyCooldown = action.payload ?? 0;
    },
    setNormalInterval: (state, action: PayloadAction<number | null>) => {
      state.normalInterval = action.payload ?? 0;
    },
  },
});

export { ConfigState };
export const {
  loadConfig,
  setMode,
  setVideoId,
  setDemocracyCountdown,
  setMonarchyCooldown,
  setNormalInterval,
} = configSlice.actions;
export default configSlice.reducer;
