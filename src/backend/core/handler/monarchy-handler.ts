import { IGameplayHandler, GameplayHandlerConfig } from "./gameplay-handler";
import { CommandQueue } from "../queue/command-queue";
import { ButtonPreset, ChatMessage } from "../../../shared/types";
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

  lastExecuted: ChatMessage;

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
    this.queue = new CommandQueue(window, config.buttonPreset);
  }

  exit(): void {
    clearInterval(this.msgTimer);
    clearInterval(this.monarchTimer);
    this.queue.clear(true);

    if (!(this.window.isDestroyed() || this.window.webContents.isDestroyed()))
      this.window?.webContents?.send(IPC.HANDLER.EXECUTED_COMMAND, {});
  }

  handleChatMessage(chatMsg: ChatMessage): void {
    this.queue.enqueue(chatMsg);

    const userNames: string[] = Array.from(this.queue.userStatistics)
      .filter((value) => value[1] >= this.config.monarchThreshold)
      .map((value) => value[0]);

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

  setMonarch(username: string, timeOut: number = null): void {
    clearInterval(this.monarchTimer);
    this.currentMonarch = username;
    this.window.webContents.send(
      IPC.HANDLER.MONARCHY.CHANGED_MONARCH,
      this.currentMonarch
    );

    if (timeOut == null) timeOut = this.config.monarchTimerInMs;
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

    for (const command of monarchMessages) {
      tapKey(command.message, this.config.buttonPreset);
      this.lastExecuted = command;
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
      this.currentMonarch
    );

    this.queue.userStatistics = new Map<string, number>();

    setTimeout(() => {
      if (this.currentMonarch != this.lastExecuted?.username) {
        clearInterval(this.monarchTimer);
        this.changeMonarch();
        this.monarchTimer = setInterval(
          () => this.changeMonarch(),
          this.config.monarchTimerInMs
        );
      }
    }, this.config.inactivityTimerInMs);
  }
}

export type MonarchyHandlerConfig = GameplayHandlerConfig & {
  monarchTimerInMs: number;
  monarchThreshold: number;
  inactivityTimerInMs: number;
  buttonPreset: ButtonPreset;
};
