import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class DemocracyHandler implements IGameplayHandler {
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
    this.queue.clear();
  };

  private handleMessages(): void {
    const commands = [...this.queue.statistics.keys()];
    if (commands.length > 0) {
      const mostPopularCommand = commands.reduce((a, b) =>
        this.queue.statistics.get(a) > this.queue.statistics.get(b) ? a : b
      );

      console.log(
        "[YTPlays] DEMOCRACY HANDLER: handle message ",
        mostPopularCommand
      );

      tapKey(mostPopularCommand);
      this.mainWindow.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, {
        message: mostPopularCommand,
      });
    }

    this.queue.clear();
  }
}
