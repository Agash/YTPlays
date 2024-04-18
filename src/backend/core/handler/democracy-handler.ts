import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class DemocracyHandler implements IGameplayHandler {
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
    const commands = [...this.queue.commandStatistics.keys()];
    if (commands.length > 0) {
      const mostPopularCommand = commands.reduce((a, b) =>
        this.queue.commandStatistics.get(a) >
        this.queue.commandStatistics.get(b)
          ? a
          : b
      );

      console.log(
        "[YTPlays] DEMOCRACY HANDLER: handle message ",
        mostPopularCommand
      );

      tapKey(mostPopularCommand);
      this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, {
        message: mostPopularCommand,
      });
    }

    this.queue.clear(true);
  }
}
