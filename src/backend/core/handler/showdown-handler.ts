import { BrowserWindow } from "electron";
import { GameplayHandlerConfig, IGameplayHandler } from "./gameplay-handler";
import { ChatMessage } from "../../../shared/types";
import { PokemonNamesQueue } from "../queue/pokemon-names-queue";
import { IPC } from "../../../shared/ipc-commands";
import { typeName } from "../utils";

export class ShowdownHandler implements IGameplayHandler {
  window: BrowserWindow;
  config: ShowdownHandlerConfig;
  timer: NodeJS.Timeout;
  queue: PokemonNamesQueue;
  userActivity: Record<string, number> = {}; // Track user activity

  constructor(config: ShowdownHandlerConfig, window: BrowserWindow, showdownWindow: BrowserWindow) {
    this.config = config;
    this.window = window;
    this.timer = setInterval(() => this.handleMessages(), config.timeOutInMs);
    this.queue = new PokemonNamesQueue(window);
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

    if (!(this.window.isDestroyed() || this.window.webContents.isDestroyed()))
      this.window?.webContents?.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  };

  private handleMessages(): void {
    for (const msg of this.queue.messages) {
      typeName(msg.message);
      this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, msg);
    }

    this.queue.clear();
  }
}

export type ShowdownHandlerConfig = GameplayHandlerConfig & {
    // streamDelay: number;
  };