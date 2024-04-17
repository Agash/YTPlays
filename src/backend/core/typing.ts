import { Mode } from "../../shared/types";

export type StoreType = {
  video: {
    id: string;
  };
  settings: {
    mode: Mode;
    democracyCountdown: number;
    monarchyCooldown: number;
    monarchyThreshold: number;
    normalInterval: number;
    username: string;
  };
};
