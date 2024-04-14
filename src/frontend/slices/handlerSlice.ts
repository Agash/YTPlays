import { ChatMessage } from "../../shared/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type HandlerState = {
  lastExecutedMessage: ChatMessage;
  currentMonarch: string;
  eligibleUsers: string[];
};

const initialState: HandlerState = {
  lastExecutedMessage: null,
  currentMonarch: null,
  eligibleUsers: [],
};

const handlerSlice = createSlice({
  name: "handler",
  initialState: initialState,
  reducers: {
    commandExecuted: (state, action: PayloadAction<ChatMessage>) => {
      state.lastExecutedMessage = action.payload;
    },
    monarchChanged: (state, action: PayloadAction<string>) => {
      state.currentMonarch = action.payload;
    },
    eligibleUsersUpdated: (state, action: PayloadAction<string[]>) => {
      state.eligibleUsers = action.payload;
    },
  },
});

export { HandlerState };
export const { commandExecuted, monarchChanged, eligibleUsersUpdated } =
  handlerSlice.actions;
export default handlerSlice.reducer;
