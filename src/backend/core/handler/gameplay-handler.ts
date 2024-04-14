import { BrowserWindow } from "electron";
import { ChatMessage } from "../../../shared/types";
import { FilteredQueue } from "../queue";

export interface IGameplayHandler {
  mainWindow: BrowserWindow;
  config: GameplayHandlerConfig;
  queue: FilteredQueue;
  handleChatMessage(message: ChatMessage): void;
  exit(): void;
}

export type GameplayHandlerConfig = {
  timeOutInMs: number;
};
