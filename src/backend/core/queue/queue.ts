import { BrowserWindow } from "electron";
import { ChatMessage, QueueStatistics } from "../../../shared/types";

export interface IQueue {
  window: BrowserWindow;
  commandStatistics: QueueStatistics;
  userStatistics: QueueStatistics;
  messages: ChatMessage[];

  enqueue(chatMsg: ChatMessage): void;
}
