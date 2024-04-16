import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class AnarchyHandler implements IGameplayHandler {
  mainWindow: BrowserWindow;
  config: GameplayHandlerConfig;
  timer: NodeJS.Timeout;
  queue = new CommandQueue();

  constructor(config: GameplayHandlerConfig, mainWindow: BrowserWindow) {
    this.config = config;
    this.mainWindow = mainWindow;
    this.timer = setInterval(() => this.handleMessages(), config.timeOutInMs);
  }

  handleChatMessage = (message: ChatMessage) => {
    this.queue.enqueue(message);
  };
  exit = () => {
    clearInterval(this.timer);
  };

  private handleMessages(): void {
    const nextCommand = this.queue.messages.shift();
    if (!nextCommand) return;

    tapKey(nextCommand?.message);
    this.mainWindow.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, nextCommand);
    this.queue.clear();
  }
}
