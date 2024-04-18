import { BrowserWindow } from "electron";
import { ChatMessage } from "../../../shared/types";
import { IQueue } from "../queue/queue";

export interface IGameplayHandler {
  window: BrowserWindow;
  config: GameplayHandlerConfig;
  queue: IQueue;
  handleChatMessage(message: ChatMessage): void;
  exit(): void;
}

export type GameplayHandlerConfig = {
  timeOutInMs: number;
};
