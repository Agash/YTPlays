// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron/renderer";
import { IPC } from "../shared/ipc-commands";
import { ChatMessage, Mode, QueueStatistics } from "../shared/types";
import { ConfigState } from "./slices/configSlice";

const queueAPI = {
  onUpdateStats: (callback: (stats: QueueStatistics) => void) =>
    ipcRenderer.on(IPC.QUEUE.STATISTICS.UPDATE, (_event, value) =>
      callback(value)
    ),
};

const handlerAPI = {
  onExecutedCommand: (callback: (message: ChatMessage) => void) =>
    ipcRenderer.on(IPC.HANDLER.EXECUTED_COMMAND, (_event, value) =>
      callback(value)
    ),
  onMonarchChanged: (callback: (username: string) => void) =>
    ipcRenderer.on(IPC.HANDLER.MONARCHY.CHANGED_MONARCH, (_event, value) =>
      callback(value)
    ),
  onEligibleUsersUpdated: (callback: (usernames: string[]) => void) =>
    ipcRenderer.on(
      IPC.HANDLER.MONARCHY.UPDATE_ELIGIBLE_USERS,
      (_event, value) => callback(value)
    ),
};

const mainAPI = {
  onConfig: (callback: (config: ConfigState) => void) => {
    const subscription = (_: Electron.IpcRendererEvent, config: ConfigState) =>
      callback(config);
    ipcRenderer.on(IPC.MAIN.CONFIG, subscription);

    return () => {
      ipcRenderer.removeListener(IPC.MAIN.CONFIG, subscription);
    };
  },
  getConfig: () => ipcRenderer.send(IPC.MAIN.GET_CONFIG),
  setConfig: (config: ConfigState) =>
    ipcRenderer.send(IPC.MAIN.SET_CONFIG, config),
  startRun: () => ipcRenderer.send(IPC.MAIN.START),
  stopRun: () => ipcRenderer.send(IPC.MAIN.STOP),
};

contextBridge.exposeInMainWorld("queueAPI", queueAPI);
contextBridge.exposeInMainWorld("handlerAPI", handlerAPI);
contextBridge.exposeInMainWorld("mainAPI", mainAPI);

export { queueAPI, handlerAPI, mainAPI };
