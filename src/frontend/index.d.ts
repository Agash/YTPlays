import { handlerAPI, mainAPI, queueAPI } from "./preload";

declare global {
  interface Window {
    queueAPI: typeof queueAPI;
    handlerAPI: typeof handlerAPI;
    mainAPI: typeof mainAPI;
  }
}
