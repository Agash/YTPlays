import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class MonarchyHandler implements IGameplayHandler {
  window: BrowserWindow;
  config: MonarchyHandlerConfig;
  msgTimer: NodeJS.Timeout;
  monarchTimer: NodeJS.Timeout;
  queue: CommandQueue;
  currentMonarch: string | undefined;

  constructor(config: MonarchyHandlerConfig, window: BrowserWindow) {
    this.config = config;
    this.window = window;
    this.msgTimer = setInterval(
      () => this.handleMessages(),
      config.timeOutInMs
    );
    this.monarchTimer = setInterval(
      () => this.changeMonarch(),
      config.monarchTimerInMs
    );
    this.queue = new CommandQueue(window);
  }

  exit(): void {
    clearInterval(this.msgTimer);
    clearInterval(this.monarchTimer);
    this.queue.clear(true);
    this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  }

  handleChatMessage(chatMsg: ChatMessage): void {
    this.queue.enqueue(chatMsg);

    const userNames: string[] = Array.from(this.queue.userStatistics)
      .filter((value) => value[1] >= this.config.monarchThreshold)
      .map((value) => value[0]);

    console.log(
      "[YTPlays] MONARCH_HANDLER (handleChatMessage)",
      this.config.monarchThreshold,
      this.queue.userStatistics,
      userNames
    );

    this.window.webContents.send(
      IPC.HANDLER.MONARCHY.UPDATE_ELIGIBLE_USERS,
      userNames
    );

    if (!this.currentMonarch) {
      this.currentMonarch = chatMsg.username;
      this.window.webContents.send(
        IPC.HANDLER.MONARCHY.CHANGED_MONARCH,
        chatMsg.username
      );
    }
  }

  setMonarch(username: string, timeOut: 120_000): void {
    this.currentMonarch = username;

    clearInterval(this.monarchTimer);
    setTimeout(() => {
      this.changeMonarch();
      this.monarchTimer = setInterval(
        () => this.changeMonarch(),
        this.config.monarchTimerInMs
      );
    }, timeOut);
  }

  private handleMessages(): void {
    const monarchMessages = this.queue.getMessagesFromUser(this.currentMonarch);

    console.log(
      "[YTPlays] MONARCHY HANDLER: current monarch ",
      this.currentMonarch
    );

    for (const command of monarchMessages) {
      console.log("[YTPlays] MONARCHY HANDLER: handle message ", command);

      tapKey(command.message);
      this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, command);
    }

    this.queue.clear();
  }

  private changeMonarch(): void {
    const userNames: string[] = Array.from(this.queue.userStatistics)
      .filter((value) => value[1] >= this.config.monarchThreshold)
      .map((value) => value[0]);

    if (userNames.length === 0) {
      return;
    }

    const randomIndex: number = Math.floor(Math.random() * userNames.length);
    const randomUser: string = userNames[randomIndex];

    this.currentMonarch = randomUser;
    this.window.webContents.send(
      IPC.HANDLER.MONARCHY.CHANGED_MONARCH,
      randomUser
    );

    this.queue.userStatistics = new Map<string, number>();
  }
}

export type MonarchyHandlerConfig = GameplayHandlerConfig & {
  monarchTimerInMs: number;
  monarchThreshold: number;
};
