import { ButtonPreset, Mode } from "../../shared/types";

export type StoreType = {
  video: {
    id: string;
  };
  settings: {
    mode: Mode;
    buttonPreset: ButtonPreset;
    democracyCountdown: number;
    monarchyCooldown: number;
    monarchyThreshold: number;
    normalInterval: number;
    streamDelay: number;
  };
};
