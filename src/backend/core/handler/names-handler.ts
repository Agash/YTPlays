import { BrowserWindow } from "electron";
import { GameplayHandlerConfig, IGameplayHandler } from "./gameplay-handler";
import { ChatMessage } from "../../../shared/types";
import { PkmnQueue } from "../queue/pkmn-queue";
import { IPC } from "../../../shared/ipc-commands";
import { typeName } from "../utils";

export class NamesHandler implements IGameplayHandler {
  window: BrowserWindow;
  config: GameplayHandlerConfig;
  timer: NodeJS.Timeout;
  queue: PkmnQueue;
  userActivity: Record<string, number> = {}; // Track user activity

  constructor(config: GameplayHandlerConfig, window: BrowserWindow) {
    this.config = config;
    this.window = window;
    this.timer = setInterval(() => this.handleMessages(), config.timeOutInMs);
    this.queue = new PkmnQueue(window);
  }

  handleChatMessage = (message: ChatMessage) => {
    this.queue.enqueue(message);

    // Update user activity count
    this.userActivity[message.username] =
      (this.userActivity[message.username] || 0) + 1;
  };

  exit = () => {
    clearInterval(this.timer);
    this.queue.clear(true);
    this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  };

  private handleMessages(): void {
    for (const msg of this.queue.messages) {
      console.log("[YTPlays] NAMES HANDLER: handle message ", msg);
      typeName(msg.message);
      this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, msg);
    }

    this.queue.clear();
  }
}
