import { ChatMessage, QueueStatistics } from "../../../shared/types";

export interface IQueue {
  statistics: QueueStatistics;

  enqueue(chatMsg: ChatMessage): void;
  dequeue(): ChatMessage | undefined;
}
