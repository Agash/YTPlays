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
    if(monarchMessages.length === 0) return;

    const firstCommands = monarchMessages[0].message.split(" ");

    if (firstCommands.length > 0) {
      tapKey(firstCommands[0], this.config.buttonPreset);

      // handle subsequent commands
      for (let j = 1; j < firstCommands.length; j++) {
        setTimeout(() => {
          tapKey(firstCommands[j], this.config.buttonPreset);
        }, j * 500);
      }
      
      this.lastExecuted = monarchMessages[0];
      this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, monarchMessages[0]);
    } 

    for (let i = 1; i < monarchMessages.length; i++){
      const commands = monarchMessages[i].message.split(" ");

      if (commands.length > 0) {
        tapKey(commands[0], this.config.buttonPreset);
  
        // handle subsequent commands
        for (let j = 1; j < commands.length; j++) {
          setTimeout(() => {
            tapKey(commands[j], this.config.buttonPreset);
          }, j * 500);
        }
        
        this.lastExecuted = monarchMessages[i];
        this.window.webContents.send(IPC.HANDLER.EXECUTED_COMMAND, monarchMessages[i]);
      }  
    }

    this.queue.clear();
  }

  private changeMonarch(resetUserStats = true): void {
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

    if (resetUserStats) {
      this.queue.userStatistics = new Map<string, number>();
    } else {
      this.queue.userStatistics.delete(this.currentMonarch);
    }

    setTimeout(() => {
      if (this.currentMonarch != this.lastExecuted?.username) {
        clearInterval(this.monarchTimer);
        this.changeMonarch(false);
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
