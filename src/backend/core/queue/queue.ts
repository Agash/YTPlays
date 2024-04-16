import { ChatMessage, QueueStatistics } from "../../../shared/types";

export interface IQueue {
  statistics: QueueStatistics;
  messages: ChatMessage[];

  enqueue(chatMsg: ChatMessage): void;
}
