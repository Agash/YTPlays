// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron/renderer";
import { IPC } from "../shared/ipc-commands";
import { ChatMessage, Mode, QueueStatistics } from "../shared/types";

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
  requestInitialData: async () =>
    await ipcRenderer.invoke(IPC.MAIN.REQUEST_INITIAL_DATA),
  onVideoIdSet: (callback: (id: string) => void) =>
    ipcRenderer.on(IPC.MAIN.VIDEO_ID_SET, (_event, value) => callback(value)),
  onModeSet: (callback: (mode: Mode) => void) =>
    ipcRenderer.on(IPC.MAIN.MODE_SET, (_event, value) => callback(value)),
  onDemocracyCountdownSet: (callback: (value: number) => void) =>
    ipcRenderer.on(IPC.MAIN.DEMOCRACY_COUNTDOWN_SET, (_event, value) =>
      callback(value)
    ),
  onMonarchyCooldownSet: (callback: (value: number) => void) =>
    ipcRenderer.on(IPC.MAIN.MONARCHY_COOLDOWN_SET, (_event, value) =>
      callback(value)
    ),
  onNormalIntervalSet: (callback: (value: number) => void) =>
    ipcRenderer.on(IPC.MAIN.NORMAL_INTERVAL_SET, (_event, value) =>
      callback(value)
    ),
  startRun: () => ipcRenderer.send(IPC.MAIN.START),
  stopRun: () => ipcRenderer.send(IPC.MAIN.STOP),
  setVideoId: (id: string) => ipcRenderer.send(IPC.MAIN.SET_VIDEO_ID, id),
  setMode: (mode: Mode) => ipcRenderer.send(IPC.MAIN.SET_MODE, mode),
  setDemocracyCountdown: (value: number) =>
    ipcRenderer.send(IPC.MAIN.SET_DEMOCRACY_COUNTDOWN, value),
  setMonarchyCooldown: (value: number) =>
    ipcRenderer.send(IPC.MAIN.SET_MONARCHY_COOLDOWN, value),
  setNormalInterval: (value: number) =>
    ipcRenderer.send(IPC.MAIN.SET_NORMAL_INTERVAL, value),
};

contextBridge.exposeInMainWorld("queueAPI", queueAPI);
contextBridge.exposeInMainWorld("handlerAPI", handlerAPI);
contextBridge.exposeInMainWorld("mainAPI", mainAPI);

export { queueAPI, handlerAPI, mainAPI };
