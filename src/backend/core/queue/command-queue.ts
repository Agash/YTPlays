import { ChatMessage, QueueStatistics } from "../../../shared/types";
import { isValidCommand } from "../utils";

// Create a class for the filtered queue
export class CommandQueue {
  public statistics: QueueStatistics = new Map<string, number>();
  private messages: ChatMessage[] = [];

  // Add a valid message to the queue
  enqueue(chatMsg: ChatMessage): void {
    if (isValidCommand(chatMsg.message)) {
      this.messages.push(chatMsg);
      this.statistics.set(
        chatMsg.message,
        (this.statistics.get(chatMsg.message) || 0) + 1
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

    this.statistics.set(
      chatMsg.message,
      (this.statistics.get(chatMsg.message) || 1) - 1
    );
    return chatMsg;
  }

  // Get all messages from a specific user
  getMessagesFromUser = (username: string): ChatMessage[] =>
    this.messages.filter((msg) => msg.username === username);

  // Clear all messages from the queue
  clear(): void {
    this.messages = [];
    this.statistics = new Map();
  }
}
