import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ButtonPreset, ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class AnarchyHandler implements IGameplayHandler {
  window: BrowserWindow;
  config: AnarchyHandlerConfig;
  timer: NodeJS.Timeout;
  queue: CommandQueue;

  acceptMessages = true;

  constructor(config: AnarchyHandlerConfig, window: BrowserWindow) {
    this.config = config;
    this.window = window;
    this.timer = setInterval(() => this.handleMessages(), config.timeOutInMs);
    this.queue = new CommandQueue(window, config.buttonPreset);
  }

  handleChatMessage = (message: ChatMessage) => {
    if (this.acceptMessages) {
      this.queue.enqueue(message);
    }
  };

  exit = () => {
    clearInterval(this.timer);
    this.queue.clear(true);

    if (!(this.window.isDestroyed() || this.window.webContents.isDestroyed()))
      this.window?.webContents?.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  };

  private switchAcceptMessages(): void {
    this.acceptMessages = !this.acceptMessages;
  }

  private handleMessages(): void {
    const nextCommand = this.queue.messages.shift();
    if (!nextCommand) return;

    console.log("[YTPlays] ANARCHY HANDLER: handle message ", nextCommand);

    tapKey(nextCommand?.message, this.config.buttonPreset);

    this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, nextCommand);

    this.acceptMessages = false;
    setTimeout(() => this.switchAcceptMessages(), this.config.streamDelay);
    this.queue.clear();
  }
}

export type AnarchyHandlerConfig = GameplayHandlerConfig & {
  streamDelay: number;
  buttonPreset: ButtonPreset;
};
