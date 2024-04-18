import { ChatMessage, QueueStatistics } from "../../../shared/types";
import { IQueue } from "./queue";
import { isValidPkmnName } from "../utils";
import { BrowserWindow } from "electron";
import { IPC } from "../../../shared/ipc-commands";

// Create a class for the filtered queue
export class PkmnQueue implements IQueue {
  window: BrowserWindow;
  public commandStatistics: QueueStatistics = new Map<string, number>();
  public userStatistics: QueueStatistics = new Map<string, number>();
  public messages: ChatMessage[] = [];

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  // Add a valid message to the queue
  enqueue(chatMsg: ChatMessage): void {
    if (isValidPkmnName(chatMsg.message)) {
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

  // Retrieve the next message from the queue
  dequeue(): ChatMessage | undefined {
    const chatMsg = this.messages.shift();
    if (!chatMsg) return;
    return chatMsg;
  }

  // Get all messages from a specific user
  getMessagesFromUser = (username: string): ChatMessage[] =>
    this.messages.filter((msg) => msg.username === username);

  // Clear all messages from the queue
  clear(stats: boolean = false): void {
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
