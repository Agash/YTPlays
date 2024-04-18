import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class AnarchyHandler implements IGameplayHandler {
  window: BrowserWindow;
  config: GameplayHandlerConfig;
  timer: NodeJS.Timeout;
  queue: CommandQueue;

  constructor(config: GameplayHandlerConfig, window: BrowserWindow) {
    this.config = config;
    this.window = window;
    this.timer = setInterval(() => this.handleMessages(), config.timeOutInMs);
    this.queue = new CommandQueue(window);
  }

  handleChatMessage = (message: ChatMessage) => {
    this.queue.enqueue(message);
  };
  exit = () => {
    clearInterval(this.timer);
    this.queue.clear(true);

    if (!(this.window.isDestroyed() || this.window.webContents.isDestroyed()))
      this.window?.webContents?.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  };

  private handleMessages(): void {
    const nextCommand = this.queue.messages.shift();
    if (!nextCommand) return;

    console.log("[YTPlays] ANARCHY HANDLER: handle message ", nextCommand);

    tapKey(nextCommand?.message);
    this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, nextCommand);
    this.queue.clear();
  }
}
