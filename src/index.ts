import { app, BrowserWindow, ipcMain } from "electron";
import Store from "electron-store";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import { updateElectronApp } from "update-electron-app";
import { StoreType } from "./backend/core/typing";
import { LiveChat } from "./backend/core/yt/live-chat";
import { IPC } from "./shared/ipc-commands";
import { ButtonPreset, Mode } from "./shared/types";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

updateElectronApp();

const store = new Store<StoreType>({
  schema: {
    video: {
      type: "object",
      default: {
        id: "0",
      },
      properties: {
        id: {
          type: "string",
          default: "0",
        },
      },
      required: ["id"],
    },
    settings: {
      type: "object",
      default: {
        mode: "democracy",
        buttonPreset: "normal",
        democracyCountdown: 15000,
        monarchyCooldown: 25000,
        monarchyThreshold: 2,
        inactivityTimerInMs: 1500,
        normalInterval: 1500,
        streamDelay: 1500,
      },
      properties: {
        mode: {
          type: "string",
          enum: ["democracy", "monarchy", "anarchy", "names"],
          default: "democracy",
        },
        buttonPreset: {
          type: "string",
          enum: ["normal", "pokerogue"],
          default: "normal",
        },
        democracyCountdown: {
          type: "number",
          default: 15000,
        },
        monarchyCooldown: {
          type: "number",
          default: 25000,
        },
        monarchyThreshold: {
          type: "number",
          default: 2,
        },
        inactivityTimerInMs: {
          type: "number",
          default: 1500,
        },
        normalInterval: {
          type: "number",
          default: 1500,
        },
        streamDelay: {
          type: "number",
          default: 1500,
        },
      },
      required: ["mode"],
    },
  },
});

const chat = new LiveChat();

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 530,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // if (!app.isPackaged) mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  const mainWindow = createWindow();

  ipcMain.on(IPC.MAIN.GET_CONFIG, (_) => {
    const data = {
      videoId: store.get("video.id"),
      mode: store.get("settings.mode"),
      buttonPreset: store.get("settings.buttonPreset"),
      democracyCountdown: store.get("settings.democracyCountdown"),
      monarchyCooldown: store.get("settings.monarchyCooldown"),
      monarchyThreshold: store.get("settings.monarchyThreshold"),
      inactivityTimerInMs: store.get("settings.inactivityTimerInMs"),
      normalInterval: store.get("settings.normalInterval"),
      streamDelay: store.get("settings.streamDelay"),
    };

    mainWindow.webContents.send(IPC.MAIN.CONFIG, data);
  });

  ipcMain.on(IPC.MAIN.START, async (_) => {
    await chat.start(mainWindow, store.store);
  });

  ipcMain.on(IPC.MAIN.STOP, (_) => {
    chat.stop();
  });

  ipcMain.on(
    IPC.MAIN.SET_CONFIG,
    (
      _,
      config: {
        videoId: string;
        mode: Mode;
        buttonPreset: ButtonPreset;
        democracyCountdown: number;
        monarchyCooldown: number;
        monarchyThreshold: number;
        inactivityTimerInMs: number;
        normalInterval: number;
        streamDelay: number;
      }
    ) => {
      store.set("video", { id: config.videoId });
      store.set("settings", {
        mode: config.mode,
        buttonPreset: config.buttonPreset,
        democracyCountdown: config.democracyCountdown,
        monarchyCooldown: config.monarchyCooldown,
        monarchyThreshold: config.monarchyThreshold,
        inactivityTimerInMs: config.inactivityTimerInMs,
        normalInterval: config.normalInterval,
        streamDelay: config.streamDelay,
      });

      mainWindow.webContents.send(IPC.MAIN.CONFIG, config);
    }
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    .then((name) => console.log(`[YTPlays] Added Extension:  ${name}`))
    .catch((err) => console.log("[YTPlays] An error occurred: ", err));
});
