import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ChatMessage } from "../../../shared/types";
import { tapKey } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

export class MonarchyHandler implements IGameplayHandler {
  mainWindow: BrowserWindow;
  config: MonarchyHandlerConfig;
  msgTimer: NodeJS.Timeout;
  monarchTimer: NodeJS.Timeout;
  threshold: number = 2;
  queue: CommandQueue = new CommandQueue();
  currentMonarch: string | undefined;
  userActivity: Record<string, number> = {}; // Track user activity

  constructor(config: MonarchyHandlerConfig, mainWindow: BrowserWindow) {
    this.config = config;
    this.mainWindow = mainWindow;
    this.msgTimer = setInterval(
      () => this.handleMessages(),
      config.timeOutInMs
    );
    this.monarchTimer = setInterval(
      () => this.changeMonarch(),
      config.monarchTimerInMs
    );
  }

  exit(): void {
    clearInterval(this.msgTimer);
    clearInterval(this.monarchTimer);
  }

  handleChatMessage(chatMsg: ChatMessage): void {
    this.queue.enqueue(chatMsg);
    // Update user activity count
    this.userActivity[chatMsg.username] =
      (this.userActivity[chatMsg.username] || 0) + 1;
    const userNames: string[] = Object.keys(this.userActivity).filter(
      (userName) => this.userActivity[userName] >= this.threshold
    );
    this.mainWindow.webContents.send(
      IPC.HANDLER.MONARCHY.UPDATE_ELIGIBLE_USERS,
      userNames
    );

    if (!this.currentMonarch) this.currentMonarch = chatMsg.username;
  }

  setMonarch(username: string, timeOut: 300_000): void {
    this.currentMonarch = username;

    clearInterval(this.monarchTimer);
    setTimeout(() => {
      this.monarchTimer = setInterval(
        () => this.changeMonarch(),
        this.config.monarchTimerInMs
      );
    }, timeOut);
  }

  private handleMessages(): void {
    const messagesWithinTimeframe = this.queue.getMessagesFromUser(
      this.currentMonarch
    );

    for (const command of messagesWithinTimeframe) {
      tapKey(command.message);
      this.mainWindow.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, command);
    }

    this.queue.clear();
  }

  private changeMonarch(): void {
    const userNames: string[] = Object.keys(this.userActivity).filter(
      (userName) => this.userActivity[userName] >= this.threshold
    );

    if (userNames.length === 0) {
      return;
    }

    const randomIndex: number = Math.floor(Math.random() * userNames.length);
    const randomUser: string = userNames[randomIndex];

    this.currentMonarch = randomUser;
    this.mainWindow.webContents.send(
      IPC.HANDLER.MONARCHY.CHANGED_MONARCH,
      randomUser
    );
    this.userActivity = {};
  }
}

export type MonarchyHandlerConfig = GameplayHandlerConfig & {
  monarchTimerInMs: number;
};
