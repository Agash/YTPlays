import { BrowserWindow } from "electron";
import {
  ButtonPreset,
  ChatMessage,
  QueueStatistics,
} from "../../../shared/types";
import { isValidCommand } from "../utils";
import { IQueue } from "./queue";
import { IPC } from "../../../shared/ipc-commands";

// Create a class for the filtered queue
export class CommandQueue implements IQueue {
  window: BrowserWindow;
  buttonPreset: ButtonPreset;

  public commandStatistics: QueueStatistics = new Map<string, number>();
  public userStatistics: QueueStatistics = new Map<string, number>();
  public messages: ChatMessage[] = [];

  constructor(window: BrowserWindow, buttonPreset: ButtonPreset = "normal") {
    this.window = window;
    this.buttonPreset = buttonPreset;
  }

  // Add a valid message to the queue
  enqueue(chatMsg: ChatMessage): void {
    if (isValidCommand(chatMsg.message, this.buttonPreset)) {
      this.messages.push(chatMsg);

      this.commandStatistics.set(
        chatMsg.message,
        (this.commandStatistics.get(chatMsg.message) || 0) + 1
      );
      this.window.webContents.send(
        IPC.QUEUE.COMMAND_STATISTICS.UPDATE,
        this.commandStatistics
      );

      this.userStatistics.set(
        chatMsg.username,
        (this.userStatistics.get(chatMsg.username) || 0) + 1
      );
      this.window.webContents.send(
        IPC.QUEUE.USER_STATISTICS.UPDATE,
        this.userStatistics
      );
    } else {
      console.warn(
        `[YTPlays] Invalid command "${chatMsg.message}" received. Ignoring.`
      );
    }
  }

  // Get all messages from a specific user
  getMessagesFromUser = (username: string): ChatMessage[] =>
    this.messages.filter((msg) => msg.username === username);

  // Clear all messages from the queue
  clear(stats = false): void {
    this.messages = [];

    if (stats) {
      this.commandStatistics = new Map();
      this.userStatistics = new Map();

      if (
        !(this.window.webContents.isDestroyed() || this.window.isDestroyed())
      ) {
        this.window?.webContents?.send(
          IPC.QUEUE.COMMAND_STATISTICS.UPDATE,
          this.commandStatistics
        );

        this.window?.webContents?.send(
          IPC.QUEUE.USER_STATISTICS.UPDATE,
          this.userStatistics
        );
      }
    }
  }
}
