import { BrowserWindow } from "electron";
import { GameplayHandlerConfig, IGameplayHandler } from "./gameplay-handler";
import { ChatMessage } from "../../../shared/types";
import { PkmnQueue } from "../queue/pkmn-queue";
import { tapKey, tapName } from "../utils";
import { IPC } from "../../../shared/ipc-commands";

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
    const commands = [...this.queue.statistics.keys()];
    if (commands.length > 0) {
      const mostPopularCommand = commands.reduce((a, b) =>
        this.queue.statistics.get(a) > this.queue.statistics.get(b) ? a : b
      );

      tapName(mostPopularCommand);
      this.mainWindow.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, {
        message: mostPopularCommand,
      });
    }

    this.queue.clear();
  }
}
