import { BrowserWindow } from "electron";
import { ChatMessage, QueueStatistics } from "../../../shared/types";
import { isValidCommand } from "../utils";
import { IQueue } from "./queue";
import { IPC } from "../../../shared/ipc-commands";

// Create a class for the filtered queue
export class CommandQueue implements IQueue {
  window: BrowserWindow;
  public commandStatistics: QueueStatistics = new Map<string, number>();
  public userStatistics: QueueStatistics = new Map<string, number>();
  public messages: ChatMessage[] = [];

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  // Add a valid message to the queue
  enqueue(chatMsg: ChatMessage): void {
    if (isValidCommand(chatMsg.message)) {
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
  clear(stats: boolean = false): void {
    this.messages = [];

    if (stats) {
      this.commandStatistics = new Map();
      this.window?.webContents?.send(
        IPC.QUEUE.COMMAND_STATISTICS.UPDATE,
        this.commandStatistics
      );

      this.userStatistics = new Map();
      this.window?.webContents?.send(
        IPC.QUEUE.USER_STATISTICS.UPDATE,
        this.userStatistics
      );
    }
  }
}
