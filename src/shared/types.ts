type QueueStatistics = Map<string, number>;

type Mode = "democracy" | "monarchy" | "anarchy";

interface ChatMessage {
  username?: string;
  timestamp?: Date;
  message: string;
}

export { QueueStatistics, ChatMessage, Mode };
