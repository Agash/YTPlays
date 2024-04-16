import { BrowserWindow } from "electron";
import { GameplayHandlerConfig, IGameplayHandler } from "./gameplay-handler";
import { ChatMessage } from "../../../shared/types";
import { PkmnQueue } from "../queue/pkmn-queue";
import { IPC } from "../../../shared/ipc-commands";
import { typeName } from "../utils";

export class NamesHandler implements IGameplayHandler {
  mainWindow: BrowserWindow;
  config: GameplayHandlerConfig;
  timer: NodeJS.Timeout;
  queue = new PkmnQueue();

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
    for (const msg of this.queue.messages) {
      typeName(msg.message);
      this.mainWindow.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, msg);
    }

    this.queue.clear();
  }
}
