type QueueStatistics = Map<string, number>;

type Mode = "democracy" | "monarchy" | "anarchy" | "names";
type ButtonPreset = "normal" | "pokerogue" | "custom";

interface ChatMessage {
  username?: string;
  timestamp?: Date;
  message: string;
}

export { QueueStatistics, ChatMessage, Mode, ButtonPreset };
